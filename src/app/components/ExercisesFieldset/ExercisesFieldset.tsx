"use client";

import { Plus, Trash2 } from "lucide-react";
import FormInput from "@/app/components/FormInput/FormInput";
import FormSelect from "@/app/components/FormSelect/FormSelect";
import DefaultButton from "@/app/components/DefaultButton/DefaultButton";
import styles from "./ExercisesFieldset.module.css";
import type { ExerciseRow } from "@/app/types/ExerciseRow";

type ExerciseField = keyof Omit<ExerciseRow, "id">;

type ExercisesFieldsetProps = {
  rows: ExerciseRow[];
  onChange: (rowId: number, field: ExerciseField, value: string) => void;
  onRemove: (rowId: number) => void;
  onAdd: () => void;
};

export default function ExercisesFieldset({
  rows,
  onChange,
  onRemove,
  onAdd,
}: ExercisesFieldsetProps) {
  return (
    <section className={styles.wrapper} aria-label="Exercises">
      <p className={styles.sectionTitle}>Exercises</p>

      <div className={styles.list}>
        {rows.map((row, index) => (
          <div className={styles.row} key={row.id}>
            <div className={styles.inputsRow}>
              <FormSelect
                name={`exerciseType-${row.id}`}
                label="Exercise type"
                options={[
                  { value: "strength", label: "Strength" },
                  { value: "cardio", label: "Cardio" },
                  { value: "bodyweight", label: "Bodyweight" },
                ]}
                value={row.type}
                onChange={(value) => onChange(row.id, "type", value)}
              />

              <FormInput
                name={`exerciseName-${row.id}`}
                label="Exercise"
                placeholder="e.g.: Bench press"
                value={row.exercise}
                onChange={(event) => onChange(row.id, "exercise", event.target.value)}
              />

              {row.type === "cardio" && (
                <>
                  <FormInput
                    name={`exerciseDuration-${row.id}`}
                    label="Duration (min)"
                    type="number"
                    min={0}
                    required={false}
                    placeholder="0"
                    value={row.duration}
                    onChange={(event) => onChange(row.id, "duration", event.target.value)}
                  />
                  <FormInput
                    name={`exerciseDistance-${row.id}`}
                    label="Distance (km)"
                    type="number"
                    min={0}
                    required={false}
                    placeholder="0"
                    value={row.distance}
                    onChange={(event) => onChange(row.id, "distance", event.target.value)}
                  />
                </>
              ) }
              
              {row.type === "strength" && (
                <>
                  <FormInput
                    name={`exerciseWeight-${row.id}`}
                    label="Weight (kg)"
                    type="number"
                    min={0}
                    required={false}
                    placeholder="0"
                    value={row.weight}
                    onChange={(event) => onChange(row.id, "weight", event.target.value)}
                  />
                  <FormInput
                    name={`exerciseReps-${row.id}`}
                    label="Reps"
                    type="number"
                    min={0}
                    required={false}
                    placeholder="0"
                    value={row.reps}
                    onChange={(event) => onChange(row.id, "reps", event.target.value)}
                  />
                </>
              )}
              
              {row.type === "bodyweight" && (
                <>
                  <FormInput
                    name={`exerciseReps-${row.id}`}
                    label="Reps"
                    type="number"
                    min={0}
                    required={false}
                    placeholder="0"
                    value={row.reps}
                    onChange={(event) => onChange(row.id, "reps", event.target.value)}
                  />
                </>
              )}
            </div>

            <DefaultButton
              type="button"
              onClick={() => onRemove(row.id)}
              disabled={rows.length <= 1}
              aria-label={`Remove exercise row ${index + 1}`}
              title="Remove row"
              size="2"
              variant="surface"
              fullWidth={true}
              style={{ padding: "1.4rem"}}
            >
              <Trash2 size={16} />
            </DefaultButton>
          </div>
        ))}

        <DefaultButton
          type="button"
          onClick={onAdd}
          size="2"
          variant="surface"
          fullWidth={false}
          icon={<Plus size={16} />}
          style={{ width: "fit-content", minHeight: "2.5rem", paddingInline: "0.8rem" }}
        >
          Add exercise
        </DefaultButton>
      </div>
    </section>
  );
}
