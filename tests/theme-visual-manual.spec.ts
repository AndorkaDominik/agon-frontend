import { test, expect } from '@playwright/test';

import { THEMES, screenshotPage } from './helpers/visual';

test('Theme visual manual written test', async ({ page }) => {

  const theme = page.locator('.radix-themes').first();
  const appearance = page.getByRole('region', { name: 'Appearance' });
  const levelBoard = page.getByRole('region', { name: 'Athlete level'});

  await page.goto('/login');
  await page.getByLabel('Email').fill('regathlete@gmail.com');
  await page.getByLabel('Password').fill('Asd123');
  await page.getByRole('button', { name: 'Login'}).click();
  await expect(page).toHaveURL(/\/athlete\/dashboard$/);

  for (const { color, label } of THEMES) {
    await test.step(`${label}: Profile and persisted theme`, async () => {
      await page.goto('/profile');
      await appearance.getByRole('radio', { name: label }).check();
      await expect(theme).toHaveAttribute('data-accent-color', color);
      await page.reload();
      await expect(appearance.getByRole('radio', { name: label })).toBeChecked();
      await expect(theme).toHaveAttribute('data-accent-color', color);
      await expect(page.getByRole('button', { name: 'Save Changes' })).toBeEnabled();
      await expect(page.getByRole('button', { name: 'Find a Trainer' })).toBeEnabled();
      await expect(appearance).toHaveScreenshot(`profile-theme-${color}.png`);
      await screenshotPage(page, `profile-page-${color}.png`);
    });

    await test.step(`${label}: Athlete level`, async () => {
      await page.goto('/athlete/dashboard');
      await expect(theme).toHaveAttribute('data-accent-color', color);
      await expect(levelBoard.locator('img')).toBeVisible();
      await expect(levelBoard).toHaveScreenshot(`athlete-level-${color}.png`);
    });

    await test.step(`${label}: New Workout`, async () => {
      await page.goto('/athlete/new-workout');
      await expect(theme).toHaveAttribute('data-accent-color', color);
      await expect(page.getByRole('heading', { name: 'New Workout' })).toBeVisible();
      await expect(page.getByRole('region', { name: 'Skill progress' })).toBeVisible();
      await expect(page.getByRole('region', { name: 'Exercises' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Complete Workout' })).toBeEnabled();
      await screenshotPage(page, `athlete-new-workout-page-${color}.png`);
    });

    await test.step(`${label}: Plans`, async () => {
      await page.goto('/athlete/plans');
      await expect(theme).toHaveAttribute('data-accent-color', color);
      await expect(page.getByRole('heading', { name: 'Workout Plans', exact: true })).toBeVisible();
      await expect(page.getByRole('heading', { name: "No workout plans", exact: true })).toBeVisible();
      await screenshotPage(page, `athlete-plans-page-${color}.png`);
    });
  }
});