"use client";

import { useEffect, useState, type FormEvent } from "react";
import * as Form from "@radix-ui/react-form";
import { Dialog, Box, Flex, Text, IconButton } from "@radix-ui/themes";
import { X } from "lucide-react";
import DefaultButton from "@/app/components/DefaultButton/DefaultButton";
import FormInput from "@/app/components/FormInput/FormInput";
import FormTextarea from "@/app/components/FormTextarea/FormTextarea";
import ExercisesFieldset from "@/app/components/ExercisesFieldset/ExercisesFieldset";
import { useExerciseRows } from "@/app/lib/useExerciseRows";
import { createExerciseRowsFromPlan } from "@/app/lib/exerciseRows";
import { getApiWorkoutPlanPlanId, putApiWorkoutPlanPlanId } from "@/api/generated";
import type { WorkoutPlanDto } from "@/api/models";
import { ExerciseType } from "@/api/models/exerciseType";

interface EditPlanDialogProps {
  planId?: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSaved?: () => void;
}

export default function EditPlanDialog({ planId, open = false, onOpenChange, onSaved }: EditPlanDialogProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
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

  useEffect(() => {
    if (!open) return;
    if (!planId) return;

    let cancelled = false;
    const fetchPlan = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await getApiWorkoutPlanPlanId(planId);

        if (response.status !== 200) {
          throw new Error(`Server error: ${response.status}`);
        }

        if (cancelled) return;

        const plan = response.data;
        setName(plan.name ?? "");
        setFocusArea(plan.focusArea ?? "");
        setDescription(plan.description ?? "");
        setExercises(createExerciseRowsFromPlan(plan, createRow));
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load plan.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void fetchPlan();

    return () => {
      cancelled = true;
    };
  }, [open, planId, createRow, setExercises]);

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!planId) return;
    setSaving(true);
    setError("");

    try {
      const payload: WorkoutPlanDto = {
        id: planId,
        name,
        focusArea,
        description,
        exercises: exercises.map((row, index) => ({
          exerciseName: row.exercise,
          exerciseType:
            row.type === "cardio"
              ? ExerciseType.NUMBER_1
              : row.type === "bodyweight"
                ? ExerciseType.NUMBER_2
                : ExerciseType.NUMBER_0,
          targetWeight: row.type === "cardio" || row.type === "bodyweight" ? null : Number(row.weight) || 0,
          targetReps: row.type === "cardio" ? null : Number(row.reps) || 0,
          targetDuration: row.type === "cardio" ? Number(row.duration) || 0 : null,
          targetDistance: row.type === "cardio" ? Number(row.distance) || 0 : null,
          orderIndex: index + 1,
        })),
      };

      const response = await putApiWorkoutPlanPlanId(planId, payload);

      if (response.status === 200) {
        onSaved?.();
        onOpenChange?.(false);
        return;
      }

      throw new Error(`Server error: ${response.status}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save plan.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={(o) => onOpenChange?.(o)}>
      <Dialog.Content
        style={{
          width: "min(94vw, 760px)",
          maxWidth: "760px",
          padding: "1.25rem",
          maxHeight: "84vh",
          display: "grid",
          gridTemplateRows: "auto 1fr",
          gap: "0.9rem",
        }}
      >
        <Flex align="center" justify="between">
          <Box>
            <Dialog.Title>
              <Text size="6" weight="bold" style={{ textTransform: "uppercase" }}>
                Edit Plan
              </Text>
            </Dialog.Title>
            <Dialog.Description style={{ marginTop: 6 }}>Modify plan details and save.</Dialog.Description>
          </Box>

          <Dialog.Close>
            <IconButton variant="ghost" color="gray" aria-label="Close edit dialog">
              <X size={18} />
            </IconButton>
          </Dialog.Close>
        </Flex>

        <Box style={{ overflowY: "auto", minHeight: 0 }}>
          {loading ? (
            <Box style={{ padding: "1rem" }}>
              <Text size="3">Loading…</Text>
            </Box>
          ) : (
            <Form.Root onSubmit={handleSave}>
              <div className="form-grid">
                <FormInput name="name" label="Name" value={name} onChange={(e) => setName(e.target.value)} />
                <FormInput name="focusArea" label="Focus area" value={focusArea} onChange={(e) => setFocusArea(e.target.value)} required={false} />
                <FormTextarea name="description" label="Description" value={description} onChange={(e) => setDescription(e.target.value)} required={false} />
                <ExercisesFieldset
                  rows={exercises}
                  onChange={handleExerciseChange}
                  onRemove={handleExerciseRemove}
                  onAdd={handleExerciseAdd}
                />
              </div>

              {error ? <Text size="2" style={{ color: "var(--danger)", marginTop: 8 }}>{error}</Text> : null}

              <Flex align="center" gap="2" style={{ marginTop: 12 }}>
                <DefaultButton size="2" variant="solid" type="submit" disabled={saving}>{saving ? "Saving…" : "Save"}</DefaultButton>
              </Flex>
            </Form.Root>
          )}
        </Box>
      </Dialog.Content>
    </Dialog.Root>
  );
}
