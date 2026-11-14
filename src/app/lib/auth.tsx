import { getApiAuthMe, postApiAuthLogout } from "@/api/generated";
import type { AuthUser } from "@/app/types/AuthUser";
import type { AuthResponseDto } from "@/api/models/authResponseDto";
import type { UserType } from "@/app/types/UserType";

function toUserType(value: string | null | undefined): UserType | null {
  if (value === "Athlete" || value === "Trainer") {
    return value;
  }

  return null;
}

function mapAuthResponse(dto: AuthResponseDto): AuthUser | null {
  const userType = toUserType(dto.userType);

  if (!dto.userId || !dto.userName || !dto.email || !userType) {
    return null;
  }

  return {
    userId: dto.userId,
    userName: dto.userName,
    email: dto.email,
    userType,
    themeColor: userType === "Athlete" ? dto.themeColor ?? "grass" : undefined,
  };
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const response = await getApiAuthMe();

    if (response.status === 401) {
      console.log("Not authenticated");
      return null;
    }

    if (response.status !== 200) {
      console.error("Error fetching user:", response.status);
      return null;
    }

    const mapped = mapAuthResponse(response.data);
    //console.log("Current user:", mapped);
    if (!mapped) {
      console.error("Invalid auth payload received:", response.data);
      return null;
    }

    return mapped;
  } catch (error) {
    console.error("Failed to fetch current user:", error);
    return null;
  }
}

export async function logout(): Promise<void> {
  try {
    const response = await postApiAuthLogout();

    if (response.status !== 200) {
      console.error(
        "Logout failed with status:",
        response.status,
        response.data,
      );
    }
  } catch (error) {
    console.error("Logout failed:", error);
  }
}
