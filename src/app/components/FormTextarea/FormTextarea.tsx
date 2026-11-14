"use client";

import * as Form from "@radix-ui/react-form";
import type { TextareaHTMLAttributes } from "react";
import styles from "../FormInput/FormInput.module.css";

type ValidationMatch = "valueMissing" | "tooShort" | "patternMismatch";

interface FormTextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "name"> {
  name: string;
  label: string;
  errorMessage?: string;
  validationMatch?: ValidationMatch;
}

export default function FormTextarea({
  name,
  label,
  errorMessage = "Required field",
  validationMatch = "valueMissing",
  required = true,
  rows = 4,
  className,
  ...textareaProps
}: FormTextareaProps) {
  return (
    <Form.Field className={styles.field} name={name}>
      <div className={styles.fieldHeaderRow}>
        <Form.Label className={styles.blockLabel}>{label}</Form.Label>
        <Form.Message className={styles.message} match={validationMatch}>
          {errorMessage}
        </Form.Message>
      </div>
      <Form.Control asChild>
        <textarea
          className={className ? `${styles.input} ${className}` : styles.input}
          name={name}
          required={required}
          rows={rows}
          style={{ resize: "vertical", maxHeight: "250px", minHeight: "6rem", fontFamily: "inherit" }}
          {...textareaProps}
        />
      </Form.Control>
    </Form.Field>
  );
}
