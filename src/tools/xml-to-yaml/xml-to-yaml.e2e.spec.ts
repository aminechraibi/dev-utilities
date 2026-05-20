import { expect, test } from '@playwright/test';

test.describe('Tool - Xml to yaml', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/xml-to-yaml');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Xml to yaml - IT Tools');
  });

  test('', async ({ page }) => {

  });
});
