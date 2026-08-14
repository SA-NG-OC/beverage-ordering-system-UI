const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const OpenAI = require("openai").default;
const { Octokit } = require("@octokit/rest");

const REPO_ROOT = process.cwd();
const MAX_ITERATIONS = 8; // safety cap so we don't blow through the ~40 req/min free-tier limit

// ---------- Tool implementations ----------
// Every tool resolves paths against REPO_ROOT and refuses to leave it,
// so the model can't read files outside the checked-out repo.

function safeResolve(relativePath) {
    const resolved = path.resolve(REPO_ROOT, relativePath || ".");
    if (!resolved.startsWith(REPO_ROOT)) {
        throw new Error("Path escapes repository root, refusing to read.");
    }
    return resolved;
}

function readFile(args) {
    const filePath = safeResolve(args.path);
    if (!fs.existsSync(filePath)) return `File not found: ${args.path}`;
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) return `${args.path} is a directory, use list_directory instead.`;
    const content = fs.readFileSync(filePath, "utf8");
    // Cap per-file size so one huge file can't blow the context window
    return content.length > 8000 ? content.slice(0, 8000) + "\n...[truncated]" : content;
}

function listDirectory(args) {
    const dirPath = safeResolve(args.path || ".");
    if (!fs.existsSync(dirPath)) return `Directory not found: ${args.path}`;
    return fs.readdirSync(dirPath, { withFileTypes: true })
        .map((e) => (e.isDirectory() ? `${e.name}/` : e.name))
        .join("\n");
}

function searchCode(args) {
    try {
        const out = execSync(
            `grep -rn --exclude-dir=.git --exclude-dir=node_modules -m 20 -- ${JSON.stringify(args.query)} .`,
            { cwd: REPO_ROOT, encoding: "utf8", maxBuffer: 1024 * 1024 }
        );
        return out || "No matches found.";
    } catch (err) {
        // grep exits non-zero when there are no matches - that's not a real error
        return err.stdout || "No matches found.";
    }
}

function getFileHistory(args) {
    try {
        const filePath = args.path;
        const out = execSync(
            `git log -3 --pretty=format:"%h %ad %s" --date=short -- ${JSON.stringify(filePath)}`,
            { cwd: REPO_ROOT, encoding: "utf8" }
        );
        return out || "No history found for this file.";
    } catch (err) {
        return `Could not read history: ${err.message}`;
    }
}

const TOOL_IMPLEMENTATIONS = {
    read_file: readFile,
    list_directory: listDirectory,
    search_code: searchCode,
    get_file_history: getFileHistory,
};

const TOOL_DEFINITIONS = [
    {
        type: "function",
        function: {
            name: "read_file",
            description: "Read the full text content of a file in the repository, to see context beyond the diff.",
            parameters: {
                type: "object",
                properties: { path: { type: "string", description: "Path relative to the repo root, e.g. src/utils.js" } },
                required: ["path"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "list_directory",
            description: "List files and subfolders inside a directory of the repository.",
            parameters: {
                type: "object",
                properties: { path: { type: "string", description: "Directory path relative to repo root, e.g. src/" } },
                required: ["path"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "search_code",
            description: "Search the whole repository for a text pattern (like grep), useful for finding where a function or variable is defined or used elsewhere.",
            parameters: {
                type: "object",
                properties: { query: { type: "string", description: "Text or regex pattern to search for" } },
                required: ["query"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "get_file_history",
            description: "Get the last 3 commits that touched a given file, to understand recent changes and intent.",
            parameters: {
                type: "object",
                properties: { path: { type: "string", description: "Path relative to repo root" } },
                required: ["path"],
            },
        },
    },
];

// ---------- Agent loop ----------

async function main() {
    const diff = fs.readFileSync("pr_diff.patch", "utf8");
    if (!diff.trim()) return;

    const openai = new OpenAI({
        apiKey: process.env.NVIDIA_API_KEY,
        baseURL: "https://integrate.api.nvidia.com/v1",
    });

    const systemPrompt = [
        "You are a senior software engineer performing a thorough Pull Request (PR) code review.",
        "Respond entirely in English, regardless of the language used in the code, comments, or commit messages.",
        "",
        "You have tools to read other files in the repository, list directories, search the codebase, and check file history.",
        "Use them whenever the diff alone doesn't give you enough context to judge correctness -",
        "for example, to check a function's callers before flagging a signature change, or to see a type/interface a diff references.",
        "Don't call tools you don't need; a small diff often needs zero tool calls.",
        "",
        "Once you have enough context, STOP calling tools and produce your final review as plain text with these sections:",
        "1. **Summary**: concise summary of the key changes.",
        "2. **Issues & Bugs**: potential bugs, security issues, edge cases, performance problems. State explicitly if none found.",
        "3. **Improvements & Best Practices**: actionable suggestions on clean code, naming, design, refactoring.",
        "4. **Suggested PR Description**: a structured template with Problem / Solution / Testing / Related Issues (mark N/A if not inferable).",
    ].join("\n");

    const userPrompt = `Git diff content:\n${diff.substring(0, 30000)}`;

    const messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
    ];

    let finalContent = "";
    const toolLog = [];

    for (let iteration = 0; iteration < MAX_ITERATIONS; iteration++) {
        console.log(`Agent iteration ${iteration + 1}...`);

        const completion = await openai.chat.completions.create({
            model: "nvidia/nemotron-3.5-lightning-30b-a3b",
            messages,
            tools: TOOL_DEFINITIONS,
            tool_choice: "auto",
            temperature: 0.6,
            max_tokens: 4096,
        });

        const message = completion.choices[0].message;
        messages.push(message);

        if (!message.tool_calls || message.tool_calls.length === 0) {
            // Model is done - this is the final review
            finalContent = message.content || "";
            break;
        }

        for (const toolCall of message.tool_calls) {
            const { name, arguments: rawArgs } = toolCall.function;
            let args = {};
            try {
                args = JSON.parse(rawArgs || "{}");
            } catch {
                // leave args empty if the model sent malformed JSON
            }

            console.log(`  -> tool call: ${name}(${JSON.stringify(args)})`);
            toolLog.push(`${name}(${JSON.stringify(args)})`);

            let result;
            try {
                const impl = TOOL_IMPLEMENTATIONS[name];
                result = impl ? impl(args) : `Unknown tool: ${name}`;
            } catch (err) {
                result = `Error running ${name}: ${err.message}`;
            }

            messages.push({
                role: "tool",
                tool_call_id: toolCall.id,
                content: String(result).slice(0, 6000),
            });
        }
    }

    if (!finalContent) {
        finalContent = "_The agent used its full tool-call budget without producing a final review. Consider raising MAX_ITERATIONS or simplifying the PR._";
    }

    let commentBody = "🤖 **AI PR Reviewer Agent (NVIDIA Nemotron)**\n\n";
    if (toolLog.length > 0) {
        commentBody += `<details>\n<summary>🔧 Tools used (${toolLog.length} calls)</summary>\n\n\`\`\`\n${toolLog.join("\n")}\n\`\`\`\n\n</details>\n\n---\n\n`;
    }
    commentBody += finalContent;

    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
    const [owner, repo] = process.env.REPO.split("/");

    await octokit.issues.createComment({
        owner,
        repo,
        issue_number: parseInt(process.env.PR_NUMBER, 10),
        body: commentBody,
    });

    console.log("Review comment posted successfully!");
}

main().catch((err) => {
    console.error("Error during PR review execution:", err);
    process.exit(1);
});