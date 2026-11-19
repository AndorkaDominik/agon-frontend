import { test, expect, type Page } from '@playwright/test';
import { loginAndSetTheme, screenshotPage } from './helpers/visual';

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

async function openDashboard(page: Page) {
  const progressResponse = page.waitForResponse(
    (response) =>
      response.url().includes('/api/WorkoutSession/dashboard-progress') &&
      response.request().method() === 'GET',
  );
  const activityResponse = page.waitForResponse(
    (response) =>
      response.url().includes('/api/WorkoutSession/activity-week') &&
      response.request().method() === 'GET',
  );

  await page.goto('/athlete/dashboard');
  const [progressResult, activityResult] = await Promise.all([
    progressResponse,
    activityResponse,
  ]);
  expect(progressResult.ok()).toBeTruthy();
  expect(activityResult.ok()).toBeTruthy();

  await expect(page.getByRole('heading', { name: 'Athlete Dashboard' })).toBeVisible();
  await expect(page.getByText(/Loading your progress/)).toBeHidden();
  await expect(page.getByRole('region', { name: 'Athlete level' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Skill progress' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Current week' })).toBeVisible();
}

async function openNewWorkout(page: Page) {
  await page.goto('/athlete/new-workout');
  await expect(page.getByRole('heading', { name: 'New Workout' })).toBeVisible();
  await expect(page.getByText(/Loading your progress/)).toBeHidden();
  await expect(page.getByLabel(/Workout name/).first()).toBeVisible();
  await expect(page.getByLabel(/Notes/).first()).toBeVisible();
}

async function openPlans(page: Page) {
  await page.goto('/athlete/plans');
  await expect(page.getByRole('heading', { name: 'Workout Plans' })).toBeVisible();
  await expect(page.getByText('Loading plans...')).toBeHidden();
  await expect(page.getByRole('heading', { name: 'No workout plans' })).toBeVisible();
}

test.describe('Athlete theme visual regression', () => {
  test.beforeEach(async ({ page }) => {
    await loginAndSetTheme(page, athleteEmail, athletePassword, 'grass');
  });

  test('pink and green themes persist across athlete pages', async ({ page }) => {
    await openDashboard(page);
    await capture(page, 'athlete-dashboard-default.png');
    await expect(page.getByText('Current level')).toBeVisible();

    await page.goto('/profile');
    await waitForPageReady(page);
    await expect(page.getByRole('region', { name: 'Appearance' })).toBeVisible();
    const pinkWasChecked = await page.getByLabel('Pink').isChecked();
    if (!pinkWasChecked) {
      const pinkThemeResponse = page.waitForResponse(
        (response) =>
          response.url().includes('/api/Athlete/theme') &&
          response.request().method() === 'PATCH',
      );
      await page.getByLabel('Pink').check();
      expect((await pinkThemeResponse).ok()).toBeTruthy();
      await expect(page.getByRole('status')).toContainText('Theme saved.');
    } else {
      await page.getByLabel('Pink').check();
    }
    await expect(page.getByLabel('Pink')).toBeChecked();
    await capture(page, 'athlete-profile-pink.png');

    await page.reload();
    await waitForPageReady(page);
    await expect(page.getByLabel('Pink')).toBeChecked();
    await capture(page, 'athlete-profile-pink-reloaded.png');

    await openDashboard(page);
    await expect(page.getByText('Current level')).toBeVisible();
    await capture(page, 'athlete-dashboard-pink.png');

    await openNewWorkout(page);
    await capture(page, 'athlete-new-workout-pink.png');

    await openPlans(page);
    await capture(page, 'athlete-plans-pink.png');

    await page.goto('/profile');
    await waitForPageReady(page);
    const greenThemeResponse = page.waitForResponse(
      (response) =>
        response.url().includes('/api/Athlete/theme') &&
        response.request().method() === 'PATCH',
    );
    await page.getByLabel('Green').check();
    expect((await greenThemeResponse).ok()).toBeTruthy();
    await expect(page.getByLabel('Green')).toBeChecked();
    await expect(page.getByRole('status')).toContainText('Theme saved.');
    await page.reload();
    await waitForPageReady(page);
    await expect(page.getByLabel('Green')).toBeChecked();
    await capture(page, 'athlete-profile-green-reloaded.png');

    await openDashboard(page);
    await expect(page.getByText('Current level')).toBeVisible();
    await capture(page, 'athlete-dashboard-green.png');

    await openNewWorkout(page);
    await capture(page, 'athlete-new-workout-green.png');

    await openPlans(page);
    await capture(page, 'athlete-plans-green.png');
  });
});
