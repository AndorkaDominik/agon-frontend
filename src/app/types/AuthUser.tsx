import type { UserType } from "@/app/types/UserType";

export type AuthUser = {
  userId: string;
  userName: string;
  email: string;
  userType: UserType;
  themeColor?: string;
};
