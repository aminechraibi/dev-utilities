import { expect, test } from '@playwright/test';

test.describe('Tool - Uuid inspector', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/uuid-inspector');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Uuid inspector - IT Tools');
  });

  test('', async ({ page }) => {

  });
});
