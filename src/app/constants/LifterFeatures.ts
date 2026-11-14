import { ClipboardList, Dumbbell, MessageCircle, Trophy } from "lucide-react";

export const LIFTER_FEATURES = [
  {
    title: "Workout Logging",
    description: "Track exercises, sets, reps, and weight with precision.",
    icon: Dumbbell,
  },
  {
    title: "Direct Coaching",
    description: "Stay connected with a built-in discussion board to receive feedback from your coach.",
    icon: MessageCircle,
  },
  {
    title: "Training Plans",
    description: "Save and reuse your favorite workout templates.",
    icon: ClipboardList,
  },
  {
    title: "Gamified Progress",
    description: "Track your streaks and unlock fun milestones.",
    icon: Trophy,
  },
] as const;
