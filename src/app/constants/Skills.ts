import type { AthleteDashboardProgressDto, WorkoutXpRewardDto } from "@/api/models";
import { Dumbbell, HeartPulse, PersonStanding, type LucideIcon } from "lucide-react";

export const SKILLS = [
  {
    key: "strength",
    rewardKey: "strengthXp",
    label: "Strength",
    Icon: Dumbbell,
    xpSource: "Strength exercises → Strength XP",
  },
  {
    key: "endurance",
    rewardKey: "enduranceXp",
    label: "Endurance",
    Icon: HeartPulse,
    xpSource: "Cardio exercises → Endurance XP",
  },
  {
    key: "bodyControl",
    rewardKey: "bodyControlXp",
    label: "Body control",
    Icon: PersonStanding,
    xpSource: "Bodyweight exercises → Body control XP",
  },
] as const satisfies {
  key: keyof AthleteDashboardProgressDto;
  rewardKey: keyof WorkoutXpRewardDto;
  label: string;
  Icon: LucideIcon;
  xpSource: string;
}[];
