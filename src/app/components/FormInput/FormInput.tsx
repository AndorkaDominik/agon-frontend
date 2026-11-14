"use client";

import * as Form from "@radix-ui/react-form";
import type { InputHTMLAttributes } from "react";
import styles from "./FormInput.module.css";

type ValidationMatch = "valueMissing" | "typeMismatch" | "tooShort" | "patternMismatch";

interface FormInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "name"> {
  name: string;
  label: string;
  type?: "text" | "email" | "password" | "tel" | "url" | "date" | "number";
  errorMessage?: string;
  validationMatch?: ValidationMatch;
}

export default function FormInput({
  name,
  label,
  type = "text",
  errorMessage = "Required field",
  validationMatch = "valueMissing",
  required = true,
  className,
  ...inputProps
}: FormInputProps) {
  return (
    <Form.Field className={styles.field} name={name}>
      <div className={styles.fieldHeaderRow}>
        <Form.Label className={styles.blockLabel}>{label}{required ? <span className={styles.requiredIndicator}>*</span>: null}</Form.Label>
        <Form.Message className={styles.message} match={validationMatch}>
          {errorMessage}
        </Form.Message>
      </div>
      <Form.Control asChild>
        <input
          className={className ? `${styles.input} ${className}` : styles.input}
          type={type}
          name={name}
          required={required}
          {...inputProps}
        />
      </Form.Control>
    </Form.Field>
  );
}
