"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import * as Form from "@radix-ui/react-form";
import * as RadioGroup from "@radix-ui/react-radio-group";
import styles from "./register.module.css";
import { BicepsFlexed, Dumbbell } from "lucide-react";
import DefaultButton from "@/app/components/DefaultButton/DefaultButton";
import FormInput from "@/app/components/FormInput/FormInput";
import FormTextarea from "@/app/components/FormTextarea/FormTextarea";
import AuthHeader from "@/app/components/AuthHeader/AuthHeader";
import { useUser } from "@/app/context/UserContext";
import type { UserType } from "@/app/types/UserType";
import { postApiAuthRegister } from "@/api/generated";
import { useRouteProtection } from "@/app/lib/useRouteProtection";

export default function RegisterPage() {
  useRouteProtection();
  const router = useRouter();
  const { refreshUser } = useUser();
  const [userType, setUserType] = useState<UserType>('Athlete');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    const requestBody = {
      userName: formData.get('userName') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      passwordConfirm: formData.get('passwordConfirm') as string,
      userType: userType,
      ...(userType === 'Trainer' && {
        specialization: formData.get('specialization') as string,
        introduction: formData.get('description') as string
      })
    };

    console.log('Submitting registration with data:', requestBody);

    try {
      const response = await postApiAuthRegister(requestBody);

      if (response.status !== 201) {
        const errorData = response.data;
        throw new Error(
          'detail' in errorData && errorData.detail
            ? errorData.detail
            : 'Registration failed'
        );
      }

      const data = response.data;

      await refreshUser();

      if (data.userType === 'Athlete') {
        router.push('/athlete/dashboard');
      } else if (data.userType === 'Trainer') {
        router.push('/trainer/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="authContainer">
      <div className="formWrapper">
        <AuthHeader />

        <RadioGroup.Root
          className={styles.userTypeGrid}
          value={userType}
          onValueChange={(value) => setUserType(value as UserType)}
        >
          <div className={styles.userTypeOption}>
            <RadioGroup.Item value="Athlete" className={styles.radioItem} id="athlete">
              <div className={styles.radioContent}>
                <div className={styles.icon}>
                  <BicepsFlexed size={32} />
                </div>
                <h3 className={styles.optionTitle}>ATHLETE</h3>
                <p className={styles.optionDescription}>Track workouts</p>
              </div>
            </RadioGroup.Item>
          </div>

          <div className={styles.userTypeOption}>
            <RadioGroup.Item value="Trainer" className={styles.radioItem} id="trainer">
              <div className={styles.radioContent}>
                <div className={styles.icon}>
                  <Dumbbell size={32} />
                </div>
                <h3 className={styles.optionTitle}>TRAINER</h3>
                <p className={styles.optionDescription}>Give advice</p>
              </div>
            </RadioGroup.Item>
          </div>
        </RadioGroup.Root>

        {/* Registration Form */}
        <Form.Root onSubmit={handleSubmit} className={styles.form}>
          {error && (
            <div className={styles.errorMessage}>{error}</div>
          )}

          <FormInput
            name="userName"
            label="Name"
            type="text"
            placeholder="Your name"
          />

          <FormInput
            name="email"
            label="Email"
            type="email"
            placeholder="your@email.com"
            errorMessage="Invalid email format"
            validationMatch="typeMismatch"
          />

          {/* Trainer Extra Fields */}
          {userType === 'Trainer' && (
            <>
              <FormInput
                name="specialization"
                label="Specialization"
                type="text"
                placeholder="e.g., Strength Training, Yoga..."
              />

              <FormTextarea
                name="description"
                label="Introduction"
                placeholder="Write something about yourself, specialization, or awards..."
              />
            </>
          )}

          <FormInput
            name="password"
            label="Password"
            type="password"
            placeholder="Password"
          />

          <FormInput
            name="passwordConfirm"
            label="Password again"
            type="password"
            placeholder="Password again"
          />

          <DefaultButton
            type="submit"
            variant="solid"
            isLoading={loading}
            loadingText="Creating Account..."
          >
            Create Account
          </DefaultButton>
        </Form.Root>

        <p className={styles.footer}>
          Already have an account?{' '}
          <a href="/login" className={styles.link}>Sign in</a>
        </p>
      </div>
    </div>
  );
}
