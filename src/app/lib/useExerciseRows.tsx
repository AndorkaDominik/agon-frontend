"use client";

import { useCallback, useState } from "react";
import type { ExerciseRow } from "@/app/types/ExerciseRow";

export function useExerciseRows(options?: { initialCount?: number; }) {
  const { initialCount = 1 } = options || {};

  const createRow = useCallback((id: number): ExerciseRow => ({
    id,
    type: "strength",
    exercise: "",
    weight: 0,
    reps: 0,
    duration: 0,
    distance: 0,
  }), []);

  const [rows, setRows] = useState<ExerciseRow[]>(() => {
    return Array.from({ length: initialCount }, (_, i) => createRow(i + 1));
  });

  const handleChange = (
    rowId: number,
    field: keyof Omit<ExerciseRow, "id">,
    value: string,
  ) => {
    setRows((current) => current.map((row) => (row.id === rowId ? { ...row, [field]: value } : row)));
  };

  const handleRemove = (rowId: number) => {
    setRows((current) => {
      if (current.length <= 1) return current;
      return current.filter((row) => row.id !== rowId);
    });
  };

  const handleAdd = () => {
    setRows((current) => {
      const nextId = current.length === 0 ? 1 : Math.max(...current.map((r) => r.id)) + 1;
      return [...current, createRow(nextId)];
    });
  };

  return { rows, setRows, createRow, handleChange, handleRemove, handleAdd };
}
