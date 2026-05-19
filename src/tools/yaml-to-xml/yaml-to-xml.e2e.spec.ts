import { test, expect } from '@playwright/test';

test.describe('Tool - Yaml to xml', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/yaml-to-xml');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Yaml to xml - IT Tools');
  });

  test('', async ({ page }) => {

  });
});