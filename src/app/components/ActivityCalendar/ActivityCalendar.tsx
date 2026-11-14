import { Box, Flex, Text } from "@radix-ui/themes";
import DefaultHeading from "@/app/components/DefaultHeading/DefaultHeading";
import type { ActivityDayDto } from "@/api/models/activityDayDto";
import { isToday } from "@/app/lib/dateUtils";
import { WEEKDAY_SHORT } from "@/app/constants/WeekdayShort";

export default function ActivityCalendar({ weekData }: { weekData: ActivityDayDto[] }) {
  return (
    <Box style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Flex align="center" justify="between" style={{ marginBottom: '0.5rem', background: 'var(--surface-soft)', padding: '0.75rem 1.25rem', border: '1px solid var(--border)' }}>
        <DefaultHeading size="5" style={{ margin: 0 }}>Current week</DefaultHeading>
        <Flex align="center" gap="3">
          <Box style={{ width: 18, height: 18, background: 'var(--accent-surface)', display: 'inline-block', margin: '0 8px 0 16px', border: '2px solid var(--accent-indicator)' }} />
          <Text size="2" style={{ color: 'var(--text-soft)' }}>Today</Text>
          <Box style={{ width: 18, height: 18, background: 'var(--accent-3)', display: 'inline-block', marginRight: 4, border: '1px solid var(--border)' }} />
          <Text size="2" style={{ color: 'var(--text-soft)' }}>Workout day</Text>
        </Flex>
      </Flex>
      <Box style={{ flex: 1, overflowY: 'auto' }}>
        {weekData.map((day, idx) => {
          if (!day.date) {
            return null;
          }

          const dateObj = new Date(day.date);
          const dayShort = WEEKDAY_SHORT[dateObj.getDay()];
          const hasWorkout = Boolean(day.workoutName);

          return (
            <Flex key={day.date ?? idx} direction="row" align="stretch" style={{ marginBottom: 12 }}>
              <Box
                style={{
                  background: isToday(dateObj) ? 'var(--accent-surface)' : 'var(--surface)',
                  border: isToday(dateObj) ? '2px solid var(--accent-indicator)' : '1px solid var(--border)',
                  minWidth: 38,
                  minHeight: 64,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: 18,
                  color: 'var(--text)',
                }}
              >
                <div>{dayShort}</div>
                <div style={{ fontSize: 14, fontWeight: 400, color: 'var(--text-soft)' }}>
                  {dateObj.getDate()}
                </div>
              </Box>

              <Box
                style={{
                  flex: 1,
                  background: hasWorkout ? 'var(--accent-3)' : 'var(--surface)',
                  color: 'var(--text)',
                  marginLeft: 10,
                  padding: '14px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  minHeight: 64,
                  border: '1px solid var(--border)',
                }}
              >
                {hasWorkout ? (
                  <Flex align="center" justify="between" style={{ width: '100%' }}>
                    <Box>
                      <Text size="2" style={{ color: 'var(--text-soft)' }}>
                        Did a workout called:
                      </Text>
                      <DefaultHeading size="6" style={{ margin: '2px 0 0 0', color: 'var(--text)' }}>
                        {day.workoutName}
                      </DefaultHeading>
                    </Box>
                    <Box style={{ textAlign: 'right', minWidth: 120 }}>
                      <Text size="2" style={{ color: 'var(--text-soft)' }}>
                        {day.exerciseCount ?? 0} exercises
                      </Text>
                      <br />
                      <Text size="2" style={{ color: 'var(--text-soft)' }}>
                        {day.totalReps ?? 0} reps
                      </Text>
                      <br />
                      <Text size="2" style={{ color: 'var(--text-soft)' }}>
                        {((day.totalWeight ?? 0) / 1000).toFixed(1)}t of weight
                      </Text>
                    </Box>
                  </Flex>
                ) : (
                  <Text size="3" style={{ color: 'var(--text-soft)' }}>
                    No workout - Rest Day
                  </Text>
                )}
              </Box>
            </Flex>
          );
        })}
      </Box>
    </Box>
  );
}
