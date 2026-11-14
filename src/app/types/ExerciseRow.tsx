export type ExerciseRow = {
  id: number;
  type: "strength" | "cardio" | "bodyweight";
  exercise: string;
  weight: string | number;
  reps: string | number;
  duration: string | number;
  distance: string | number;
};
