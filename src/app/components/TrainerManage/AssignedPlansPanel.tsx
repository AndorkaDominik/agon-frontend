"use client";

import { useState } from "react";
import { Flex, Text } from "@radix-ui/themes";
import TrainerPlansDialog from "@/app/components/TrainerManage/TrainerPlansDialog";
import { deleteApiWorkoutPlanAssignedPlanId, getApiTrainerManageAthleteId } from "@/api/generated";
import type { WorkoutPlanDto } from "@/api/models";
import { Pen, Trash2 } from "lucide-react";
import IconButton from "@/app/components/IconButton/IconButton";
import ConfirmationDialog from "@/app/components/ConfirmationDialog/ConfirmationDialog";
import EditPlanDialog from "@/app/components/TrainerManage/EditPlanDialog";

function PlanItem({ title, onEdit, onDelete, isDeleting }: { title: string; onEdit?: () => void; onDelete?: () => void; isDeleting?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.6rem", background: "var(--surface)", border: "1px solid var(--border)" }}>
      <div>
        <Text size="2" weight="bold">{title}</Text>
      </div>
      <Flex align="center" gap="2">
        <IconButton icon={<Pen size={14} />} variant="outline" side="36px" ariaLabel="Edit plan" onClick={onEdit} />
        <IconButton icon={<Trash2 size={14} />} variant="outline" color="red" side="36px" ariaLabel="Delete plan" onClick={onDelete} isLoading={isDeleting} />
      </Flex>
    </div>
  );
}

type AssignedPlansPanelProps = {
  athleteId: number;
  initialPlans: WorkoutPlanDto[];
};

export default function AssignedPlansPanel({ athleteId, initialPlans }: AssignedPlansPanelProps) {
  const [plans, setPlans] = useState<WorkoutPlanDto[]>(initialPlans);
  const [editOpen, setEditOpen] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [planPendingDelete, setPlanPendingDelete] = useState<WorkoutPlanDto | null>(null);
  const [deletingPlanId, setDeletingPlanId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState("");

  const fetchAssigned = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getApiTrainerManageAthleteId(athleteId);
      if (response.status !== 200) {
        throw new Error(response.data.detail ?? response.data.title ?? "Failed to load assigned plans.");
      }
      setPlans(response.data.assignedPlans ?? []);
    } catch (err) {
      setPlans([]);
      setError(err instanceof Error ? err.message : "Failed to load assigned plans.");
    } finally {
      setLoading(false);
    }
  };

  const requestPlanDelete = (plan: WorkoutPlanDto) => {
    setDeleteError("");
    setPlanPendingDelete(plan);
  };

  const handleDeleteOpenChange = (open: boolean) => {
    if (!open) {
      setPlanPendingDelete(null);
      setDeleteError("");
    }
  };

  const handlePlanDeleteConfirm = async () => {
    const planId = planPendingDelete?.id;
    if (typeof planId !== "number" || deletingPlanId !== null) return;

    setDeleteError("");
    setDeletingPlanId(planId);

    try {
      const response = await deleteApiWorkoutPlanAssignedPlanId(planId);

      if (response.status === 204) {
        setPlans((current) => current.filter((plan) => plan.id !== planId));
        setPlanPendingDelete(null);
        return;
      }

      throw new Error(response.data.detail ?? response.data.title ?? "Failed to delete assigned plan.");
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : "Failed to delete assigned plan.");
    } finally {
      setDeletingPlanId(null);
    }
  };

  return (
    <div className="card" style={{ padding: "1rem" }}>
      <Flex align="center" justify="between" style={{ marginBottom: 12 }}>
        <Text size="3" weight="bold">Assigned Plans</Text>
        <TrainerPlansDialog athleteId={athleteId} onAssigned={() => void fetchAssigned()} />
      </Flex>

      <div style={{ display: "grid", gap: "0.6rem" }}>
        {loading ? (
          <Text size="3" style={{ color: "var(--text-soft)" }}>Loading assigned plans…</Text>
        ) : error ? (
          <Text size="3" role="alert" style={{ color: "var(--danger)" }}>{error}</Text>
        ) : plans.length === 0 ? (
          <Text size="3" style={{ color: "var(--text-soft)" }}>No plans assigned</Text>
        ) : (
          <>
            {plans.map((p: WorkoutPlanDto, idx) => (
              <PlanItem
                key={p.id ?? idx}
                title={p.name ?? 'Workout plan'}
                onEdit={() => { setEditingPlanId(p.id ?? undefined); setEditOpen(true); }}
                onDelete={() => requestPlanDelete(p)}
                isDeleting={deletingPlanId === p.id}
              />
            ))}
          </>
        )}
      </div>
      <EditPlanDialog
        planId={editingPlanId}
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open);
          if (!open) setEditingPlanId(undefined);
        }}
        onSaved={() => {
          void fetchAssigned();
          setEditOpen(false);
        }}
      />
      <ConfirmationDialog
        open={planPendingDelete !== null}
        onOpenChange={handleDeleteOpenChange}
        title="Delete assigned plan"
        description={
          <>
            Are you sure you want to remove
            <strong> {planPendingDelete?.name ?? "this plan"}</strong> from the athlete?
            This action cannot be undone.
            {deleteError && (
              <Text as="span" size="2" role="alert" style={{ display: "block", color: "var(--danger)", marginTop: "0.5rem" }}>
                {deleteError}
              </Text>
            )}
          </>
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={() => void handlePlanDeleteConfirm()}
        isConfirmLoading={deletingPlanId === planPendingDelete?.id}
        variant="danger"
        disableClose={deletingPlanId === planPendingDelete?.id}
      />
    </div>
  );
}
