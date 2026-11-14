"use client";

import { Dumbbell, X } from "lucide-react";
import { useState } from "react";
import { Text } from "@radix-ui/themes";
import DefaultButton from "@/app/components/DefaultButton/DefaultButton";
import DefaultHeading from "@/app/components/DefaultHeading/DefaultHeading";
import styles from "./profile.module.css";
import type { ProfileDto } from "@/api/models/profileDto";
import TrainerSearchDialog from "@/app/profile/TrainerSearchDialog";
import ConfirmationDialog from "@/app/components/ConfirmationDialog/ConfirmationDialog";
import { postApiAthleteDisconnectTrainer } from "@/api/generated";

type ProfileTrainerConnectionCardProps = {
  data: ProfileDto;
  loading: boolean;
  onDisconnected?: () => void;
};

export default function ProfileTrainerConnectionCard({ data, loading, onDisconnected }: ProfileTrainerConnectionCardProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [disconnectError, setDisconnectError] = useState("");

  const handleConfirmOpenChange = (open: boolean) => {
    if (isDisconnecting) return;
    setConfirmOpen(open);
    setDisconnectError("");
  };

  const handleDisconnect = async () => {
    if (isDisconnecting) return;
    setIsDisconnecting(true);
    setDisconnectError("");

    try {
      const response = await postApiAthleteDisconnectTrainer();
      if (response.status !== 200) {
        throw new Error(response.data.detail ?? response.data.title ?? "Failed to disconnect from your trainer.");
      }

      setConfirmOpen(false);
      onDisconnected?.();
    } catch (error) {
      setDisconnectError(error instanceof Error ? error.message : "Failed to disconnect from your trainer.");
    } finally {
      setIsDisconnecting(false);
    }
  };

  return (
    <section className="card" style={{ marginBottom: "1.25rem" }} aria-labelledby="trainer-heading">
      {data.trainerId ? (
        <>
          <DefaultHeading size="7" style={{ marginBottom: "0.9rem" }}>
            My Trainer
          </DefaultHeading>
          <div className={styles.trainerHeader}>
            <div className="avatar">
              {data.trainerName ? ((data.trainerName?.charAt(0) || "-").toUpperCase()) : <Dumbbell size={32} />}
            </div>
            <div>
              <DefaultHeading size="6" style={{ lineHeight: 1 }}>
                {data.trainerName || "No trainer connected"}
              </DefaultHeading>
              <p className={styles.trainerMeta}>{data.specialization || "No specialization"}</p>
            </div>
          </div>

          <p className={styles.trainerDescription}>{data.introduction || "No introduction available yet."}</p>

          <DefaultButton
            type="button"
            color="red"
            variant="surface"
            icon={<X />}
            fullWidth
            disabled={loading || isDisconnecting}
            isLoading={isDisconnecting}
            onClick={() => handleConfirmOpenChange(true)}
          >
            Disconnect
          </DefaultButton>

          <ConfirmationDialog
            open={confirmOpen}
            onOpenChange={handleConfirmOpenChange}
            title="Disconnect trainer?"
            description={
              <>
                Are you sure you want to disconnect from your trainer?
                {disconnectError && (
                  <Text as="span" size="2" color="red" role="alert" style={{ display: "block", marginTop: "0.5rem" }}>
                    {disconnectError}
                  </Text>
                )}
              </>
            }
            confirmLabel="Disconnect"
            cancelLabel="Cancel"
            variant="danger"
            onConfirm={() => void handleDisconnect()}
            isConfirmLoading={isDisconnecting}
            disableClose={isDisconnecting}
          />
        </>
      ) : (
        <div className={styles.noTrainer}>
          <DefaultHeading size="7" style={{ marginBottom: "0.9rem" }}>
            Find Your Trainer
          </DefaultHeading>
          <p className={styles.noTrainerText}>Connect with a trainer for workout plans and advices</p>
          <TrainerSearchDialog disabled={loading} />
        </div>
      )}
    </section>
  );
}
