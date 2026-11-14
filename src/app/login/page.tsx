"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import styles from "../register/register.module.css";
import AuthHeader from "@/app/components/AuthHeader/AuthHeader";
import * as Form from "@radix-ui/react-form";
import FormInput from "@/app/components/FormInput/FormInput";
import DefaultButton from "@/app/components/DefaultButton/DefaultButton";
import { useUser } from "@/app/context/UserContext";
import { postApiAuthLogin } from "@/api/generated";
import { useRouteProtection } from "@/app/lib/useRouteProtection";

export default function LoginPage() {
  useRouteProtection();
  const router = useRouter();
  const { refreshUser } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const loginRequestDto = { email, password };
      const loginResponse = await postApiAuthLogin(loginRequestDto);

      if (loginResponse.status !== 200) {
        const errorData = loginResponse.data;
        throw new Error(
          'detail' in errorData && errorData.detail
            ? errorData.detail
            : 'Login failed'
        );
      }

      const loginData = loginResponse.data;

      await refreshUser();

      if (loginData.userType === 'Athlete') {
        router.push('/athlete/dashboard');
      } else if (loginData.userType === 'Trainer') {
        router.push('/trainer/dashboard');
      } else {
        throw new Error('Unknown user type');
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
        <AuthHeader
          prefix='Welcome'
          subtitle='Sign in to continue your fitness journey'
        />

        <Form.Root onSubmit={handleLogin} className={styles.form}>
          {error && (
            <div className={styles.errorMessage} role="alert">{error}</div>
          )}

          <FormInput
            name="email"
            label="Email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <FormInput
            name="password"
            label="Password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <DefaultButton
            type="submit"
            isLoading={loading}
            loadingText="Logging in..."
            style={{
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            Login
          </DefaultButton>
        </Form.Root>
        <p className={styles.footer}>
          Don't have an account?{' '}
          <a href="/register" className={styles.link}>Create One</a>
        </p>
      </div>
    </div>
  );
}
