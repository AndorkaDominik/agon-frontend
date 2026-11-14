import { Avatar, Box, Flex, Text, TextField } from "@radix-ui/themes";
import { ChevronRight, Search } from "lucide-react";
import type { TrainerSearchDto } from "@/api/models";
import DefaultHeading from "@/app/components/DefaultHeading/DefaultHeading";
import styles from "./TrainerSearchDialog.module.css";

type TrainerSearchResultsProps = {
  query: string;
  trainers: TrainerSearchDto[];
  loading: boolean;
  error: string;
  onQueryChange: (query: string) => void;
  onSelectTrainer: (trainer: TrainerSearchDto) => void;
};

export default function TrainerSearchResults({
  query,
  trainers,
  loading,
  error,
  onQueryChange,
  onSelectTrainer,
}: TrainerSearchResultsProps) {
  let statusMessage = "";
  if (loading) {
    statusMessage = "Loading trainers...";
  } else if (error) {
    statusMessage = error;
  } else if (trainers.length === 0) {
    statusMessage = "No trainers found for this search.";
  }

  const hasStatusError = !loading && Boolean(error);
  const statusTextProps = hasStatusError
    ? { color: "red" as const, role: "alert" }
    : { className: styles.softText };

  return (
    <div className={styles.searchResults}>
      <TextField.Root
        size="3"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Search for a trainer's name..."
        aria-label="Search trainers"
      >
        <TextField.Slot>
          <Search size={16} />
        </TextField.Slot>
      </TextField.Root>

      <div className={styles.resultsList}>
        <Flex direction="column" gap="3">
          {statusMessage ? (
            <div className={styles.statusMessage}>
              <Text size="2" {...statusTextProps}>{statusMessage}</Text>
            </div>
          ) : (
            trainers.map((trainer, index) => {
              const name = trainer.name?.trim() || "Unknown Trainer";

              return (
                <button
                  key={trainer.id ?? `trainer-${index}`}
                  type="button"
                  onClick={() => onSelectTrainer(trainer)}
                  className={`card ${styles.trainerButton}`}
                >
                  <Flex align="center" justify="between" gap="3">
                    <Flex align="center" gap="3">
                      <Avatar
                        fallback={name.charAt(0).toUpperCase()}
                        radius="full"
                        className={styles.trainerAvatar}
                      />
                      <Box>
                        <DefaultHeading size="5" className={styles.trainerName}>{name}</DefaultHeading>
                        <Text as="p" size="3" className={styles.softText}>
                          {trainer.specialization?.trim() || "General Coach"}
                        </Text>
                        <Text as="p" size="3" className={`${styles.softText} ${styles.athleteCount}`}>
                          {trainer.athleteCount ?? 0} athletes
                        </Text>
                      </Box>
                    </Flex>
                    <ChevronRight size={22} className={styles.resultArrow} />
                  </Flex>
                </button>
              );
            })
          )}
        </Flex>
      </div>
    </div>
  );
}
