import { Box, Heading } from "@radix-ui/themes";
import { Inbox } from "lucide-react";

type NoPlansProps = {
  description: string;
};

export default function NoPlans({ description }: NoPlansProps) {
  return (
    <Box
      style={{
        padding: "3rem 1rem",
        textAlign: "center",
        borderRadius: "8px",
        border: "1px dashed var(--border)",
      }}
    >
      <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>
        <Inbox size={48} />
      </div>
      <Heading size="8" style={{ marginBottom: "0.5rem", lineHeight: 1.05 }}>
        No workout plans
      </Heading>
      <p style={{ margin: "0 auto 1rem", maxWidth: "48ch", color: "var(--gray-11)" }}>
        {description}
      </p>
    </Box>
  );
}
