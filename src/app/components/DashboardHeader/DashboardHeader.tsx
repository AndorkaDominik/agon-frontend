import { useUser } from "@/app/context/UserContext";
import { Flex, Heading } from "@radix-ui/themes";
import DefaultHeading from "@/app/components/DefaultHeading/DefaultHeading";
import DefaultButton from "@/app/components/DefaultButton/DefaultButton";
import StatTiles from "@/app/components/StatTiles/StatTiles";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardHeader({
  preTitle,
  stats,
}: {
  preTitle: string;
  stats?: {
    athletesCount?: number;
    pending?: number;
  };
}) {
  const { user } = useUser();
  const router = useRouter();

  return (
    <Flex
      direction="row"
      align="end"
      justify="between"
      style={{ width: "100%" }}
    >
      <div>
        <Heading
          size="5"
          style={{
            color: "var(--text-soft)",
          }}
        >
          {preTitle}
        </Heading>
        <DefaultHeading>{user?.userName || "Guest"}</DefaultHeading>
      </div>

      {user?.userType === "Athlete" && (
        <Flex align="end" gap="2">
          <DefaultButton
            icon={<Plus />}
            fullWidth={false}
            onClick={() => router.push("/athlete/new-workout/")}
          >
            New Workout
          </DefaultButton>
        </Flex>
      )}

      {user?.userType === "Trainer" && (
        <StatTiles
          items={[
            { label: "ATHLETES", value: stats?.athletesCount ?? 0 },
            { label: "PENDING", value: stats?.pending ?? 0 },
          ]}
          gap="0.7rem"
          itemStyle={{ padding: "0.6rem 0.85rem" }}
        />
      )}
    </Flex>
  );
}
