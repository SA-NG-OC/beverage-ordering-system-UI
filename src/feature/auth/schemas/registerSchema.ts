import { z } from "zod";

export const RegisterSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .min(2, "Full name must be at least 2 characters long"),

  email: z.email("Invalid email format").min(1, "Email is required"),

  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters long"),

  phone: z.string().optional(),
});

export type RegisterDataForm = z.infer<typeof RegisterSchema>;
