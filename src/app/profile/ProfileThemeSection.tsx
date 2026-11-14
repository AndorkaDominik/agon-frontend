"use client";

import { useState } from "react";
import { patchApiAthleteTheme } from "@/api/generated";
import type { UpdateThemeColorDto } from "@/api/models";
import { useUser } from "@/app/context/UserContext";
import DefaultHeading from "@/app/components/DefaultHeading/DefaultHeading";
import styles from "./ProfileThemeSection.module.css";

export default function ProfileThemeSection({ initialColor }: { initialColor: string }) {
  const { setThemeColor } = useUser();
  const [selectedColor, setSelectedColor] = useState(initialColor);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const saveTheme = async (themeColor: string) => {
    if (saving || themeColor === selectedColor) return;

    const previousColor = selectedColor;
    setSelectedColor(themeColor);
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const payload: UpdateThemeColorDto = { themeColor };
      const response = await patchApiAthleteTheme(payload);
      if (response.status !== 200) {
        throw new Error(response.data.detail || response.data.title || "Unable to save your theme. Please try again.");
      }

      const color = response.data.themeColor;
      setThemeColor(color);
      setSelectedColor(color);
      setSaved(true);
    } catch (err) {
      setSelectedColor(previousColor);
      setError(err instanceof Error ? err.message : "Unable to save your theme.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="card" style={{ marginBottom: "1.25rem" }} aria-label="Appearance">
      <DefaultHeading size="7" style={{ marginBottom: "0.9rem" }}>
        Appearance
      </DefaultHeading>
      <div className="form-grid">
        <fieldset disabled={saving} className={styles.fieldset}>
          <div className={styles.colors}>
            <input
              className={styles.swatch}
              style={{ backgroundColor: "var(--grass-9)" }}
              type="radio"
              name="themeColor"
              value="grass"
              aria-label="Green"
              title="Green"
              checked={selectedColor === "grass"}
              onChange={() => void saveTheme("grass")}
            />
            <input
              className={styles.swatch}
              style={{ backgroundColor: "var(--pink-9)" }}
              type="radio"
              name="themeColor"
              value="pink"
              aria-label="Pink"
              title="Pink"
              checked={selectedColor === "pink"}
              onChange={() => void saveTheme("pink")}
            />
          </div>
        </fieldset>
        {error ? <p role="alert" style={{ color: "var(--danger)" }}>{error}</p> : null}
        {saving || saved ? <p role="status">{saving ? "Saving theme..." : "Theme saved."}</p> : null}
      </div>
    </section>
  );
}
