"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Box, Flex, Text } from "@radix-ui/themes";
import DefaultButton from "@/app/components/DefaultButton/DefaultButton";
import { useUser } from "@/app/context/UserContext";
import styles from "./Navbar.module.css";
import Image from "next/image";
import { LayoutDashboard, Menu, Plus, NotebookPen } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import NavLink from "@/app/components/NavLink/NavLink";
import DefaultHeading from "../DefaultHeading/DefaultHeading";

type NavbarProps = {
  button1Text?: string;
  button1Link?: string;
  button2Text?: string;
  button2Link?: string;
};

export default function Navbar({
  button1Text = "Sign In",
  button1Link = "/login",
  button2Text = "Get Started",
  button2Link = "/register",
}: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout: logoutUser } = useUser();

  const isLoggedIn = Boolean(user);
  const userType = user?.userType;
  const name = user?.userName;

  const handleLogout = async () => {
    await logoutUser();
    router.push("/login");
  };

  const normalizePath = (path: string) =>
    path.length > 1 ? path.replace(/\/+$/, "") : path;

  const currentPath = normalizePath(pathname);

  const isActiveLink = (href: string) => currentPath === normalizePath(href);

  const dashboardHref =
    userType === "Trainer" ? "/trainer/dashboard" : "/athlete/dashboard";
  const authRoutes = ["/login", "/register"];

  return (
    <div className={styles.navWrapper}>
      <Flex asChild align="center" justify="between" className={styles.topBar}>
        <header>
          <Link
            href={isLoggedIn ? dashboardHref : "/"}
            className={styles.brandLink}
          >
            <DefaultHeading size="8" className={styles.brandHeading}>
              Agon
            </DefaultHeading>
          </Link>

          {isLoggedIn && userType === "Athlete" ? (
            <Flex asChild align="center" gap="2">
              <nav className={styles.actions} aria-label="Main navigation">
                {pathname === dashboardHref || !authRoutes.includes(pathname) ? (
                  <Flex gap="4">
                    <NavLink
                      href="/athlete/dashboard/"
                      isActive={isActiveLink("/athlete/dashboard")}
                      icon={<LayoutDashboard size={16} />}
                    >
                      Dashboard
                    </NavLink>
                    <NavLink
                      href="/athlete/new-workout/"
                      isActive={isActiveLink("/athlete/new-workout")}
                      icon={<Plus size={16} />}
                    >
                      New Workout
                    </NavLink>
                    <NavLink
                      href="/athlete/plans/"
                      isActive={isActiveLink("/athlete/plans")}
                      icon={<NotebookPen size={16} />}
                    >
                      Plans
                    </NavLink>
                  </Flex>
                ) : null}
              </nav>
            </Flex>
          ) : null}

          {isLoggedIn && userType === "Trainer" ? (
            <Flex asChild align="center" gap="2">
              <nav className={styles.actions} aria-label="Main navigation">
                {pathname === dashboardHref || !authRoutes.includes(pathname) ? (
                  <Flex gap="4">
                    <NavLink
                      href="/trainer/dashboard/"
                      isActive={isActiveLink("/trainer/dashboard")}
                      icon={<LayoutDashboard size={16} />}
                    >
                      Dashboard
                    </NavLink>
                    <NavLink
                      href="/trainer/plans/"
                      isActive={isActiveLink("/trainer/plans")}
                      icon={<NotebookPen size={16} />}
                    >
                      Plans
                    </NavLink>
                  </Flex>
                ) : null}
              </nav>
            </Flex>
          ) : null}

          <Flex asChild align="center" gap="2">
            <nav className={styles.actions} aria-label="Main navigation">
              {isLoggedIn ? (
                <>
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                      <Box
                        className={styles.dropdownTriggerBox}
                      >
                        <Flex align="center" gap="2">
                          {name && (
                            <Text size="3" style={{ color: "var(--text)" }}>
                              {name}
                            </Text>
                          )}
                          <Menu size={18} color="#fff" />
                        </Flex>
                      </Box>
                    </DropdownMenu.Trigger>

                    <DropdownMenu.Portal>
                      <DropdownMenu.Content
                        align="end"
                        sideOffset={5}
                        className={styles.dropdownmenuContent}
                      >
                        <DropdownMenu.Item
                          className={styles.dropdownItem}
                          onSelect={() => router.push("/profile")}
                        >
                          Profile
                        </DropdownMenu.Item>
                        <DropdownMenu.Separator style={{ height: "1px", backgroundColor: "var(--border)", margin: "0.25rem 0" }} />
                        <DropdownMenu.Item
                          className={styles.dropdownItemDanger}
                          onSelect={handleLogout}
                        >
                          Logout
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Root>
                </>
              ) : (
                <>
                  {pathname !== "/login" ? (
                    <DefaultButton
                      asChild
                      size="2"
                      variant="outline"
                      fullWidth={false}
                    >
                      <Link href={button1Link} style={{ textDecoration: "none" }}>{button1Text}</Link>
                    </DefaultButton>
                  ) : null}
                  {pathname !== "/register" ? (
                    <DefaultButton
                      asChild
                      size="2"
                      variant="solid"
                      fullWidth={false}
                    >
                      <Link href={button2Link} style={{ color: "#fff", textDecoration: "none" }}>{button2Text}</Link>
                    </DefaultButton>
                  ) : null}
                </>
              )}
            </nav>
          </Flex>
        </header>
      </Flex>
    </div>
  );
}
