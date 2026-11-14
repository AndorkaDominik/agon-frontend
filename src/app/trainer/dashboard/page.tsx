"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SegmentedControl, Box, Flex, Text, Section } from "@radix-ui/themes";
import {
  getApiTrainerDashboard,
  postApiTrainerRequestsRequestIdRespond,
  postApiTrainerDisconnectAthleteId,
} from "@/api/generated";
import { RequestStatus, type TrainerDashboardDto } from "@/api/models";
import Navbar from "@/app/components/Navbar/Navbar";
import DashboardHeader from "@/app/components/DashboardHeader/DashboardHeader";
import TrainerRequestCard from "@/app/components/TrainerRequestCard/TrainerRequestCard";
import TrainerAthleteCard from "@/app/components/TrainerAthleteCard/TrainerAthleteCard";
import ConfirmationDialog from "@/app/components/ConfirmationDialog/ConfirmationDialog";
import DefaultButton from "@/app/components/DefaultButton/DefaultButton";
import { useRouteProtection } from "@/app/lib/useRouteProtection";

export default function TrainerDashboard() {
  useRouteProtection(["Trainer"]);

  const [activeTab, setActiveTab] = useState<"myathletes" | "requests">("myathletes");
  const [dashboard, setDashboard] = useState<TrainerDashboardDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [athleteToDisconnect, setAthleteToDisconnect] = useState<number | null>(null);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [requestError, setRequestError] = useState("");
  const [disconnectError, setDisconnectError] = useState("");
  const athletes = dashboard?.myAthletes ?? [];
  const pendingRequests = dashboard?.requests?.filter((request) => request.status === RequestStatus.NUMBER_0) ?? [];

  const router = useRouter();

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const response = await getApiTrainerDashboard();
      if (response.status !== 200) {
        throw new Error(response.data.detail ?? response.data.title ?? "Failed to load dashboard.");
      }

      setDashboard(response.data);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Failed to load dashboard.");
      setDashboard(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchDashboard();
  }, [fetchDashboard]);

  const handleRespond = async (requestId: number | undefined, accept: boolean) => {
    if (typeof requestId !== "number") return;
    setRequestError("");
    try {
      const response = await postApiTrainerRequestsRequestIdRespond(requestId, { accept });
      if (response.status !== 200) {
        throw new Error(response.data.detail ?? response.data.title ?? "Failed to respond to request.");
      }

      void fetchDashboard();
    } catch (error) {
      setRequestError(error instanceof Error ? error.message : "Failed to respond to request.");
    }
  };

  const openDisconnectConfirm = (id: number | undefined) => {
    if (typeof id !== "number") return;
    setAthleteToDisconnect(id);
    setDisconnectError("");
    setConfirmOpen(true);
  };

  const handleDisconnect = async () => {
    if (athleteToDisconnect === null || isDisconnecting) return;
    setIsDisconnecting(true);
    setDisconnectError("");
    try {
      const response = await postApiTrainerDisconnectAthleteId(athleteToDisconnect);
      if (response.status !== 200) {
        throw new Error(response.data.detail ?? response.data.title ?? "Failed to disconnect athlete.");
      }

      setConfirmOpen(false);
      setAthleteToDisconnect(null);
      void fetchDashboard();
    } catch (error) {
      setDisconnectError(error instanceof Error ? error.message : "Failed to disconnect athlete.");
    } finally {
      setIsDisconnecting(false);
    }
  };

  const handleTabChange = (value: string) => {
    if (value === "myathletes" || value === "requests") {
      setActiveTab(value);
    }
  };

  const handleManageAthlete = (athleteId?: number) => {
    if (typeof athleteId === "number") {
      router.push(`/trainer/manage/${athleteId}`);
    }
  };

  const handleConfirmOpenChange = (open: boolean) => {
    setConfirmOpen(open);
    setDisconnectError("");
    if (!open) setAthleteToDisconnect(null);
  };

  return (
    <main className="layout-page">
      <Navbar />

      <Section className="container" style={{ paddingTop: "2rem", paddingBottom: "3rem" }}>
        <DashboardHeader
          preTitle="TRAINER DASHBOARD"
          stats={{
            athletesCount: dashboard?.info?.athletesCount ?? athletes.length,
            pending: pendingRequests.length,
          }}
        />

        <SegmentedControl.Root
          value={activeTab}
          onValueChange={handleTabChange}
          variant="surface"
          style={{ marginTop: "1rem", marginBottom: "1.5rem" }}
        >
          <SegmentedControl.Item value="myathletes">My athletes ({athletes.length})</SegmentedControl.Item>
          <SegmentedControl.Item value="requests">Requests ({pendingRequests.length})</SegmentedControl.Item>
        </SegmentedControl.Root>

        {loadError && (
          <Flex className="card" align="center" justify="between" gap="3" role="alert">
            <Text style={{ color: "var(--danger)" }}>{loadError}</Text>
            <DefaultButton variant="soft" fullWidth={false} onClick={() => void fetchDashboard()}>
              Try again
            </DefaultButton>
          </Flex>
        )}

        {!loadError && activeTab === "requests" && (
          <Box>
            {requestError && (
              <Text as="p" size="2" role="alert" style={{ color: "var(--danger)", marginBottom: "1rem" }}>
                {requestError}
              </Text>
            )}
            {loading ? (
              <Text>Loading...</Text>
            ) : pendingRequests.length === 0 ? (
              <Text>No requests</Text>
            ) : (
              <Box style={{ display: "grid", gap: "1rem" }}>
                {pendingRequests.map((request) => (
                  <TrainerRequestCard
                    key={request.id}
                    request={request}
                    athlete={athletes.find((athlete) => athlete.id === request.athleteId)}
                    onRespond={handleRespond}
                  />
                ))}
              </Box>
            )}
          </Box>
        )}

        {!loadError && activeTab === "myathletes" && (
          <Box style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(3, 1fr)", marginTop: "1rem" }}>
            {loading ? (
              <Text>Loading...</Text>
            ) : athletes.length === 0 ? (
              <Text>No athletes found</Text>
            ) : (
              athletes.map((athlete) => (
                <TrainerAthleteCard
                  key={athlete.id}
                  athlete={athlete}
                  onDisconnect={openDisconnectConfirm}
                  onManage={handleManageAthlete}
                />
              ))
            )}
          </Box>
        )}

        <ConfirmationDialog
          open={confirmOpen}
          onOpenChange={handleConfirmOpenChange}
          title="Remove athlete?"
          description={
            <>
              Are you sure you want to remove this athlete from your connections?
              {disconnectError && (
                <Text as="span" size="2" role="alert" style={{ display: "block", color: "var(--danger)", marginTop: "0.5rem" }}>
                  {disconnectError}
                </Text>
              )}
            </>
          }
          confirmLabel="Remove"
          cancelLabel="Cancel"
          variant="danger"
          onConfirm={() => void handleDisconnect()}
          isConfirmLoading={isDisconnecting}
          disableClose={isDisconnecting}
        />
      </Section>
    </main>
  );
}
