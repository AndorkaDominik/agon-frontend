import Link from "next/link";
import { Button, Text } from "@radix-ui/themes";
import { Check, Trophy } from "lucide-react";
import type { WorkoutXpRewardDto } from "@/api/models";
import DefaultHeading from "@/app/components/DefaultHeading/DefaultHeading";
import Navbar from "@/app/components/Navbar/Navbar";
import { SKILLS } from "@/app/constants/Skills";
import { formatProgressValue } from "@/app/lib/skills";
import styles from "./congrats.module.css";

type CongratsSummaryPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CongratsSummaryPage({ searchParams }: CongratsSummaryPageProps) {
  const params = await searchParams;
  const reward: WorkoutXpRewardDto = {};

  for (const { rewardKey } of SKILLS) {
    const value = params[rewardKey];
    if (typeof value !== "string" || value.trim() === "") continue;

    const xp = Number(value);
    if (Number.isFinite(xp) && xp >= 0) {
      reward[rewardKey] = xp;
    }
  }

  const hasCompleteReward = SKILLS.every(({ rewardKey }) => reward[rewardKey] !== undefined);
  const totalXp = hasCompleteReward
    ? SKILLS.reduce((total, { rewardKey }) => total + (reward[rewardKey] ?? 0), 0)
    : undefined;

  return (
    <div className="layout-page">
      <Navbar />
      <main className={`layout-content ${styles.content}`}>
        <section className={`card ${styles.summary}`} aria-labelledby="completion-heading">
          <header className={styles.header}>
            <span className={styles.trophy}><Trophy size={24} aria-hidden="true" /></span>
            <Text size="1" weight="bold" className={styles.eyebrow}>
              <Check size={14} aria-hidden="true" /> Workout complete
            </Text>
            <DefaultHeading as="h1" id="completion-heading" size="7" className={styles.heading}>
              Congratulations!
            </DefaultHeading>
            <Text as="p" size="2" color="gray">
              You showed up. You put in the work. Here's what you earned.
            </Text>
          </header>

          <dl className={styles.rewards}>
            {SKILLS.filter(({ rewardKey }) => reward[rewardKey] != 0).map(({ key, rewardKey, label, Icon }) => (
              
              <div key={key} className={styles.row}>
                <dt className={styles.skill}><Icon size={20} aria-hidden="true" />{label}</dt>
                <dd className={styles.amount}>
                  {reward[rewardKey] === undefined ? "?" : `+${formatProgressValue(reward[rewardKey])}`} XP
                </dd>
              </div>
            ))}
            <div className={`${styles.row} ${styles.total}`}>
              <dt>Total earned</dt>
              <dd className={styles.amount}>{totalXp === undefined ? "?" : `+${formatProgressValue(totalXp)}`} XP</dd>
            </div>
          </dl>

          {!hasCompleteReward && (
            <Text as="p" size="2" color="gray" role="status">
              Some XP details are unavailable. Check your dashboard for your latest progress.
            </Text>
          )}

          <Button asChild size="3" className={styles.button}>
            <Link href="/athlete/dashboard">Back to Dashboard</Link>
          </Button>
        </section>
      </main>
    </div>
  );
}
