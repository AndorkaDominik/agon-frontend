"use client";

import { useEffect, useState, type FormEvent } from "react";
import Navbar from "@/app/components/Navbar/Navbar";
import DefaultHeading from "@/app/components/DefaultHeading/DefaultHeading";
import { useRouteProtection } from "@/app/lib/useRouteProtection";
import { toInputDateValue, getTodayInputDate } from "@/app/lib/dateUtils";
import type { EditableProfileData } from "@/app/types/EditableProfileData";
import { useUser } from "@/app/context/UserContext";
import type { ProfileDto } from "@/api/models/profileDto";
import { getApiUserProfile, putApiUserProfile } from "@/api/generated";
import ProfilePersonalInfoSection from "@/app/profile/ProfilePersonalInfoSection";
import ProfileTrainerConnectionCard from "@/app/profile/ProfileTrainerConnectionCard";
import ProfileThemeSection from "@/app/profile/ProfileThemeSection";

export default function Profile() {
  useRouteProtection(["Athlete", "Trainer"]);
  const { user, refreshUser } = useUser();

  const [data, setData] = useState<ProfileDto | null>(null);
  const [formData, setFormData] = useState<EditableProfileData | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [savingProfile, setSavingProfile] = useState<boolean>(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getApiUserProfile();

      if (response.status !== 200) {
        throw new Error("Unable to load your profile.");
      }

      const result = response.data;
      setData(result);

      setFormData({
        userName: result.userName ?? "",
        email: result.email ?? "",
        height: result.height?.toString() ?? "",
        weight: result.weight?.toString() ?? "",
        birthDate: toInputDateValue(result.birthDate ?? null),
        specialization: result.specialization ?? "",
        introduction: result.introduction ?? "",
      });
    } catch (err) {
      setData(null);
      setFormData(null);
      setError(err instanceof Error ? err.message : "Unable to load your profile.");
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  useEffect(() => {
    void fetchProfile();
  }, []);

  const handleInputChange = (field: keyof EditableProfileData, value: string) => {
    setFormData((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        [field]: value,
      };
    });
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!data || !formData) {
      return;
    }

    try {
      setSavingProfile(true);
      setError("");

      const payload: ProfileDto = {
        id: data.id,
        userId: data.userId ?? null,
        userName: formData.userName,
        email: formData.email,
        height: formData.height ? Number(formData.height) : null,
        weight: formData.weight ? Number(formData.weight) : null,
        birthDate: formData.birthDate ? formData.birthDate : null,
        progress: data.progress,
        trainerId: data.trainerId ?? null,
        trainerName: data.trainerName ?? null,
        specialization: formData.specialization ?? null,
        introduction: formData.introduction ?? null,
      };

      const response = await putApiUserProfile(payload);


      if (response.status !== 200) {
        throw new Error("Unable to save your profile.");
      }
      setData(response.data);
      refreshUser();
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save your profile.");
    } finally {
      setTimeout(() => {
        setSavingProfile(false);
      }, 1000);
    }
  };

  return (
    <div className="layout-page">
      <Navbar />
      {loading && !data ? (
        <p className="status-message" role="status">Loading your profile...</p>
      ) : error ? (
        <p className="error-message" role="alert">{error}</p>
      ) : (data && formData && user?.userType === "Athlete") ? (
        <main className="layout-content">
          <DefaultHeading style={{ marginBottom: "1.25rem" }}>
            Profile
          </DefaultHeading>

          <ProfilePersonalInfoSection
            mode="Athlete"
            formData={formData}
            savingProfile={savingProfile}
            maxBirthDate={getTodayInputDate()}
            sectionStyle={{ marginBottom: "1.25rem" }}
            onSubmit={handleSave}
            onInputChange={handleInputChange}
          />

          <ProfileTrainerConnectionCard data={data} loading={loading} onDisconnected={() => void fetchProfile()} />
          <ProfileThemeSection initialColor={user.themeColor ?? data.themeColor ?? "grass"} />
        </main>
      ) : (data && formData && user?.userType === "Trainer") ? (
        <main className="layout-content">
          <DefaultHeading style={{ marginBottom: "1.25rem" }}>
            Profile
          </DefaultHeading>

          <ProfilePersonalInfoSection
            mode="Trainer"
            formData={formData}
            savingProfile={savingProfile}
            maxBirthDate={getTodayInputDate()}
            onSubmit={handleSave}
            onInputChange={handleInputChange}
          />
        </main>
      ) : (
        <p className="status-message" role="status">No profile data available.</p>
      )}
    </div>
  );
}
