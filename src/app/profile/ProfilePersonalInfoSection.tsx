import * as Form from "@radix-ui/react-form";
import type { CSSProperties, FormEvent } from "react";
import { Save } from "lucide-react";
import DefaultButton from "@/app/components/DefaultButton/DefaultButton";
import DefaultHeading from "@/app/components/DefaultHeading/DefaultHeading";
import FormInput from "@/app/components/FormInput/FormInput";
import FormTextarea from "@/app/components/FormTextarea/FormTextarea";
import type { EditableProfileData } from "@/app/types/EditableProfileData";

type ProfilePersonalInfoSectionProps = {
  formData: EditableProfileData;
  mode: "Athlete" | "Trainer";
  savingProfile: boolean;
  maxBirthDate: string;
  sectionStyle?: CSSProperties;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onInputChange: (field: keyof EditableProfileData, value: string) => void;
};

export default function ProfilePersonalInfoSection({
  formData,
  mode,
  savingProfile,
  maxBirthDate,
  sectionStyle,
  onSubmit,
  onInputChange,
}: ProfilePersonalInfoSectionProps) {
  
  return (
    <section className="card" style={sectionStyle}>
      <DefaultHeading size="7" style={{ marginBottom: "0.9rem" }}>
        Personal Information
      </DefaultHeading>

      <Form.Root className="form-grid" onSubmit={onSubmit}>
        <FormInput
          name="userName"
          label="Name"
          value={formData.userName}
          onChange={(event) => onInputChange("userName", event.target.value)}
        />

        <FormInput
          name="email"
          label="Email"
          type="email"
          errorMessage="Invalid email"
          validationMatch="typeMismatch"
          value={formData.email}
          onChange={(event) => onInputChange("email", event.target.value)}
        />

        {mode === "Athlete" ? (
          <div className="row-three">
            <FormInput
              name="height"
              label="Height (cm)"
              type="number"
              required={false}
              value={formData.height}
              onChange={(event) => onInputChange("height", event.target.value)}
            />

            <FormInput
              name="weight"
              label="Weight (kg)"
              type="number"
              required={false}
              value={formData.weight}
              onChange={(event) => onInputChange("weight", event.target.value)}
            />

            <FormInput
              name="birthDate"
              label="Birth date (YYYY-MM-DD)"
              type="date"
              required={false}
              value={formData.birthDate}
              max={maxBirthDate}
              onChange={(event) => onInputChange("birthDate", event.target.value)}
            />
          </div>
        ) : null}

        {mode === "Trainer" ? (
          <>
            <FormInput
              name="specialization"
              label="Specialization"
              value={formData.specialization || ""}
              onChange={(event) => onInputChange("specialization", event.target.value)}
            />

            <FormTextarea
              name="introduction"
              label="Introduction"
              value={formData.introduction || ""}
              onChange={(event) => onInputChange("introduction", event.target.value)}
              required={false}
            />
          </>
        ) : null}

        <DefaultButton type="submit" variant="surface" icon={<Save />} fullWidth isLoading={savingProfile}>
          Save Changes
        </DefaultButton>
      </Form.Root>
    </section>
  );
}
