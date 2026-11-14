"use client";

import { Button, Flex, Spinner, type ButtonProps } from "@radix-ui/themes";
import { BookmarkIcon } from "lucide-react";
import type { ReactNode } from "react";

type DefaultButtonProps = Omit<ButtonProps, "children"> & {
  children: ReactNode;
  isLoading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
};

export default function DefaultButton({
  children,
  icon = null,
  iconPosition = "left",
  isLoading = false,
  loadingText = "Loading...",
  fullWidth = true,
  size = "3",
  variant = "solid",
  color,
  disabled,
  style,
  ...rest
}: DefaultButtonProps) {
  const isHardDisabled = Boolean(disabled);
  const isBlocked = isHardDisabled || isLoading;

  return (
    <Button
      size={size}
      variant={isBlocked ? "outline" : variant}
      color={color}
      disabled={isHardDisabled}
      aria-disabled={isBlocked}
      style={{
        width: fullWidth ? "100%" : undefined,
        borderRadius: "0",
        cursor: isBlocked ? "not-allowed" : "pointer",
        pointerEvents: isBlocked ? "none" : undefined,
        opacity: isHardDisabled ? undefined : 1,
        textDecoration: "none",
        ...style,
      }}
      {...rest}
    >
      {isLoading ? (
        <Flex align="center" gap="2" justify="center">
          <Spinner loading>
            <BookmarkIcon />
          </Spinner>
          Loading...
        </Flex>
      ) : (
        <Flex align="center" gap="2">
          {icon && iconPosition === "left" && (
            <span style={{ marginRight: "8px", display: "inline-flex", alignItems: "center" }}>{icon}</span>
          )}
          {children}
          {icon && iconPosition === "right" && (
            <span style={{ marginLeft: "8px", display: "inline-flex", alignItems: "center" }}>{icon}</span>
          )}
        </Flex>
      )}
    </Button>
  );
}
