import { authApi } from "@/api/authApi";
import type { UserResponseDto } from "@/types/auth.type";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function useAuth() {
  function getUser(): UserResponseDto | null {
    const user = localStorage.getItem("user");

    if (!user) return null;

    try {
      return JSON.parse(user);
    } catch {
      return null;
    }
  }
  const [user, setUser] = useState<UserResponseDto | null>(getUser);
  const [isLoading, setIsLoading] = useState<boolean>(() => !!localStorage.getItem("accessToken"));
  const navigate = useNavigate();

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore logout API failure and clear local credentials anyway
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      setUser(null);
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      return;
    }

    authApi
      .getMe()
      .then((response) => {
        const userData = response.data.data;
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      })
      .catch(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isStaff: user?.role === "staff",
    isCustomer: user?.role === "customer",
    logout,
  };
}
