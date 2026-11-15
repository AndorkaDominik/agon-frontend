import { Box, Flex, Heading, Text } from "@radix-ui/themes";
import Image from "next/image";
import DefaultHeading from "../DefaultHeading/DefaultHeading";

type AuthHeaderProps = {
  prefix?: string;
  subtitle?: string;
};

export default function AuthHeader({
  prefix = "JOIN",
  subtitle = "Start tracking your fitness journey today",
}: AuthHeaderProps) {
  return (
    <Flex direction="column" align="center" gap="2" mb="5">
      <Flex align="center" gap="2">
        <Heading
          size="9"
          weight="bold"
          style={{ color: "var(--text)", lineHeight: 1 }}
        >
          {prefix}
        </Heading>
        <Box
          style={{
            backgroundColor: "var(--accent-9)",
            padding: "0.5rem",
            display: "flex",
            alignItems: "center",
          }}
        >
          <DefaultHeading size="9" style={{ letterSpacing: "0.1em" }}>Agon</DefaultHeading>
        </Box>
      </Flex>
      <Text size="3" style={{ color: "var(--text-soft)" }}>
        {subtitle}
      </Text>
    </Flex>
  );
}
