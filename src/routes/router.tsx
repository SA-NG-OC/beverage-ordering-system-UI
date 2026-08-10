import { createBrowserRouter, Navigate } from "react-router-dom";
import { AuthLayout } from "@/layouts/AuthLayout";
import { LoginPage } from "@/feature/auth/pages/LoginPage";
import { RegisterPage } from "@/feature/auth/pages/RegisterPage";

export const router = createBrowserRouter([
    {
        element: <AuthLayout />,
        children: [
            {
                path: "/login",
                element: <LoginPage />,
            },
            {
                path: "/register",
                element: <RegisterPage />,
            },
        ],
    },
    {
        path: "/",
        element: <Navigate to="/login" replace />,
    },
]);
