"use client";

import Navbar from "@/app/components/Navbar/Navbar";
import { useRouteProtection } from "@/app/lib/useRouteProtection";
import DashboardHeader from "@/app/components/DashboardHeader/DashboardHeader";
import AthleteLevelBoard from "@/app/components/AthleteLevelBoard/AthleteLevelBoard";
import SkillProgressCards from "@/app/components/SkillProgressCards/SkillProgressCards";
import ActivityCalendar from "@/app/components/ActivityCalendar/ActivityCalendar";
import DiscussionPanel from "@/app/components/DiscussionPanel/DiscussionPanel";
import { useEffect, useState, useRef } from "react";
import { Button, Flex, Spinner, Text } from "@radix-ui/themes";

import {
  getApiWorkoutSessionActivityWeek,
  getApiWorkoutSessionDashboardProgress,
} from "@/api/generated";
import type { AthleteDashboardProgressDto, ActivityWeekResponseDto } from "@/api/models";

export default function AthleteDashboard() {
  useRouteProtection(["Athlete"]);
  const [progress, setProgress] = useState<AthleteDashboardProgressDto | null>(null);
  const [progressLoading, setProgressLoading] = useState(true);
  const [progressError, setProgressError] = useState(false);
  const [activityError, setActivityError] = useState(false);
  const [reload, setReload] = useState(0);
  const [activityWeek, setActivityWeek] = useState<ActivityWeekResponseDto | null>(null);
  const calendarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [progressRes, activityWeekRes] = await Promise.allSettled([
        getApiWorkoutSessionDashboardProgress(),
        getApiWorkoutSessionActivityWeek(),
      ]);

      const progressData = progressRes.status === 'fulfilled' && progressRes.value.status === 200
        ? progressRes.value.data : null;
      const activityData = activityWeekRes.status === 'fulfilled' && activityWeekRes.value.status === 200
        ? activityWeekRes.value.data : null;

      setProgress(progressData);
      setProgressError(!progressData);
      setActivityWeek(activityData);
      setActivityError(!activityData);
      setProgressLoading(false);
    };

    void fetchData();
  }, [reload]);

  const retry = () => {
    setProgressLoading(true);
    setProgressError(false);
    setActivityError(false);
    setReload((current) => current + 1);
  };

  return (
    <main className="layout-page">
      <Navbar />
      <div className="container">
        <DashboardHeader preTitle='Athlete Dashboard' />

        {progressLoading ? (
          <Flex className="card" align="center" gap="3" mt="5" role="status">
            <Spinner />
            <Text>Loading your progress…</Text>
          </Flex>
        ) : progressError ? (
          <Flex className="card" align="center" justify="between" gap="3" mt="5">
            <Text>Unable to load your progress.</Text>
            <Button variant="soft" onClick={retry}>Try again</Button>
          </Flex>
        ) : progress && (
          <>
            <AthleteLevelBoard progress={progress} />
            <SkillProgressCards progress={progress} />
          </>
        )}

        <Flex style={{ margin: '2rem 0' }} align="stretch" gap="2" justify="center">
          <div style={{ flex: 1 }} ref={calendarRef}>
            {activityError ? (
              <Flex className="card" align="center" justify="between" gap="3">
                <Text>Unable to load your activity.</Text>
                <Button variant="soft" onClick={retry}>Try again</Button>
              </Flex>
            ) : <ActivityCalendar weekData={activityWeek?.days ?? []} />}
          </div>

          <DiscussionPanel />
        </Flex>
      </div>
    </main>
  );
}