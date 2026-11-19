import { expect, type Page } from '@playwright/test';
import path from 'node:path';

export const THEMES = [
  { color: 'pink', label: 'Pink' },
  { color: 'grass', label: 'Green' },
];

export async function screenshotPage(page: Page, name: string) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      Array.from(document.images)
        .filter((image) => !image.complete)
        .map((image) => image.decode().catch(() => undefined)),
    );
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    });
  });

  await expect(page).toHaveScreenshot(name, {
    fullPage: true,
    maxDiffPixelRatio: 0.02,
    animations: 'disabled',
    stylePath: path.join(__dirname, '..', 'theme-visual.css'),
  });
}

export async function loginAndSetTheme(
  page: Page,
  email: string,
  password: string,
  themeColor: 'grass' | 'pink',
) {
  await page.goto('/login');
  await expect(page.locator('body')).toBeVisible();
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);

  const loginResponse = page.waitForResponse(
    (response) =>
      response.url().includes('/api/Auth/login') &&
      response.request().method() === 'POST',
  );
  await page.getByRole('button', { name: 'Login' }).click();
  expect((await loginResponse).ok()).toBeTruthy();
  await expect(page).toHaveURL(/\/athlete\/dashboard\/?$/);

  await page.goto('/profile');
  await expect(page.getByRole('region', { name: 'Appearance' })).toBeVisible();

  const label = themeColor === 'grass' ? 'Green' : 'Pink';
  if (!(await page.getByLabel(label).isChecked())) {
    const themeResponse = page.waitForResponse(
      (response) =>
        response.url().includes('/api/Athlete/theme') &&
        response.request().method() === 'PATCH',
    );
    await page.getByLabel(label).check();
    expect((await themeResponse).ok()).toBeTruthy();
    await expect(page.getByRole('status')).toContainText('Theme saved.');
  }

  await page.reload();
  await expect(page.getByLabel(label)).toBeChecked();
}