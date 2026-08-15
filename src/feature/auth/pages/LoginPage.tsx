import { useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { loginSchema, type LoginFormData } from "../schemas/loginSchemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { authApi } from "@/api/authApi"
import { Role } from "@/types/enum/role.enum"
import axios from "axios"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FormField } from "@/components/FormField"

export function LoginPage() {
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (formData: LoginFormData) => {
    try {
      setServerError(null)
      const response = await authApi.login(formData)
      const { accessToken, user } = response.data.data

      localStorage.setItem("accessToken", accessToken)
      localStorage.setItem("user", JSON.stringify(user))

      // Điều hướng theo role
      if (user.role === Role.ADMIN) {
        navigate("/admin/products")
      } else if (user.role === Role.STAFF) {
        navigate("/staff/products")
      } else {
        navigate("/products")
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message
        setServerError(
          Array.isArray(message)
            ? message.join(", ")
            : (message ?? "An error occurred. Please try again")
        )
      }
    }
  }

  return (
    <Card className="w-full max-w-md shadow-md border-border bg-card">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-xl font-bold tracking-tight">Login</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Enter your email and password to access your account
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {serverError && (
          <Alert variant="destructive">
            <AlertDescription className="text-xs">{serverError}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Email" error={errors.email?.message} required id="email">
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
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
            Sign In
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground pt-2">
          Don't have an account yet?{" "}
          <Link to="/register" className="font-semibold text-primary hover:underline">
            Register
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}

export default LoginPage
