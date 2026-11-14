import type { WorkoutPlanDto } from "@/api/models";
import { ExerciseType } from "@/api/models/exerciseType";
import type { ExerciseRow } from "@/app/types/ExerciseRow";

export function createExerciseRowsFromPlan(
  plan: WorkoutPlanDto,
  createRow: (id: number) => ExerciseRow,
): ExerciseRow[] {
  const exercises = (plan.exercises ?? []).filter(
    (exercise): exercise is NonNullable<typeof exercise> =>
      exercise !== null && exercise !== undefined,
  );

  if (exercises.length === 0) {
    return [createRow(1)];
  }

  return [...exercises]
    .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
    .map((exercise, index) => ({
      id: index + 1,
      type: exercise.exerciseType === ExerciseType.NUMBER_1
        ? "cardio"
        : exercise.exerciseType === ExerciseType.NUMBER_2
          ? "bodyweight"
          : "strength",
      exercise: exercise.exerciseName ?? "",
      weight: exercise.targetWeight ?? 0,
      reps: exercise.targetReps ?? 0,
      duration: exercise.targetDuration ?? 0,
      distance: exercise.targetDistance ?? 0,
    }));
}
