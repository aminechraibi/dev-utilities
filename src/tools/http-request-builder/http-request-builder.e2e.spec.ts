import { test, expect } from '@playwright/test';

test.describe('Tool - Http request builder', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/http-request-builder');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Http request builder - IT Tools');
  });

  test('', async ({ page }) => {

  });
});