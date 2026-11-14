"use client";

import { useEffect, useState } from "react";
import { Dialog, Box, Flex, Text, IconButton } from "@radix-ui/themes";
import { X } from "lucide-react";
import DefaultButton from "@/app/components/DefaultButton/DefaultButton";
import { getApiWorkoutPlanTemplates, postApiWorkoutPlanAssignPlan } from "@/api/generated";
import type { AssignPlanRequestDto, WorkoutPlanDto } from "@/api/models";
import DefaultHeading from "@/app/components/DefaultHeading/DefaultHeading";

type TrainerPlansDialogProps = {
  athleteId: number;
  disabled?: boolean;
  onAssigned?: () => void;
};

export default function TrainerPlansDialog({ athleteId, disabled = false, onAssigned }: TrainerPlansDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [plans, setPlans] = useState<WorkoutPlanDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [listError, setListError] = useState("");
  const [assigningId, setAssigningId] = useState<number | null>(null);
  const [assignError, setAssignError] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;
    const fetchPlans = async () => {
      setLoading(true);
      setListError("");
      try {
        const response = await getApiWorkoutPlanTemplates();

        if (response.status !== 200) {
          throw new Error(`Server error: ${response.status}`);
        }

        if (cancelled) return;

        setPlans(response.data);
      } catch (err) {
        if (cancelled) return;
        setPlans([]);
        setListError(err instanceof Error ? err.message : "Failed to load plans.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void fetchPlans();

    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  const assignPlan = async (planId?: number) => {
    if (!planId) return;
    if (!athleteId) {
      setAssignError("No athlete selected.");
      return;
    }

    setAssigningId(planId);
    setAssignError("");

    try {
      const payload: AssignPlanRequestDto = { templateId: planId, athleteId };
      const response = await postApiWorkoutPlanAssignPlan(payload);

      if (response.status === 200) {
        setIsOpen(false);
        onAssigned?.();
        return;
      }

      setAssignError(`Server error: ${response.status}`);
    } catch (err) {
      setAssignError(err instanceof Error ? err.message : "Failed to assign plan.");
    } finally {
      setAssigningId(null);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <Dialog.Trigger>
        <DefaultButton size="2" variant="solid" fullWidth={false} disabled={disabled}>Assign Plan</DefaultButton>
      </Dialog.Trigger>

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
                Assign Plan
              </Text>
            </Dialog.Title>
            <Dialog.Description style={{ marginTop: "0.25rem" }}>
              Choose one of your plans to assign to the athlete.
            </Dialog.Description>
          </Box>

          <Dialog.Close>
            <IconButton variant="ghost" color="gray" aria-label="Close assign dialog">
              <X size={18} />
            </IconButton>
          </Dialog.Close>
        </Flex>

        <Box style={{ overflowY: "auto", minHeight: 0 }}>
          {loading ? (
            <Box style={{ padding: "1rem" }}>
              <Text size="3">Loading plans…</Text>
            </Box>
          ) : listError ? (
            <Box style={{ padding: "1rem" }}>
              <Text size="3" style={{ color: "var(--danger)" }}>{listError}</Text>
            </Box>
          ) : plans.length === 0 ? (
            <Box style={{ padding: "1rem" }}>
              <Text size="3" style={{ color: "var(--text-soft)" }}>No plans found.</Text>
            </Box>
          ) : (
            <div style={{ display: "grid", gap: "0.6rem" }}>
              {plans.map((p) => (
                <div
                  key={p.id}
                  className="card"
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.8rem", border: "1px solid var(--border)", background: "var(--surface)" }}
                >
                  <Flex style={{ minWidth: 0 }} gap="2">
                    <DefaultHeading size="5" weight="bold">{p.name ?? 'Plan'}</DefaultHeading>
                    <Text size="2" style={{ color: "var(--text-soft)", marginTop: 6 }}>{p.exercises ? `${p.exercises.length} exercises` : (p.focusArea ?? '')}</Text>
                  </Flex>

                    <DefaultButton
                      size="2"
                      variant="solid"
                      fullWidth={false}
                      disabled={assigningId !== null}
                      onClick={() => assignPlan(p.id)}
                    >
                      {assigningId === p.id ? "Assigning…" : "Assign"}
                    </DefaultButton>
                </div>
              ))}
            </div>
          )}

          {assignError ? (
            <Text as="p" size="2" style={{ color: "var(--danger)", marginTop: "0.6rem" }}>{assignError}</Text>
          ) : null}
        </Box>
      </Dialog.Content>
    </Dialog.Root>
  );
}
