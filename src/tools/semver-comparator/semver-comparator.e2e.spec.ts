import { test, expect } from '@playwright/test';

test.describe('Tool - Semver comparator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/semver-comparator');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Semver comparator - IT Tools');
  });

  test('', async ({ page }) => {

  });
});