import type { AthleteDashboardProgressDto } from "@/api/models";

export type AthleteProgressProps = {
  progress: AthleteDashboardProgressDto;
};

export function formatProgressValue(value: number | undefined): string {
  return value !== undefined && Number.isFinite(value) ? value.toLocaleString('en-US') : '?';
}
