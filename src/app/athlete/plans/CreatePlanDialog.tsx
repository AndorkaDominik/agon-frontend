"use client";

import * as Form from "@radix-ui/react-form";
import { useState, type FormEvent } from "react";
import { Dialog, Flex, IconButton, Box, Text } from "@radix-ui/themes";
import { Plus, X, Dumbbell } from "lucide-react";
import DefaultButton from "@/app/components/DefaultButton/DefaultButton";
import FormInput from "@/app/components/FormInput/FormInput";
import FormTextarea from "@/app/components/FormTextarea/FormTextarea";
import ExercisesFieldset from "@/app/components/ExercisesFieldset/ExercisesFieldset";
import { useExerciseRows } from "@/app/lib/useExerciseRows";
import { postApiWorkoutPlanNewPlan } from "@/api/generated";
import type { WorkoutPlanDto } from "@/api/models";
import { ExerciseType } from "@/api/models/exerciseType";

type CreatePlanDialogProps = {
  triggerFullWidth?: boolean;
  onPlanCreated?: (plan: WorkoutPlanDto) => void;
};

export default function CreatePlanDialog({
  triggerFullWidth = false,
  onPlanCreated,
}: CreatePlanDialogProps) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [planName, setPlanName] = useState("");
  const [focusArea, setFocusArea] = useState("");
  const [description, setDescription] = useState("");
  const {
    rows: exercises,
    setRows: setExercises,
    createRow,
    handleChange: handleExerciseChange,
    handleRemove: handleExerciseRemove,
    handleAdd: handleExerciseAdd,
  } = useExerciseRows({ initialCount: 1 });

  const resetForm = () => {
    setPlanName("");
    setFocusArea("");
    setDescription("");
    setExercises([createRow(1)]);
    setSaving(false);
    setError("");
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (saving) return;
    setOpen(nextOpen);
    if (!nextOpen) {
      resetForm();
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setError("");

    const payload: WorkoutPlanDto = {
      name: planName,
      focusArea,
      description,
      creatorId: "",
      isTemplate: false,
      exercises: exercises.map((row, index) => ({
        exerciseName: row.exercise,
        exerciseType:
          row.type === "cardio"
            ? ExerciseType.NUMBER_1
            : row.type === "bodyweight"
              ? ExerciseType.NUMBER_2
              : ExerciseType.NUMBER_0,
        targetWeight: row.type === "cardio" ? null : Number(row.weight) || 0,
        targetReps: row.type === "cardio" ? null : Number(row.reps) || 0,
        targetDuration: row.type === "cardio" ? Number(row.duration) || 0 : null,
        targetDistance: row.type === "cardio" ? Number(row.distance) || 0 : null,
        orderIndex: index + 1,
      })),
    };

    try {
      const response = await postApiWorkoutPlanNewPlan(payload);

      if (response.status === 201) {
        onPlanCreated?.(response.data);
        setOpen(false);
        resetForm();
        return;
      }

      throw new Error(response.data.detail ?? response.data.title ?? "Failed to create plan.");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to create plan.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger>
        <DefaultButton
          type="button"
          size="3"
          icon={<Plus size={16} />}
          fullWidth={triggerFullWidth}
        >
          Create Plan
        </DefaultButton>
      </Dialog.Trigger>

      <Dialog.Content
        style={{
          width: "min(94vw, 760px)",
          maxWidth: "760px",
          padding: "1.25rem",
          maxHeight: "88vh",
          display: "grid",
          gridTemplateRows: "auto 1fr",
          gap: "1rem",
        }}
      >
        <Flex align="center" justify="between" gap="3">
          <Box>
            <Dialog.Title style={{ marginBottom: 0 }}>
              <Text
                size="6"
                weight="bold"
                style={{ textTransform: "uppercase" }}
              >
                Create Training Plan
              </Text>
            </Dialog.Title>
            <Dialog.Description style={{ marginTop: "0.35rem" }}>
              Add the plan details and exercises, then save the plan.
            </Dialog.Description>
          </Box>

          <Dialog.Close>
            <IconButton
              variant="ghost"
              color="gray"
              aria-label="Close create plan dialog"
              disabled={saving}
            >
              <X size={20} />
            </IconButton>
          </Dialog.Close>
        </Flex>

        <Box
          style={{ overflowY: "auto", minHeight: 0, paddingRight: "0.2rem" }}
        >
          <Form.Root className="form-grid" onSubmit={handleSubmit}>
            <FormInput
              name="planName"
              label="PLAN NAME"
              placeholder="eg. Push day A"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
            />

            <FormInput
              name="focusArea"
              label="Focus Area"
              placeholder="e.g.: Leg Power, Explosive Strength"
              value={focusArea}
              onChange={(e) => setFocusArea(e.target.value)}
            />

            <FormTextarea
              name="description"
              label="DESCRIPTION"
              required={false}
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <ExercisesFieldset
              rows={exercises}
              onChange={handleExerciseChange}
              onRemove={handleExerciseRemove}
              onAdd={handleExerciseAdd}
            />

            {error && (
              <Text as="p" size="2" role="alert" style={{ color: "var(--danger)" }}>
                {error}
              </Text>
            )}

            <DefaultButton
              type="submit"
              variant="solid"
              size="3"
              icon={<Dumbbell size={18} />}
              isLoading={saving}
              disabled={saving}
              fullWidth
            >
              Save Plan
            </DefaultButton>
          </Form.Root>
        </Box>
      </Dialog.Content>
    </Dialog.Root>
  );
}
