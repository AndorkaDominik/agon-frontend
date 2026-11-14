import type { FormEvent } from "react";
import * as Form from "@radix-ui/react-form";
import { Avatar, Box, Flex, Heading, Text } from "@radix-ui/themes";
import type { TrainerSearchDto } from "@/api/models";
import DefaultButton from "@/app/components/DefaultButton/DefaultButton";
import FormTextarea from "@/app/components/FormTextarea/FormTextarea";
import styles from "./TrainerSearchDialog.module.css";

type TrainerRequestFormProps = {
  trainer: TrainerSearchDto;
  message: string;
  isSending: boolean;
  error: string;
  onMessageChange: (message: string) => void;
  onBack: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export default function TrainerRequestForm({
  trainer,
  message,
  isSending,
  error,
  onMessageChange,
  onBack,
  onSubmit,
}: TrainerRequestFormProps) {
  const name = trainer.name?.trim() || "Unknown Trainer";

  return (
    <div className={styles.requestContent}>
      <div className={`card ${styles.trainerDetails}`}>
        <Flex align="center" gap="3" mb="3">
          <Avatar fallback={name.charAt(0).toUpperCase()} radius="full" size="4" />
          <Box>
            <Heading size="7" className={styles.detailsName}>{name}</Heading>
            <Text as="p" size="4">{trainer.specialization?.trim() || "General Coach"}</Text>
          </Box>
        </Flex>
        <Text as="p" size="4" className={styles.introduction}>
          {trainer.introduction?.trim() || "No introduction available yet."}
        </Text>
      </div>

      <Form.Root onSubmit={onSubmit}>
        <FormTextarea
          name="message"
          label="MESSAGE"
          value={message}
          onChange={(event) => onMessageChange(event.target.value)}
          rows={5}
          placeholder="Introduce yourself and your fitness goals..."
          className={styles.messageField}
          required
        />

        <div className={styles.formActions}>
          <DefaultButton type="button" variant="outline" fullWidth disabled={isSending} onClick={onBack}>
            Back
          </DefaultButton>
          <DefaultButton type="submit" variant="solid" fullWidth disabled={isSending}>
            {isSending ? "Sending..." : "Send Request"}
          </DefaultButton>
        </div>
      </Form.Root>

      {error && (
        <Text as="p" size="2" color="red" role="alert" className={styles.requestError}>
          {error}
        </Text>
      )}
    </div>
  );
}
