"use client";

import { Flex, Avatar, Heading, Text, Box } from "@radix-ui/themes";
import DefaultButton from "@/app/components/DefaultButton/DefaultButton";
import type { CoachingRequestDto, AthleteDto } from "@/api/models";
import { formatHungarianDate } from "@/app/lib/dateUtils";

type TrainerRequestCardProps = {
  request: CoachingRequestDto;
  athlete?: AthleteDto;
  onRespond: (requestId: number | undefined, accept: boolean) => void;
};

export default function TrainerRequestCard({
  request,
  athlete,
  onRespond,
}: TrainerRequestCardProps) {
  const name =
    (request.athleteName ??
      athlete?.name ??
      `Athlete #${request.athleteId ?? ""}`) ||
    "Unknown";
  const displayName = name.toUpperCase();
  const initial = name && name.length > 0 ? name.charAt(0).toUpperCase() : "A";

  return (
    <article
      className="card"
      style={{ display: "grid", gap: "0.85rem", minHeight: 120 }}
    >
      <Flex align="start" justify="between" style={{ gap: "1rem" }}>
        <Flex align="center" gap="3">
          <Avatar size="7" fallback={initial} radius="full" />

          <div>
            <Heading size="6" style={{ lineHeight: 1.1, marginBottom: 6 }}>
              {displayName}
            </Heading>
            <Text size="2" style={{ color: "var(--text-soft)", marginTop: -2 }}>
              {formatHungarianDate(request.createdAt ?? "")}
            </Text>
            <Box style={{ marginTop: 8 }}>
              <Text
                as="p"
                size="4"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  padding: "0.6rem 0.8rem",
                  borderRadius: 4,
                  color: "var(--text)",
                }}
              >
                {request.message ?? ""}
              </Text>
            </Box>
          </div>
        </Flex>

        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            alignItems: "flex-start",
            marginLeft: "auto",
          }}
        >
          <DefaultButton
            variant="outline"
            fullWidth={false}
            onClick={() => onRespond(request.id, false)}
          >
            Decline
          </DefaultButton>
          <DefaultButton
            fullWidth={false}
            onClick={() => onRespond(request.id, true)}
          >
            Accept
          </DefaultButton>
        </div>
      </Flex>
    </article>
  );
}
