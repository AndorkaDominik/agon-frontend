"use client";

import { Avatar, Flex, Heading, Text, Separator } from "@radix-ui/themes";
import { X, ChevronRight } from "lucide-react";
import DefaultButton from "@/app/components/DefaultButton/DefaultButton";
import StatTiles from "@/app/components/StatTiles/StatTiles";
import { getAthleteWorkoutStats } from "@/app/lib/athleteStats";
import type { AthleteDto } from "@/api/models";

type TrainerAthleteCardProps = {
  athlete: AthleteDto;
  onDisconnect?: (athleteId?: number) => void;
  onManage?: (athleteId?: number) => void;
};

export default function TrainerAthleteCard({ athlete, onDisconnect, onManage }: TrainerAthleteCardProps) {
  const name = athlete.name ?? "Unknown";
  const email = athlete.email ?? "";
  const initial = name.charAt(0).toUpperCase() || "A";
  const { assignedPlansCount, workoutsThisWeek, lastWorkoutName } = getAthleteWorkoutStats(athlete);

  return (
    <article
      className="card"
      style={{
        padding: "1rem",
        background: "var(--surface)",
      }}
    >
      <Flex align="center" gap="3" style={{ marginBottom: 12 }}>
        <Avatar fallback={initial} radius="full" style={{ width: 56, height: 56 }} />
        <div>
          <Heading size="4" style={{ marginBottom: 6 }}>{name.toUpperCase()}</Heading>
          <Text size="2" style={{ color: "var(--text-soft)" }}>{email}</Text> <br />
          <Text size="2" style={{ marginTop: 6 }}>Last: {lastWorkoutName}</Text>
        </div>
      </Flex>

      <div style={{ marginTop: 6 }}>
        <StatTiles
          items={[
            { label: "ASSIGNED PLANS", value: assignedPlansCount },
            { label: "WORKOUTS THIS WEEK", value: workoutsThisWeek },
          ]}
          wrap={false}
          gap="1rem"
          style={{ width: "100%" }}
          itemStyle={{ flex: 1, minWidth: 0, padding: "0.9rem", background: "rgba(0,0,0,0.06)", textAlign: "center" }}
        />
      </div>

      <Separator size="4" style={{ height: "2px", marginTop: 14, marginBottom: 12 }} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <DefaultButton
          variant="outline"
          color="red"
          fullWidth
          onClick={() => onDisconnect?.(athlete.id)}
          icon={<X size={16} />}
          iconPosition="left"
          aria-label="Disconnect athlete"
        >
          Disconnect
        </DefaultButton>
        <DefaultButton
          variant="solid"
          fullWidth
          onClick={() => onManage?.(athlete.id)}
          icon={<ChevronRight size={16} />}
          iconPosition="right"
          aria-label="Manage athlete"
        >
          Manage
        </DefaultButton>
      </div>
    </article>
  );
}
