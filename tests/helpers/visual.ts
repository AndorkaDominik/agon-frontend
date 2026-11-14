import { expect, type Page } from '@playwright/test';
import path from 'node:path';

export const THEMES = [
  { color: 'pink', label: 'Pink' },
  { color: 'grass', label: 'Green' },
];

export async function screenshotPage(page: Page, name: string) {
  await expect(page).toHaveScreenshot(name, {
    fullPage: true,
    maxDiffPixels: 20,
    stylePath: path.join(__dirname, '..', 'theme-visual.css'),
  });
}