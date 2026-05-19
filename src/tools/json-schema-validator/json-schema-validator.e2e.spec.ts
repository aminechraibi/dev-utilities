import { test, expect } from '@playwright/test';

test.describe('Tool - Json schema validator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/json-schema-validator');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Json schema validator - IT Tools');
  });

  test('', async ({ page }) => {

  });
});