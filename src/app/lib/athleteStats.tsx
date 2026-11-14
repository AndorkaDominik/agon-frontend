import type { AthleteDto } from "@/api/models";

export function getAthleteWorkoutStats(athlete: AthleteDto, now = new Date()) {
  const currentTime = now.getTime();
  const weekStart = currentTime - 7 * 24 * 60 * 60 * 1000;
  let workoutsThisWeek = 0;
  let lastWorkoutTime = -Infinity;
  let lastWorkoutName = "No plan";

  for (const session of athlete.workoutSessions ?? []) {
    const workoutTime = session.date ? new Date(session.date).getTime() : NaN;
    if (Number.isNaN(workoutTime)) continue;

    if (session.workoutName != null && workoutTime >= weekStart && workoutTime <= currentTime) {
      workoutsThisWeek += 1;
    }

    if (workoutTime > lastWorkoutTime) {
      lastWorkoutTime = workoutTime;
      lastWorkoutName = session.workoutName ?? "No plan";
    }
  }

  return {
    assignedPlansCount: (athlete.assignedPlans?.length ?? 0) + (athlete.workoutPlans?.length ?? 0),
    workoutsThisWeek,
    lastWorkoutName,
  };
}
