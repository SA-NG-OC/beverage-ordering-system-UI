import { useNavigate } from "react-router-dom";

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        {/* 404 Code */}
        <h1 className="text-9xl font-extrabold text-indigo-600 tracking-widest">404</h1>

        {/* Status Badge */}
        <div className="bg-indigo-600 text-white text-sm px-3 py-1 rounded rotate-12 inline-block -mt-8 mb-6 font-medium shadow-md">
          Page Not Found
        </div>

        {/* Headline & Description */}
        <h2 className="text-2xl font-bold text-gray-800 md:text-3xl mb-2">Oops! Page not found.</h2>
        <p className="text-gray-500 mb-8">
          Sorry, the page you are looking for doesn't exist, has been removed, or the link is
          broken.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Go Back
          </button>

          <button
            onClick={() => navigate("/")}
            className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};
