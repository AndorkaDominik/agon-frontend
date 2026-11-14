"use client";

import { Button, Spinner, type ButtonProps } from "@radix-ui/themes";
import { BookmarkIcon } from "lucide-react";
import type { ReactNode } from "react";

type IconButtonProps = Omit<ButtonProps, "children"> & {
  icon: ReactNode;
  ariaLabel: string;
  isLoading?: boolean;
  side?: string;
};

export default function IconButton({
  icon,
  ariaLabel,
  isLoading = false,
  side = "48px",
  size = "3",
  variant = "outline",
  color,
  disabled,
  style,
  ...rest
}: IconButtonProps) {
  const isHardDisabled = Boolean(disabled);
  const isBlocked = isHardDisabled || isLoading;

  return (
    <Button
      size={size}
      variant={isBlocked ? "outline" : variant}
      color={color}
      disabled={isHardDisabled}
      aria-disabled={isBlocked}
      aria-label={ariaLabel}
      style={{
        width: side,
        height: side,
        minWidth: side,
        borderRadius: "0",
        padding: "0",
        cursor: isBlocked ? "not-allowed" : "pointer",
        pointerEvents: isBlocked ? "none" : undefined,
        textDecoration: "none",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
      {...rest}
    >
      {isLoading ? (
        <Spinner loading>
          <BookmarkIcon />
        </Spinner>
      ) : (
        <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
          {icon}
        </span>
      )}
    </Button>
  );
}
