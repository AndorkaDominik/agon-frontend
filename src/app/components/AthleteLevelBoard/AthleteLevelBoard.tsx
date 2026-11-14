import { Box, Flex, Heading, IconButton, Text, Tooltip } from "@radix-ui/themes";
import { Info } from "lucide-react";
import AnimalAvatarWithBadge from "@/app/components/AnimalAvatar/AnimalAvatarWithBadge";
import { getAnimalImagePath, getAnimalTierForLevel } from "@/app/lib/animalTier";
import { formatProgressValue, type AthleteProgressProps } from "@/app/lib/skills";
import styles from "./AthleteLevelBoard.module.css";

export default function AthleteLevelBoard({ progress }: AthleteProgressProps) {
  const level = progress.overallLevel;
  const displayLevel = level !== undefined && Number.isFinite(level)
    ? formatProgressValue(level).padStart(2, '0')
    : formatProgressValue(level);
  const animal = level !== undefined && Number.isFinite(level) ? getAnimalTierForLevel(level) : null;

  return (
    <section className={`card ${styles.board}`} aria-label="Athlete level">
      <Box className={styles.avatarSlot}>
        {animal ? (
          <AnimalAvatarWithBadge
            src={getAnimalImagePath(animal.imageName)}
            fallback={animal.animal.charAt(0)}
            className={styles.avatar}
            badgeClassName={styles.levelBadge}
            badgeText={`Level ${formatProgressValue(level)}`}
          />
        ) : <Text color="gray">Level unavailable</Text>}
      </Box>

      <Box className={styles.identity}>
        <Text size="3" weight="bold" color="gray">Current level</Text>
        <Heading className={styles.animalName}>{animal?.animal ?? 'Keep growing'}</Heading>
        <Text as="p" size="3" className={styles.motto}>Stronger every day!</Text>
      </Box>

      <Flex className={styles.overall} direction="column" align="center" justify="center" gap="3">
        <Flex align="center" gap="2">
          <Text className={styles.overallLabel}>LEVEL</Text>
          <Tooltip content="Calculated from skill levels">
            <IconButton type="button" size="1" variant="ghost" color="gray" aria-label="How level is calculated">
              <Info size={16} aria-hidden="true" />
            </IconButton>
          </Tooltip>
        </Flex>
        <Heading className={styles.overallValue}>{displayLevel}</Heading>
      </Flex>
    </section>
  );
}
