import { test, expect } from '@playwright/test';

test.describe('Tool - Fake data generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/fake-data-generator');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Fake data generator - IT Tools');
  });

  test('', async ({ page }) => {

  });
});