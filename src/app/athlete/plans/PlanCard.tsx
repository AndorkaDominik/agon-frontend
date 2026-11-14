"use client";

import { useRouter } from "next/navigation";
import IconButton from "@/app/components/IconButton/IconButton";
import DefaultButton from "@/app/components/DefaultButton/DefaultButton";
import { Badge, Box, Flex, Heading, Text } from "@radix-ui/themes";
import { Play, Trash2, Plus } from "lucide-react";

type PlanCardProps = {
  planId?: number | null;
  isAssigned?: boolean;
  name: string | null;
  focusArea?: string | null;
  description?: string | null;
  onDelete?: () => void;
  isDeleting?: boolean;
  showDeleteButton?: boolean;
  primaryLabel?: string;
  onPrimaryClick?: () => void;
};

export function PlanCard({
  planId = null,
  isAssigned = false,
  name,
  focusArea,
  description,
  onDelete,
  isDeleting = false,
  showDeleteButton = true,
  primaryLabel,
  onPrimaryClick,
}: PlanCardProps) {
  const router = useRouter();

  const handleStart = () => {
    const base = "/athlete/new-workout";

    if (typeof planId === "number") {
      const assigned = isAssigned ? "true" : "false";
      router.push(`${base}?planId=${planId}&assigned=${assigned}`);
      return;
    }

    router.push(base);
  };
  return (
    <article
      className="card"
      style={{
        display: "grid",
        gap: "0.85rem",
        minHeight: "210px",
      }}
    >
      <Badge variant="soft" style={{ width: "fit-content" }}>
        {focusArea ?? "General"}
      </Badge>

      <Heading size="6" style={{ lineHeight: 1.1 }}>
        {name ?? "Unnamed plan"}
      </Heading>

      <Text
        as="p"
        size="4"
        style={{
          color: "var(--text-soft)",
          maxWidth: "60ch",
          lineHeight: 1.45,
        }}
      >
        {description ?? "No description available."}
      </Text>

      <Flex align="center" gap="3" style={{ marginTop: "0.25rem" }}>
        <Box style={{ flex: 1 }}>
          <DefaultButton
            variant="soft"
            icon={
              (primaryLabel && primaryLabel.toLowerCase().includes("assign")) ? (
                <Plus size={18} />
              ) : (
                <Play size={18} />
              )
            }
            onClick={onPrimaryClick ?? handleStart}
          >
            {primaryLabel ?? "Start"}
          </DefaultButton>
        </Box>

        {showDeleteButton && (
          <IconButton
            icon={<Trash2 size={17} />}
            ariaLabel="Delete plan"
            side="40px"
            color="red"
            onClick={onDelete}
            isLoading={isDeleting}
          />
        )}
      </Flex>
    </article>
  );
}
