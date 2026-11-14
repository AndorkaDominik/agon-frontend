"use client";

import { useState } from "react";
import { Heading, Text, Tooltip, IconButton, Flex } from "@radix-ui/themes";
import { Calculator, Info } from "lucide-react";
import { postApiWorkoutSessionXpReward } from "@/api/generated";
import type { WorkoutSessionDto, WorkoutXpRewardDto } from "@/api/models";
import { formatProgressValue } from "@/app/lib/skills";
import DefaultButton from "@/app/components/DefaultButton/DefaultButton";
import styles from "./WorkoutXpReward.module.css";
import { SKILLS } from "@/app/constants/Skills";

type WorkoutXpRewardProps = {
  workout: WorkoutSessionDto;
  disabled?: boolean;
};

type RewardResult = {
  inputKey: string;
  reward: WorkoutXpRewardDto | null;
};

export default function WorkoutXpReward({ workout, disabled = false }: WorkoutXpRewardProps) {
  const [result, setResult] = useState<RewardResult | null>(null);
  const [calculating, setCalculating] = useState(false);
  const inputKey = JSON.stringify(workout);
  const currentResult = result?.inputKey === inputKey ? result : null;
  const reward = currentResult?.reward;
  const totalXp = reward && SKILLS.every(({ rewardKey }) => Number.isFinite(reward[rewardKey]))
    ? SKILLS.reduce((total, { rewardKey }) => total + (reward[rewardKey] ?? 0), 0)
    : undefined;

  const calculateReward = async () => {
    setCalculating(true);
    setResult(null);
    try {
      const response = await postApiWorkoutSessionXpReward(workout);
      setResult({ inputKey, reward: response.status === 200 ? response.data : null });
    } catch {
      setResult({ inputKey, reward: null });
    } finally {
      setCalculating(false);
    }
  };

  return (
    <section className={styles.wrapper} aria-busy={calculating}>
      <div className={styles.header}>
        <Flex align="center" gap="2">
          <Heading as="h2" size="7">XP Reward</Heading>
            <Tooltip content="Not required to calculate XP reward manually, it will be calculated automatically after your workout.">
              <IconButton type="button" size="1" variant="ghost" color="gray" aria-label="How level is calculated">
                <Info size={16} aria-hidden="true" />
              </IconButton>
            </Tooltip>
        </Flex>
        <DefaultButton
          type="button"
          variant="soft"
          size="2"
          fullWidth={false}
          icon={<Calculator size={16} />}
          isLoading={calculating}
          disabled={disabled || calculating}
          onClick={calculateReward}
        >
          Calculate Reward
        </DefaultButton>
      </div>

      <div className={styles.rewards}>
        {SKILLS.map(({ key, rewardKey, label }, index) => (
          <div key={key} className={styles.term}>
            {index > 0 && <span className={styles.operator} aria-hidden="true">+</span>}
            <div className={styles.skill}>
              <Text size="2" color="gray">{label}</Text>
              <div className={styles.amount}>
                <Text className={styles.value}>{formatProgressValue(reward?.[rewardKey])}</Text>
                <Text size="2">XP</Text>
              </div>
            </div>
          </div>
        ))}
        <div className={styles.term}>
          <span className={styles.operator} aria-hidden="true">=</span>
          <div className={styles.skill}>
            <Text size="2" color="gray">Total</Text>
            <div className={`${styles.amount} ${styles.total}`}>
              <Text className={styles.value}>{formatProgressValue(totalXp)}</Text>
              <Text size="2">XP</Text>
            </div>
          </div>
        </div>
      </div>

      {currentResult && !reward && (
        <Text as="p" size="2" color="red" role="alert">
          Unable to calculate XP reward. Please try again.
        </Text>
      )}
    </section>
  );
}
