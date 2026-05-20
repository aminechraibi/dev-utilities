import { expect, test } from '@playwright/test';

test.describe('Tool - Cron expression parser', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/cron-expression-parser');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Cron expression parser - IT Tools');
  });

  test('', async ({ page }) => {

  });
});
