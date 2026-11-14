import type { AuthUser } from "@/app/types/AuthUser";

export type UserContextType = {
  user: AuthUser | null;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
  clearUser: () => void;
  logout: () => Promise<void>;
  setThemeColor: (themeColor: string) => void;
};
