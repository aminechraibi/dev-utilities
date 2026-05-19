import { test, expect } from '@playwright/test';

test.describe('Tool - Byte unit converter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/byte-unit-converter');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Byte unit converter - IT Tools');
  });

  test('', async ({ page }) => {

  });
});