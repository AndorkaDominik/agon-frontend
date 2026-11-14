"use client";

import { useEffect, useState } from "react";
import { Dialog, Flex, Box, Text, IconButton } from "@radix-ui/themes";
import { X } from "lucide-react";
import DefaultButton from "@/app/components/DefaultButton/DefaultButton";
import { getApiTrainerDashboard, postApiWorkoutPlanAssignPlan } from "@/api/generated";
import type { AssignPlanRequestDto, AthleteDto } from "@/api/models";
import DefaultHeading from "@/app/components/DefaultHeading/DefaultHeading";

type AssignPlanDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planId?: number | null;
  planName?: string | null;
  onAssigned?: (athleteId: number) => void;
};

export default function AssignPlanDialog({ open, onOpenChange, planId, planName, onAssigned }: AssignPlanDialogProps) {
  const [athletes, setAthletes] = useState<AthleteDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [listError, setListError] = useState("");
  const [assigningId, setAssigningId] = useState<number | null>(null);
  const [assignError, setAssignError] = useState("");

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    const fetchAthletes = async () => {
      setLoading(true);
      setListError("");
      try {
        const response = await getApiTrainerDashboard();

        if (response.status !== 200) {
          throw new Error(response.data.detail ?? response.data.title ?? "Failed to load athletes.");
        }

        if (cancelled) return;

        setAthletes(response.data.myAthletes ?? []);
      } catch (err) {
        if (cancelled) return;
        setAthletes([]);
        setListError(err instanceof Error ? err.message : "Failed to load athletes.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void fetchAthletes();

    return () => {
      cancelled = true;
    };
  }, [open]);

  const handleAssignToAthlete = async (athleteId?: number) => {
    if (!planId || typeof athleteId !== "number" || assigningId !== null) return;
    setAssigningId(athleteId);
    setAssignError("");

    try {
      const payload: AssignPlanRequestDto = { templateId: planId, athleteId };
      const response = await postApiWorkoutPlanAssignPlan(payload);

      if (response.status === 200) {
        onAssigned?.(athleteId);
        onOpenChange(false);
        return;
      }

      setAssignError(response.data.detail ?? response.data.title ?? "Failed to assign plan.");
    } catch (err) {
      setAssignError(err instanceof Error ? err.message : "Failed to assign plan.");
    } finally {
      setAssigningId(null);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content
        style={{
          width: "min(94vw, 640px)",
          maxWidth: "640px",
          padding: "1rem",
          maxHeight: "84vh",
          display: "grid",
          gridTemplateRows: "auto 1fr",
          gap: "0.6rem",
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
              Assign <strong>{planName ?? "this plan"}</strong> to one of your athletes.
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
              <Text size="3">Loading athletes…</Text>
            </Box>
          ) : listError ? (
            <Box style={{ padding: "1rem" }}>
              <Text size="3" color="red" role="alert">{listError}</Text>
            </Box>
          ) : athletes.length === 0 ? (
            <Box style={{ padding: "1rem" }}>
              <Text size="3" style={{ color: "var(--text-soft)" }}>No athletes found.</Text>
            </Box>
          ) : (
            <div style={{ display: "grid", gap: "0.6rem" }}>
              {athletes.map((athlete) => (
                <Flex key={athlete.id} align="center" justify="between" style={{ padding: "0.6rem", border: "1px solid var(--border)", background: "var(--surface)" }}>
                  <Flex gap="2" align="center">
                    <DefaultHeading size="5" weight="bold">{athlete.name ?? "Unnamed athlete"}</DefaultHeading>
                    <Text size="2" style={{ color: "var(--text-soft)" }}>{athlete.email}</Text>
                  </Flex>

                  <DefaultButton
                    size="2"
                    variant="solid"
                    fullWidth={false}
                    disabled={assigningId !== null}
                    onClick={() => void handleAssignToAthlete(athlete.id)}
                  >
                    {assigningId === athlete.id ? "Assigning…" : "Assign"}
                  </DefaultButton>
                </Flex>
              ))}
            </div>
          )}

          {assignError ? (
            <Text as="p" size="2" color="red" role="alert" style={{ marginTop: "0.6rem" }}>{assignError}</Text>
          ) : null}
        </Box>
      </Dialog.Content>
    </Dialog.Root>
  );
}
