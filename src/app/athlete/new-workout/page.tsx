"use client";

import * as Form from "@radix-ui/react-form";
import { type FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Dumbbell } from "lucide-react";
import { Box, Button, Flex, Spinner, Text } from "@radix-ui/themes";
import Navbar from "@/app/components/Navbar/Navbar";
import DefaultButton from "@/app/components/DefaultButton/DefaultButton";
import DefaultHeading from "@/app/components/DefaultHeading/DefaultHeading";
import FormInput from "@/app/components/FormInput/FormInput";
import FormSelect from "@/app/components/FormSelect/FormSelect";
import FormTextarea from "@/app/components/FormTextarea/FormTextarea";
import ExercisesFieldset from "@/app/components/ExercisesFieldset/ExercisesFieldset";
import SkillProgressCards from "@/app/components/SkillProgressCards/SkillProgressCards";
import WorkoutXpReward from "@/app/components/WorkoutXpReward/WorkoutXpReward";
import { useExerciseRows } from "@/app/lib/useExerciseRows";
import { createExerciseRowsFromPlan } from "@/app/lib/exerciseRows";
import { useRouteProtection } from "@/app/lib/useRouteProtection";
import { SKILLS } from "@/app/constants/Skills";
import {
  getApiWorkoutPlanAssignedPlans,
  getApiWorkoutPlanPlans,
  getApiWorkoutSessionDashboardProgress,
  postApiWorkoutSessionNewWorkout,
} from "@/api/generated";
import type { WorkoutPlanDto } from "@/api/models/workoutPlanDto";
import type { WorkoutSessionDto } from "@/api/models/workoutSessionDto";
import type { SessionExerciseDto } from "@/api/models/sessionExerciseDto";
import { ExerciseType } from "@/api/models/exerciseType";
import { useUser } from "@/app/context/UserContext";
import type { AthleteDashboardProgressDto } from "@/api/models";

const NO_PLAN_VALUE = "no-plan";
const DEFAULT_PLAN_OPTION = {
  label: "No plan selected - fresh start",
  value: NO_PLAN_VALUE,
};

