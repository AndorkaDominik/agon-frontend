import { Box, Flex, Heading, Text } from "@radix-ui/themes";
import Image from "next/image";

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
            padding: "0 0.5rem",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Image src="/logo.png" alt="Agon Logo" width={210} height={48} />
        </Box>
      </Flex>
      <Text size="3" style={{ color: "var(--text-soft)" }}>
        {subtitle}
      </Text>
    </Flex>
  );
}
