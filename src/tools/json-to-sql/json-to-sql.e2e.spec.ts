import { test, expect } from '@playwright/test';

test.describe('Tool - Json to sql', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/json-to-sql');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Json to sql - IT Tools');
  });

  test('', async ({ page }) => {

  });
});