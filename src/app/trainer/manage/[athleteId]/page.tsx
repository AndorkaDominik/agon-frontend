"use client";

import { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar/Navbar";
import { useRouteProtection } from "@/app/lib/useRouteProtection";
import { Button, Flex, Spinner, Text } from "@radix-ui/themes";
import { useParams } from "next/navigation";
import { getApiTrainerDashboard, getApiTrainerManageAthleteId } from "@/api/generated";
import type { AthleteDto, ManageAthleteDataResponseDto } from "@/api/models";
import TrainerManageHeader from "@/app/components/TrainerManage/TrainerManageHeader";
import AssignedPlansPanel from "@/app/components/TrainerManage/AssignedPlansPanel";
import ActivityCalendar from "@/app/components/ActivityCalendar/ActivityCalendar";
import DiscussionPanel from "@/app/components/DiscussionPanel/DiscussionPanel";

export default function ManageAthletePage() {
  useRouteProtection(['Trainer']);
  const params = useParams<{ athleteId: string }>();
  const athleteId = Number(params.athleteId);
  const [loading, setLoading] = useState(true);
  const [athlete, setAthlete] = useState<AthleteDto | null>(null);
  const [data, setData] = useState<ManageAthleteDataResponseDto | null>(null);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError("");
      setAthlete(null);
      setData(null);
      try {
        if (!Number.isInteger(athleteId) || athleteId <= 0) {
          throw new Error("Invalid athlete ID.");
        }

        const [dashboardResponse, athleteResponse] = await Promise.all([
          getApiTrainerDashboard(),
          getApiTrainerManageAthleteId(athleteId),
        ]);

        if (dashboardResponse.status !== 200) {
          throw new Error("Unable to load athlete details.");
        }

        if (athleteResponse.status !== 200) {
          throw new Error(athleteResponse.data.detail ?? athleteResponse.data.title ?? "Unable to load athlete data.");
        }

        const selectedAthlete = dashboardResponse.data.myAthletes?.find((item) => item.id === athleteId);
        if (!selectedAthlete) {
          throw new Error("Athlete not found.");
        }

        if (!mounted) return;
        setAthlete(selectedAthlete);
        setData(athleteResponse.data);
      } catch (error) {
        if (mounted) setError(error instanceof Error ? error.message : "Unable to load athlete data.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void fetchData();

    return () => {
      mounted = false;
    };
  }, [athleteId, reload]);

  return (
    <main className="layout-page">
      <Navbar />
      <div className="container">

        <TrainerManageHeader loading={loading} athlete={athlete} />

        {loading ? (
          <Flex className="card" align="center" gap="3" mt="4" role="status">
            <Spinner />
            <Text>Loading athlete data...</Text>
          </Flex>
        ) : error ? (
          <Flex className="card" align="center" justify="between" gap="3" mt="4" role="alert">
            <Text>{error}</Text>
            <Button variant="soft" onClick={() => setReload((current) => current + 1)}>Try again</Button>
          </Flex>
        ) : data && (
          <Flex style={{ marginTop: '1rem' }} gap="2" align="stretch">
            <div style={{ width: 320 }}>
              <AssignedPlansPanel key={athleteId} athleteId={athleteId} initialPlans={data.assignedPlans ?? []} />
            </div>

            <div style={{ flex: 1 }}>
              <ActivityCalendar weekData={data.activityWeek?.days ?? []} />
            </div>

            <div style={{ width: 380 }}>
              <DiscussionPanel useAthleteLogic={false} athleteId={athleteId} />
            </div>
          </Flex>
        )}
      </div>
    </main>
  );
}
