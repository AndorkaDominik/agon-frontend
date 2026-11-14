"use client";
import { getCurrentUser, logout as logoutApi } from "@/app/lib/auth";
import { createContext, useState, useEffect, useContext, type ReactNode } from "react";
import type { AuthUser } from "@/app/types/AuthUser";
import type { UserContextType } from "@/app/types/UserContextType";
import { Theme, type ThemeProps } from "@radix-ui/themes";

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const setThemeColor = (themeColor: string) => {
    setUser((current) => current?.userType === "Athlete" ? { ...current, themeColor } : current);
  };

  const refreshUser = async () => {
    try {
      setIsLoading(true);
      const userData = await getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error("Failed to refresh user:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const clearUser = () => {
    setUser(null);
  };

  const logout = async () => {
    try {
      await logoutApi();
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
      void refreshUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, isLoading, refreshUser, clearUser, logout, setThemeColor }}>
      <Theme appearance="dark" accentColor={(user?.userType === "Athlete" ? user.themeColor ?? "grass" : "grass") as ThemeProps["accentColor"]} hasBackground={false}>
        {children}
      </Theme>
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
