"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Box, Dialog, Flex, IconButton } from "@radix-ui/themes";
import { Search, X } from "lucide-react";
import DefaultButton from "@/app/components/DefaultButton/DefaultButton";
import { getApiTrainerPaginated, postApiAthleteRequestCoaching } from "@/api/generated";
import type { CoachingRequestDto, TrainerSearchDto } from "@/api/models";
import TrainerSearchResults from "@/app/profile/TrainerSearchResults";
import TrainerRequestForm from "@/app/profile/TrainerRequestForm";
import styles from "./TrainerSearchDialog.module.css";

type TrainerSearchDialogProps = {
  disabled?: boolean;
};

export default function TrainerSearchDialog({ disabled = false }: TrainerSearchDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [trainers, setTrainers] = useState<TrainerSearchDto[]>([]);
  const [isLoadingTrainers, setIsLoadingTrainers] = useState(false);
  const [isSendingRequest, setIsSendingRequest] = useState(false);
  const [listError, setListError] = useState("");
  const [requestError, setRequestError] = useState("");
  const [selectedTrainer, setSelectedTrainer] = useState<TrainerSearchDto | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!isOpen || selectedTrainer) {
      return;
    }

    const normalizedQuery = query.trim();
    let cancelled = false;

    const fetchTrainers = async () => {
      try {
        setIsLoadingTrainers(true);
        setListError("");

        const response = await getApiTrainerPaginated({
          limit: 20,
          offset: 0,
          search: normalizedQuery || undefined,
        });

        if (response.status !== 200) {
          throw new Error(response.data.detail ?? response.data.title ?? "Failed to load trainers.");
        }

        if (cancelled) return;

        setTrainers(response.data.trainers ?? []);
      } catch (err) {
        if (cancelled) return;

        setTrainers([]);
        setListError(err instanceof Error ? err.message : "Failed to load trainers.");
      } finally {
        if (!cancelled) {
          setIsLoadingTrainers(false);
        }
      }
    };

    const timer = window.setTimeout(() => void fetchTrainers(), 300);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [isOpen, query, selectedTrainer]);

  const resetDialog = () => {
    setQuery("");
    setTrainers([]);
    setListError("");
    setRequestError("");
    setSelectedTrainer(null);
    setMessage("");
    setIsLoadingTrainers(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (isSendingRequest) return;
    setIsOpen(open);
    if (!open) resetDialog();
  };

  const handleSelectTrainer = (trainer: TrainerSearchDto) => {
    setSelectedTrainer(trainer);
    setRequestError("");
  };

  const handleBack = () => {
    setSelectedTrainer(null);
    setRequestError("");
  };

  const handleSendRequest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (typeof selectedTrainer?.id !== "number" || isSendingRequest) {
      return;
    }
    setIsSendingRequest(true);
    setRequestError("");

    try {
      const coachingRequest: CoachingRequestDto = {
        trainerId: selectedTrainer.id,
        message: message.trim() || null,
      };

      const response = await postApiAthleteRequestCoaching(coachingRequest);

      if (response.status === 201) {
        setIsOpen(false);
        resetDialog();
        return;
      }

      setRequestError(response.data.detail ?? response.data.title ?? "Failed to send request.");
    } catch (err) {
      setRequestError(err instanceof Error ? err.message : "Failed to send request.");
    } finally {
      setIsSendingRequest(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Trigger>
        <DefaultButton
          type="button"
          variant="surface"
          fullWidth={false}
          icon={<Search />}
          disabled={disabled}
        >
          Find a Trainer
        </DefaultButton>
      </Dialog.Trigger>

      <Dialog.Content className={styles.dialogContent}>
        <Flex align="center" justify="between" mb="4">
          <Box>
            <Dialog.Title>
              {selectedTrainer
                ? `CONNECT WITH ${(selectedTrainer.name?.trim() || "Unknown Trainer").toUpperCase()}`
                : "Search Trainer"}
            </Dialog.Title>

            <Dialog.Description className={styles.description}>
              {selectedTrainer
                ? "View trainer details and send a coaching request."
                : "Search for trainers by name and select one to view details or send a request."}
            </Dialog.Description>
          </Box>

          <Dialog.Close>
            <IconButton variant="ghost" color="gray" aria-label="Close trainer search" disabled={isSendingRequest}>
              <X size={20} />
            </IconButton>
          </Dialog.Close>
        </Flex>

        {selectedTrainer ? (
          <TrainerRequestForm
            trainer={selectedTrainer}
            message={message}
            isSending={isSendingRequest}
            error={requestError}
            onMessageChange={setMessage}
            onBack={handleBack}
            onSubmit={handleSendRequest}
          />
        ) : (
          <TrainerSearchResults
            query={query}
            trainers={trainers}
            loading={isLoadingTrainers}
            error={listError}
            onQueryChange={setQuery}
            onSelectTrainer={handleSelectTrainer}
          />
        )}
      </Dialog.Content>
    </Dialog.Root>
  );
}
