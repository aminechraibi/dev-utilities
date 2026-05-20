import { expect, test } from '@playwright/test';

test.describe('Tool - Json path tester', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/json-path-tester');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Json path tester - IT Tools');
  });

  test('', async ({ page }) => {

  });
});
