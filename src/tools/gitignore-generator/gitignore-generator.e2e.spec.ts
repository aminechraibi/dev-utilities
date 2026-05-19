import { test, expect } from '@playwright/test';

test.describe('Tool - Gitignore generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/gitignore-generator');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Gitignore generator - IT Tools');
  });

  test('', async ({ page }) => {

  });
});