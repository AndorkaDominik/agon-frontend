"use client";

import { Dialog, Flex, Text } from "@radix-ui/themes";
import type { ReactNode } from "react";
import DefaultButton from "@/app/components/DefaultButton/DefaultButton";

type ConfirmationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  isConfirmLoading?: boolean;
  disableClose?: boolean;
  variant?: "default" | "danger";
};

export default function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  isConfirmLoading = false,
  disableClose = false,
  variant = "default",
}: ConfirmationDialogProps) {
  const canClose = !disableClose && !isConfirmLoading;

  return (
    <Dialog.Root open={open} onOpenChange={(nextOpen) => canClose && onOpenChange(nextOpen)}>
      <Dialog.Content style={{ width: "min(92vw, 520px)", maxWidth: "520px", padding: "1.15rem" }}>
        <Dialog.Title>
          <Text size="6" weight="bold" style={{ textTransform: "uppercase" }}>
            {title}
          </Text>
        </Dialog.Title>

        {description && (
          <Dialog.Description style={{ marginTop: "0.55rem", color: "var(--text-soft)" }}>
            {description}
          </Dialog.Description>
        )}

        <Flex justify="end" gap="3" style={{ marginTop: "1.25rem" }}>
          <DefaultButton
            type="button"
            variant="soft"
            color="gray"
            fullWidth={false}
            disabled={!canClose}
            onClick={() => onOpenChange(false)}
          >
            {cancelLabel}
          </DefaultButton>

          <DefaultButton
            type="button"
            variant="solid"
            color={variant === "danger" ? "red" : undefined}
            fullWidth={false}
            isLoading={isConfirmLoading}
            disabled={isConfirmLoading}
            onClick={onConfirm}
          >
            {confirmLabel}
          </DefaultButton>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
