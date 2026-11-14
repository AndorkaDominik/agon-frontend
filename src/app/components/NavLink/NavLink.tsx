import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./NavLink.module.css";

type NavLinkProps = {
  href: string;
  children: ReactNode;
  icon?: ReactNode;
  isActive?: boolean;
  className?: string;
  activeClassName?: string;
  iconPosition?: "left" | "right";
};

export default function NavLink({
  href,
  children,
  icon,
  isActive = false,
  className,
  activeClassName,
  iconPosition = "left",
}: NavLinkProps) {
  const resolvedClassName = [
    styles.navLink,
    isActive ? styles.navLinkActive : "",
    className,
    isActive ? activeClassName : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Link href={href} className={resolvedClassName} aria-current={isActive ? "page" : undefined}>
      <span className={styles.content}>
        {iconPosition === "left" ? icon : null}
        {children}
        {iconPosition === "right" ? icon : null}
      </span>
    </Link>
  );
}
