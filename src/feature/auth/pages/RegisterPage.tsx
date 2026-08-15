import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { RegisterSchema, type RegisterDataForm } from "../schemas/registerSchema";
import { authApi } from "@/api/authApi";
import axios from "axios";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FormField } from "@/components/FormField";
import { zodResolver } from "@hookform/resolvers/zod";

export function RegisterPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterDataForm>({
    resolver: zodResolver(RegisterSchema),
  });

  const onSubmit = async (formData: RegisterDataForm) => {
    try {
      setServerError(null);
      setSuccessMessage(null);

      await authApi.register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      });

      setSuccessMessage("Registration successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;
        setServerError(
          Array.isArray(message)
            ? message.join(", ")
            : (message ?? "An error occurred during registration. Please try again.")
        );
      } else {
        setServerError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <Card className="w-full max-w-md shadow-md border-border bg-card">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-xl font-bold tracking-tight">Create an Account</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Enter your details below to register a new account
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {serverError && (
          <Alert variant="destructive">
            <AlertDescription className="text-xs">{serverError}</AlertDescription>
          </Alert>
        )}

        {successMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900 rounded-lg text-xs font-medium animate-in fade-in-50">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Full Name" error={errors.fullName?.message} required id="fullName">
            <Input
              id="fullName"
              type="text"
              placeholder="John Doe"
              {...register("fullName")}
              className="h-9 text-xs sm:text-sm"
            />
          </FormField>

          <FormField label="Email" error={errors.email?.message} required id="email">
            <Input
              id="email"
              type="email"
              placeholder="customer@example.com"
              {...register("email")}
              className="h-9 text-xs sm:text-sm"
            />
          </FormField>

          <FormField label="Password" error={errors.password?.message} required id="password">
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              className="h-9 text-xs sm:text-sm"
            />
          </FormField>

          <Button type="submit" variant="default" isLoading={isSubmitting} className="w-full h-9">
            Create Account
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground pt-2">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Login
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

export default RegisterPage;
