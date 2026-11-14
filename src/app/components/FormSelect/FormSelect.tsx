"use client";

import * as Form from "@radix-ui/react-form";
import { ChevronDown } from "lucide-react";
import styles from "./FormSelect.module.css";

type FormSelectOption = {
  value: string;
  label: string;
};

interface FormSelectProps {
  name: string;
  label?: string;
  options: FormSelectOption[];
  value: string;
  required?: boolean;
  onChange: (value: string) => void;
}

export default function FormSelect({
  name,
  label,
  options,
  required = true,
  value,
  onChange,
}: FormSelectProps) {
  return (
    <Form.Field className={styles.field} name={name}>
      {label ? (
        <div className={styles.fieldHeaderRow}>
          <Form.Label className={styles.blockLabel}>
            {label}
            {required ? <span className={styles.requiredIndicator}>*</span> : null}
          </Form.Label>
        </div>
      ) : null}

      <div className={styles.selectWrapper}>
        <select
          className={styles.select}
          name={name}
          required={required}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        >
          {required ? <option value="" disabled>Select an option</option> : null}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown size={18} className={styles.icon} aria-hidden="true" />
      </div>
    </Form.Field>
  );
}
