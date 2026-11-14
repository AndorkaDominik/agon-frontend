"use client";

import Navbar from "@/app/components/Navbar/Navbar";
import { useRouteProtection } from "@/app/lib/useRouteProtection";
import DefaultHeading from "@/app/components/DefaultHeading/DefaultHeading";
import { Box, Flex, Grid, Heading, Section, Text } from "@radix-ui/themes";
import NoPlans from "@/app/components/NoPlans/NoPlans";
import CreatePlanDialog from "@/app/athlete/plans/CreatePlanDialog";
import type { WorkoutPlanDto } from "@/api/models";
import { useCallback, useEffect, useState } from "react";
import { getApiWorkoutPlanTemplates, deleteApiWorkoutPlanPlanId } from "@/api/generated";
import ConfirmationDialog from "@/app/components/ConfirmationDialog/ConfirmationDialog";
import { PlanCard } from "@/app/athlete/plans/PlanCard";
import AssignPlanDialog from "@/app/trainer/plans/AssignPlanDialog";
import DefaultButton from "@/app/components/DefaultButton/DefaultButton";

export default function Plans() {
  useRouteProtection(["Trainer"]);
  const [plans, setPlans] = useState<WorkoutPlanDto[]>([]);
  const [planPendingAssign, setPlanPendingAssign] = useState<WorkoutPlanDto | null>(null);
  const [deletingPlanId, setDeletingPlanId] = useState<number | null>(null);
  const [planPendingDelete, setPlanPendingDelete] = useState<WorkoutPlanDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState("");
  const [deleteError, setDeleteError] = useState("");

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    setListError("");
    try {
      const response = await getApiWorkoutPlanTemplates();
      if (response.status !== 200) {
        throw new Error(response.data.detail ?? response.data.title ?? "Failed to load plans.");
      }

      setPlans(response.data);
    } catch (err) {
      setListError(err instanceof Error ? err.message : "Failed to load plans.");
      setPlans([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchPlans();
  }, [fetchPlans]);

  const requestAssign = (plan: WorkoutPlanDto) => {
    setPlanPendingAssign(plan);
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
      const response = await deleteApiWorkoutPlanPlanId(planId);

      if (response.status === 204) {
        setPlans((current) => current.filter((p) => p.id !== planId));
        setPlanPendingDelete(null);
        return;
      }

      throw new Error(response.data.detail ?? response.data.title ?? "Failed to delete plan.");
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : "Failed to delete plan.");
    } finally {
      setDeletingPlanId(null);
    }
  };

  return (
    <main className="layout-page">
      <Navbar />

      <Section className="container" style={{ paddingTop: "2rem", paddingBottom: "3rem" }}>
        <Flex align="center" justify="between" gap="4" wrap="wrap" style={{ marginBottom: "1.5rem" }}>
          <DefaultHeading size="9" style={{ marginBottom: 0 }}>
            Workout Plan Templates
          </DefaultHeading>

          <CreatePlanDialog onPlanCreated={() => void fetchPlans()} />
        </Flex>

        {loading ? (
          <Text role="status">Loading plans...</Text>
        ) : listError ? (
          <Flex className="card" align="center" justify="between" gap="3" role="alert">
            <Text style={{ color: "var(--danger)" }}>{listError}</Text>
            <DefaultButton variant="soft" fullWidth={false} onClick={() => void fetchPlans()}>
              Try again
            </DefaultButton>
          </Flex>
        ) : plans.length === 0 ? (
          <NoPlans description="You don't have any workout plans yet. Create one to start assigning to your athletes." />
        ) : (
          <Grid columns={{ initial: "1" }} gap="4">
            <section>
              <Heading size="8" style={{ marginBottom: "0.85rem", lineHeight: 1.05 }}>
                My plans
              </Heading>
              <Box style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
                {plans.map((plan) => (
                  <PlanCard
                    key={plan.id}
                    planId={plan.id}
                    isAssigned={false}
                    name={plan.name}
                    focusArea={plan.focusArea}
                    description={plan.description}
                    onDelete={() => requestPlanDelete(plan)}
                    isDeleting={deletingPlanId === plan.id}
                    showDeleteButton={true}
                    primaryLabel="Assign"
                    onPrimaryClick={() => requestAssign(plan)}
                  />
                ))}
              </Box>
            </section>
          </Grid>
        )}

        <ConfirmationDialog
          open={planPendingDelete !== null}
          onOpenChange={handleDeleteOpenChange}
          title="Delete plan"
          description={
            <>
              Are you sure you want to delete
              <strong> {planPendingDelete?.name ?? "this plan"}</strong>?
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

        <AssignPlanDialog
          open={planPendingAssign !== null}
          onOpenChange={(open) => !open && setPlanPendingAssign(null)}
          planId={planPendingAssign?.id}
          planName={planPendingAssign?.name ?? null}
          onAssigned={() => {
            void fetchPlans();
            setPlanPendingAssign(null);
          }}
        />
      </Section>
    </main>
  );
}
