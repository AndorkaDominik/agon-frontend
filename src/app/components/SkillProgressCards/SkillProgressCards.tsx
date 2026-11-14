import { Box, Flex, IconButton, Progress, Text, Tooltip } from "@radix-ui/themes";
import { Info } from "lucide-react";
import { SKILLS } from "@/app/constants/Skills";
import { formatProgressValue, type AthleteProgressProps } from "@/app/lib/skills";
import styles from "./SkillProgressCards.module.css";

export default function SkillProgressCards({ progress }: AthleteProgressProps) {
  const skillCards = SKILLS.map(({ key, label, Icon, xpSource }) => {
    const skill = progress[key];
    const percentage = skill?.progressPercentage;
    const value = percentage !== undefined && Number.isFinite(percentage)
      ? Math.min(100, Math.max(0, percentage))
      : null;
    const percentageLabel = value === null ? '—' : `${Math.round(value)}%`;
    const progressValueText = value === null ? 'Progress unavailable' : percentageLabel;
    const levelLabel = `Level ${formatProgressValue(skill?.level)}`;
    const xpLabel = `${formatProgressValue(skill?.currentXp)} / ${formatProgressValue(skill?.requiredXp)} XP`;
    const nextLevelLabel = skill
      ? `Need +${formatProgressValue(skill.xpToNextLevel)} XP to level up`
      : 'Skill progress unavailable';

    return {
      key, label, Icon, xpSource, progressValue: value ?? 0,
      percentageLabel, progressValueText, levelLabel, xpLabel, nextLevelLabel,
    };
  });

  return (
    <section className={styles.cards} aria-label="Skill progress">
      {skillCards.map(({
        key, label, Icon, xpSource, progressValue, percentageLabel,
        progressValueText, levelLabel, xpLabel, nextLevelLabel,
      }) => (
        <article key={key} className={`card ${styles.skillCard}`} aria-label={`${label} progress`}>
          <Flex align="start" gap="3">
            <span className={styles.skillIcon}><Icon size={24} aria-hidden="true" /></span>
            <Box className={styles.cardContent}>
              <Flex justify="between" align="center" gap="2" mb="2">
                <Flex align="center" gap="2">
                  <Text size="3" weight="bold">{label}</Text>
                  <Tooltip content={xpSource}>
                    <IconButton type="button" size="1" variant="ghost" color="gray" aria-label={`How to earn ${label} XP`}>
                      <Info size={16} aria-hidden="true" />
                    </IconButton>
                  </Tooltip>
                </Flex>
                <Text size="2" color="gray">{levelLabel}</Text>
              </Flex>
              <div className={styles.progressTrack}>
                <Progress value={progressValue} size="3" aria-label={`${label} XP progress`}
                  aria-valuetext={progressValueText} />
                <Text size="1" weight="bold" className={styles.percentage}>
                  {percentageLabel}
                </Text>
              </div>
              <Text as="p" size="2" mt="2">{xpLabel}</Text>
              <Text as="p" size="2" mt="1" color="gray">{nextLevelLabel}</Text>
            </Box>
          </Flex>
        </article>
      ))}
    </section>
  );
}
