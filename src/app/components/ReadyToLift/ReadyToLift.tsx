"use client";

import { Box, Text, Flex } from "@radix-ui/themes";
import DefaultHeading from "@/app/components/DefaultHeading/DefaultHeading";
import DefaultButton from "@/app/components/DefaultButton/DefaultButton";
import styles from "./ReadyToLift.module.css";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ReadyToLift() {
  const router = useRouter();
  return (
    <Box className={styles.readyToLiftRoot}>
      <DefaultHeading size="9" align="center" style={{ marginBottom: "1rem" }}>
        READY TO LIFT?
      </DefaultHeading>
      <Text
        size="5"
        align="center"
        style={{ marginBottom: "2.5rem", display: "block" }}
      >
        Join the pack. Track your progress. Become the beast you're meant to be.
      </Text>
      <Flex justify="center">
        <DefaultButton
          size="4"
          variant="solid"
          radius="none"
          fullWidth={false}
          icon={<ChevronRight />}
          iconPosition="right"
          onClick={() => router.push("/register")}
        >
          CREATE ACCOUNT
        </DefaultButton>
      </Flex>
    </Box>
  );
}
