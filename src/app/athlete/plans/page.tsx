"use client";

import Navbar from "@/app/components/Navbar/Navbar";
import { useRouteProtection } from "@/app/lib/useRouteProtection";
import DefaultHeading from "@/app/components/DefaultHeading/DefaultHeading";
import { Box, Flex, Grid, Heading, Section, Text } from "@radix-ui/themes";
import NoPlans from "@/app/components/NoPlans/NoPlans";
import CreatePlanDialog from "@/app/athlete/plans/CreatePlanDialog";
import type { WorkoutPlanDto } from "@/api/models";
import { useCallback, useEffect, useState } from "react";
import {
  deleteApiWorkoutPlanPlanId,
  getApiWorkoutPlanAssignedPlans,
  getApiWorkoutPlanPlans,
} from "@/api/generated";
import { PlanCard } from "@/app/athlete/plans/PlanCard";
import ConfirmationDialog from "@/app/components/ConfirmationDialog/ConfirmationDialog";
import DefaultButton from "@/app/components/DefaultButton/DefaultButton";

export default function Plans() {
  useRouteProtection(["Athlete"]);
  const [athletePlans, setAthletePlans] = useState<WorkoutPlanDto[]>([]);
  const [assignedPlans, setAssignedPlans] = useState<WorkoutPlanDto[]>([]);
  const [deletingPlanId, setDeletingPlanId] = useState<number | null>(null);
  const [planPendingDelete, setPlanPendingDelete] = useState<WorkoutPlanDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const hasAssignedPlans = assignedPlans.length > 0;

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    setListError("");
    try {
      const [athletePlansRes, assignedPlansRes] = await Promise.all([
        getApiWorkoutPlanPlans(),
        getApiWorkoutPlanAssignedPlans(),
      ]);

      if (athletePlansRes.status !== 200) {
        throw new Error(athletePlansRes.data.detail ?? athletePlansRes.data.title ?? "Failed to load your plans.");
      }
      if (assignedPlansRes.status !== 200) {
        throw new Error(assignedPlansRes.data.detail ?? assignedPlansRes.data.title ?? "Failed to load assigned plans.");
      }

      setAthletePlans(athletePlansRes.data);
      setAssignedPlans(assignedPlansRes.data);
    } catch (error) {
      setListError(error instanceof Error ? error.message : "Failed to load plans.");
      setAthletePlans([]);
      setAssignedPlans([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePlanCreated = () => {
    void fetchPlans();
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

    if (typeof planId !== "number" || deletingPlanId !== null) {
      return;
    }

    setDeleteError("");
    setDeletingPlanId(planId);

    try {
      const response = await deleteApiWorkoutPlanPlanId(planId);

      if (response.status === 204) {
        setAthletePlans((current) => current.filter((plan) => plan.id !== planId));
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

  useEffect(() => {
    void fetchPlans();
  }, [fetchPlans]);

  return (
    <main className="layout-page">
      <Navbar />

      <Section className="container" style={{ paddingTop: "2rem", paddingBottom: "3rem" }}>
        <Flex align="center" justify="between" gap="4" wrap="wrap" style={{ marginBottom: "1.5rem" }}>
          <DefaultHeading size="9" style={{ marginBottom: 0 }}>
            Workout Plans
          </DefaultHeading>

          <CreatePlanDialog onPlanCreated={handlePlanCreated} />
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
        ) : athletePlans.length === 0 && assignedPlans.length === 0 ? (
          <NoPlans description="Your created and assigned workout plans will appear here. Create one now, or wait for your trainer to assign one." />
        ) : (
          <Grid columns={{ initial: "1", md: hasAssignedPlans ? "2" : "1" }} gap="4">
            <section>
              <Heading size="8" style={{ marginBottom: "0.85rem", lineHeight: 1.05 }}>
                My plans
              </Heading>
              {athletePlans.length === 0 ? (
                <NoPlans description="Your created workout plans will appear here."/>
              ) : (
                <Box
                  style={{
                    display: "grid",
                    gap: "1rem",
                    gridTemplateColumns: hasAssignedPlans ? "1fr" : "repeat(2, minmax(0, 1fr))",
                }}
              >
                {athletePlans.map((plan) => (
                  <PlanCard
                    key={plan.id}
                    planId={plan.id}
                    isAssigned={false}
                    name={plan.name}
                    focusArea={plan.focusArea}
                    description={plan.description}
                    onDelete={() => requestPlanDelete(plan)}
                    isDeleting={deletingPlanId === plan.id}
                  />
                ))}
              </Box>
              )}
            </section>

            {hasAssignedPlans && (
              <section style={{ borderLeft: "1px solid var(--border)", paddingLeft: "1rem" }}>
                <Heading size="8" style={{ marginBottom: "0.85rem", lineHeight: 1.05 }}>
                  Plans assigned by your Trainer
                </Heading>
                <Box style={{ display: "grid", gap: "1rem" }}>
                  {assignedPlans.map((plan) => (
                    <PlanCard
                      key={plan.id}
                      planId={plan.id}
                      isAssigned={true}
                      name={plan.name}
                      focusArea={plan.focusArea}
                      description={plan.description}
                      showDeleteButton={false}
                    />
                  ))}
                </Box>
              </section>
            )}
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
      </Section>
    </main>
  );
}
