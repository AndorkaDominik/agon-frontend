"use client";

import { Avatar, Flex, Text } from "@radix-ui/themes";
import DefaultHeading from "@/app/components/DefaultHeading/DefaultHeading";
import type { AthleteDto } from "@/api/models";
import DefaultButton from "@/app/components/DefaultButton/DefaultButton";
import { useRouter } from "next/navigation";

export default function TrainerManageHeader({
  athlete,
  loading,
}: {
  athlete?: AthleteDto | null;
  loading?: boolean;
}) {
  const name = athlete?.name ?? (loading ? "Loading..." : "Unknown Athlete");
  const email = athlete?.email ?? "";

  const initial = name && name.length > 0 ? name.charAt(0).toUpperCase() : "A";
  const router = useRouter();

  return (
    <div
      className="card"
      style={{ padding: "1rem", marginTop: "1rem", minHeight: 120 }}
    >
      <Flex align="stretch" justify="between" style={{ height: "100%" }}>
        <div>
          <DefaultHeading mb="3" size="5">
            Manage Athlete
          </DefaultHeading>
          <Flex align="center" gap="4">
            <Avatar
              fallback={initial}
              radius="full"
              style={{ width: 80, height: 80 }}
            />
            <div style={{ minWidth: 0 }}>
              <DefaultHeading size="8" style={{ marginBottom: 6 }}>
                {name.toUpperCase()}
              </DefaultHeading>
              <Text size="3" style={{ color: "var(--text-soft)" }}>
                {email}
              </Text>
            </div>
          </Flex>
        </div>
        <Flex
          direction="column"
          justify="between"
          align="end"
          style={{ textAlign: "right", height: "100%" }}
        >
          <div style={{ alignSelf: "flex-end" }}>
            <DefaultButton
              variant="outline"
              fullWidth={false}
              onClick={() => router.push("/trainer/dashboard")}
            >
              Back
            </DefaultButton>
          </div>
        </Flex>
      </Flex>
    </div>
  );
}
