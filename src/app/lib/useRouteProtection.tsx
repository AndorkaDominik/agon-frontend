import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "@/app/context/UserContext";
import type { UserType } from "@/app/types/UserType";

export function useRouteProtection(allowedUserTypes?: readonly UserType[]) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const publicRoutes = ["/login", "/register", "/"];
    const isPublicRoute = publicRoutes.includes(pathname);

    if (!user && !isPublicRoute) {
      router.replace("/login");
      return;
    }

    if (user && isPublicRoute) {
      const dashboardHref =
        user.userType === "Trainer" ? "/trainer/dashboard" : "/athlete/dashboard";
      router.replace(dashboardHref);
      return;
    }

    if (user && allowedUserTypes && !allowedUserTypes.includes(user.userType)) {
      const dashboardHref =
        user.userType === "Trainer" ? "/trainer/dashboard" : "/athlete/dashboard";
      router.replace(dashboardHref);
    }
  }, [user, isLoading, router, pathname, allowedUserTypes]);
}
