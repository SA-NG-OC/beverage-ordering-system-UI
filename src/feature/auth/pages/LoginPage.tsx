import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { loginSchema, type LoginFormData } from "../schemas/loginSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { authApi } from "@/api/authApi";
import { Role } from "@/types/enum/role.enum";
import axios from "axios";
import { Button } from "@/components/ui/Button";

export function LoginPage() {
    const navigate = useNavigate();
    const [serverError, setServerError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (formData: LoginFormData) => {
        try {
            setServerError(null);
            const response = await authApi.login(formData);
            const { accessToken, user } = response.data.data;

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('user', JSON.stringify(user));

            // Điều hướng theo role
            if (user.role === Role.ADMIN) {
                navigate('/admin/products');
            }
            else if (user.role === Role.STAFF) {
                navigate('/staff/products');
            }
            else {
                navigate('/products');
            }
        }
        catch (error: any) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message;

                setServerError(
                    Array.isArray(message)
                        ? message.join(', ')
                        : message ?? 'An error occurred. Please try again'
                );
            }
        }
    }

    return (
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <h1 className="text-2xl font-bold text-center mb-6">
                Login
            </h1>
            {serverError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                    {serverError}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* email field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                    </label>
                    <input type="email"
                        {...register('email')}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2
                    ${errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}
                        placeholder="customer@gmail.com" />
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                </div>

                {/* Password field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input type="password"
                        {...register('password')}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2
                        ${errors.password ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`} placeholder="••••••" />
                    {errors.password && (
                        <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>)}
                </div>

                {/* Submit Button */}
                <Button type="submit" variant="primary" isLoading={isSubmitting} className="w-full">
                    Login
                </Button>
            </form>
            <p className="mt-4 text-center text-sm text-gray-600">
                Don't have an account yet?{' '}
                <Link to="/register" className="text-blue-600 hover:underline">
                    Register
                </Link>
            </p>
        </div>
    )
}