export default function NewWorkout() {
  useRouteProtection(["Athlete"]);
  const { user } = useUser();
  const [progress, setProgress] = useState<AthleteDashboardProgressDto | null>(null);
  const [progressLoading, setProgressLoading] = useState(true);
  const [progressReload, setProgressReload] = useState(0);
  const [workoutPlansByKey, setWorkoutPlansByKey] = useState<
    Record<string, WorkoutPlanDto>
  >({});
  const [plans, setPlans] = useState<{ label: string; value: string }[]>([
    DEFAULT_PLAN_OPTION,
  ]);
  const [plan, setPlan] = useState<string>(NO_PLAN_VALUE);
  const [workoutName, setWorkoutName] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [plansError, setPlansError] = useState("");
  const [selectedPlanError, setSelectedPlanError] = useState("");
  const [submitError, setSubmitError] = useState("");

  const {
    rows: exercises,
    setRows: setExercises,
    createRow,
    handleChange: handleExerciseChange,
    handleRemove: handleExerciseRemove,
    handleAdd: handleExerciseAdd,
  } = useExerciseRows({ initialCount: 3 });
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await getApiWorkoutSessionDashboardProgress();
        setProgress(response.status === 200 ? response.data : null);
      } catch {
        setProgress(null);
      } finally {
        setProgressLoading(false);
      }
    };

    void fetchProgress();
  }, [progressReload]);

  useEffect(() => {
    const fetchPlans = async () => {
      setPlansError("");
      try {
        const [myPlansResponse, assignedPlansResponse] = await Promise.all([
          getApiWorkoutPlanPlans(),
          getApiWorkoutPlanAssignedPlans(),
        ]);

        const myPlans = myPlansResponse.status === 200 ? myPlansResponse.data : [];
        const assignedPlans =
          assignedPlansResponse.status === 200 ? assignedPlansResponse.data : [];

        if (myPlansResponse.status !== 200) {
          setPlansError(myPlansResponse.data.detail ?? myPlansResponse.data.title ?? "Failed to load your plans.");
        } else if (assignedPlansResponse.status !== 200) {
          setPlansError(assignedPlansResponse.data.detail ?? assignedPlansResponse.data.title ?? "Failed to load assigned plans.");
        }

        const workoutPlansMap: Record<string, WorkoutPlanDto> = {};
        const myPlanOptions = myPlans.map((item, index) => {
          const key = `my-${item.id ?? "unknown"}-${index}`;
          workoutPlansMap[key] = item;
          return {
            label: item.name ?? "Unnamed plan",
            value: key,
          };
        });

        const assignedPlanOptions = assignedPlans.map((item, index) => {
          const key = `assigned-${item.id ?? "unknown"}-${index}`;
          workoutPlansMap[key] = item;
          return {
            label: `${item.name ?? "Unnamed plan"} (Assigned)`,
            value: key,
          };
        });

        setWorkoutPlansByKey(workoutPlansMap);
        setPlans([
          DEFAULT_PLAN_OPTION,
          ...myPlanOptions,
          ...assignedPlanOptions,
        ]);
      } catch (error) {
        setPlansError(error instanceof Error ? error.message : "Failed to load workout plans.");
        setWorkoutPlansByKey({});
        setPlans([DEFAULT_PLAN_OPTION]);
      }
    };

    void fetchPlans();
  }, []);

  useEffect(() => {
    const planIdParam = searchParams?.get("planId");
    if (!planIdParam) return;

    const planIdNum = Number(planIdParam);
    if (Number.isNaN(planIdNum)) return;

    const assignedParam = searchParams?.get("assigned");
    const assignedBool = assignedParam === "true";

    const matchingKey = Object.keys(workoutPlansByKey).find((k) => {
      const p = workoutPlansByKey[k];
      if (!p) return false;
      if (p.id !== planIdNum) return false;
      if (assignedParam == null) return true;
      return assignedBool ? k.startsWith("assigned") : k.startsWith("my");
    });

    if (matchingKey) {
      setPlan(matchingKey);
    }
  }, [workoutPlansByKey, searchParams]);

  

  const handlePlanChange = (selectedPlanId: string) => {
    setPlan(selectedPlanId);
  };

  useEffect(() => {
    setSelectedPlanError("");
    if (plan === NO_PLAN_VALUE) {
      setWorkoutName("");
      setNotes("");
      setExercises([createRow(1), createRow(2), createRow(3)]);
      return;
    }

    const selectedPlan = workoutPlansByKey[plan];

    if (!selectedPlan) {
      return;
    }

    try {
      setWorkoutName(selectedPlan.name ?? "");
      setNotes(selectedPlan.description ?? "");
      setExercises(createExerciseRowsFromPlan(selectedPlan, createRow));
    } catch (error) {
      setSelectedPlanError(error instanceof Error ? error.message : "Failed to load the selected plan.");
    }
  }, [plan, workoutPlansByKey, createRow, setExercises]);

  const payload: WorkoutSessionDto = {
    userId: user?.userId,
    workoutName,
    notes,
    totalWeight: exercises.reduce(
      (sum, row) => sum + (row.type === "cardio" ? 0 : Number(row.weight) * Number(row.reps)),
      0,
    ),
    totalDistance: exercises.reduce(
      (sum, row) => sum + (row.type === "cardio" ? Number(row.distance) : 0),
      0,
    ),
    totalReps: exercises.reduce(
      (sum, row) => sum + (row.type === "cardio" ? 0 : Number(row.reps)),
      0,
    ),
    exercises: exercises.map(
      (row, idx): SessionExerciseDto => ({
        exerciseName: row.exercise,
        exerciseType: row.type === "cardio"
          ? ExerciseType.NUMBER_1
          : row.type === "bodyweight"
            ? ExerciseType.NUMBER_2
            : ExerciseType.NUMBER_0,
        weight: row.type === "cardio" ? null : Number(row.weight) || 0,
        reps: row.type === "cardio" ? null : Number(row.reps) || 0,
        duration: row.type === "cardio" ? Number(row.duration) || 0 : null,
        distance: row.type === "cardio" ? Number(row.distance) || 0 : null,
        orderIndex: idx + 1,
      }),
    ),
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;
    setSubmitError("");
    setLoading(true);

    try {
      const response = await postApiWorkoutSessionNewWorkout(payload);

      if (response.status === 201) {
        const result = response.data;
        const rewards = new URLSearchParams();

        for (const { rewardKey } of SKILLS) {
          const xp = result.xpGained?.[rewardKey];
          if (xp !== undefined && Number.isFinite(xp) && xp >= 0) {
            rewards.set(rewardKey, String(xp));
          }
        }

        router.push(`/athlete/workout/congrats/${result.workout?.id ?? "completed"}?${rewards}`);
        return;
      }

      throw new Error(response.data.detail ?? response.data.title ?? "Failed to save workout.");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Failed to save workout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="layout-page">
      <Navbar />

      <main className="layout-content">
        <DefaultHeading style={{ marginBottom: "1.25rem" }}>
          New Workout
        </DefaultHeading>

        <Box mb="5">
          {progressLoading ? (
            <Flex className="card" align="center" gap="3" role="status">
              <Spinner />
              <Text>Loading your progress...</Text>
            </Flex>
          ) : progress ? (
            <SkillProgressCards progress={progress} />
          ) : (
            <Flex className="card" align="center" justify="between" gap="3" role="alert">
              <Text>Unable to load your progress.</Text>
              <Button type="button" variant="soft" onClick={() => {
                setProgressLoading(true);
                setProgressReload((current) => current + 1);
              }}>
                Try again
              </Button>
            </Flex>
          )}
        </Box>

        <section className="card">
          <Form.Root className="form-grid" onSubmit={handleSubmit}>
            <FormSelect
              name="workoutPlan"
              label="Load from plan"
              options={plans}
              value={plan}
              required={false}
              onChange={handlePlanChange}
            />

            {(plansError || selectedPlanError) && (
              <Text as="p" size="2" role="alert" style={{ color: "var(--danger)" }}>
                {plansError || selectedPlanError}
              </Text>
            )}

            <FormInput
              name="workoutName"
              label="Workout name"
              placeholder="e.g.: Chest day, Leg day"
              value={workoutName}
              onChange={(event) => setWorkoutName(event.target.value)}
            />

            <ExercisesFieldset
              rows={exercises}
              onChange={handleExerciseChange}
              onRemove={handleExerciseRemove}
              onAdd={handleExerciseAdd}
            />

            <WorkoutXpReward workout={payload} disabled={loading} />

            <FormTextarea
              name="workoutNotes"
              label="Notes (optional)"
              required={false}
              placeholder="Any notes about this workout..."
              rows={5}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />

            {submitError && (
              <Text as="p" size="2" role="alert" style={{ color: "var(--danger)" }}>
                {submitError}
              </Text>
            )}

            <DefaultButton
              type="submit"
              variant="solid"
              fullWidth
              icon={<Dumbbell size={18} />}
              isLoading={loading}
              disabled={loading}
            >
              Complete Workout
            </DefaultButton>
          </Form.Root>
        </section>
      </main>
    </div>
  );
}
