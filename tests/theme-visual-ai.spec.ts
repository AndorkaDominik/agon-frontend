import { test, expect, type Page } from '@playwright/test';
import { screenshotPage } from './helpers/visual';

const athleteEmail = 'regathlete@gmail.com';
const athletePassword = 'Asd123';

async function waitForPageReady(page: Page) {
  await page.waitForLoadState('domcontentloaded');
  await expect(page.locator('body')).toBeVisible();
}

async function capture(page: Page, name: string) {
  await waitForPageReady(page);
  await screenshotPage(page, name);
}

test.describe('Athlete theme visual regression', () => {
  test('pink and green themes persist across athlete pages', async ({ page }) => {
    await page.goto('/login');
    await waitForPageReady(page);

    await page.getByLabel('Email').fill(athleteEmail);
    await page.getByLabel('Password').fill(athletePassword);
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL(/\/athlete\/dashboard\/?$/);
    await expect(page.getByRole('heading', { name: 'Athlete Dashboard' })).toBeVisible();
    await capture(page, 'athlete-dashboard-default.png');
    await expect(page.getByText('Current level')).toBeVisible();

    await page.goto('/profile');
    await waitForPageReady(page);
    await expect(page.getByRole('region', { name: 'Appearance' })).toBeVisible();
    await page.getByLabel('Pink').check();
    await expect(page.getByLabel('Pink')).toBeChecked();
    await expect(page.getByRole('status')).toContainText('Theme saved.');
    await capture(page, 'athlete-profile-pink.png');

    await page.reload();
    await waitForPageReady(page);
    await expect(page.getByLabel('Pink')).toBeChecked();
    await capture(page, 'athlete-profile-pink-reloaded.png');

    await page.goto('/athlete/dashboard');
    await expect(page.getByRole('heading', { name: 'Athlete Dashboard' })).toBeVisible();
    await expect(page.getByText('Current level')).toBeVisible();
    await capture(page, 'athlete-dashboard-pink.png');

    await page.goto('/athlete/new-workout');
    await expect(page.getByRole('heading', { name: 'New Workout' })).toBeVisible();
    await expect(page.getByText('Workout name')).toBeVisible();
    await expect(page.getByText('Notes (optional)')).toBeVisible();
    await capture(page, 'athlete-new-workout-pink.png');

    await page.goto('/athlete/plans');
    await expect(page.getByRole('heading', { name: 'Workout Plans' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'No workout plans' })).toBeVisible();
    await capture(page, 'athlete-plans-pink.png');

    await page.goto('/profile');
    await waitForPageReady(page);
    await page.getByLabel('Green').check();
    await expect(page.getByLabel('Green')).toBeChecked();
    await expect(page.getByRole('status')).toContainText('Theme saved.');
    await page.reload();
    await waitForPageReady(page);
    await expect(page.getByLabel('Green')).toBeChecked();
    await capture(page, 'athlete-profile-green-reloaded.png');

    await page.goto('/athlete/dashboard');
    await expect(page.getByRole('heading', { name: 'Athlete Dashboard' })).toBeVisible();
    await expect(page.getByText('Current level')).toBeVisible();
    await capture(page, 'athlete-dashboard-green.png');

    await page.goto('/athlete/new-workout');
    await expect(page.getByRole('heading', { name: 'New Workout' })).toBeVisible();
    await expect(page.getByText('Workout name')).toBeVisible();
    await expect(page.getByText('Notes (optional)')).toBeVisible();
    await capture(page, 'athlete-new-workout-green.png');

    await page.goto('/athlete/plans');
    await expect(page.getByRole('heading', { name: 'Workout Plans' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'No workout plans' })).toBeVisible();
    await capture(page, 'athlete-plans-green.png');
  });
});
