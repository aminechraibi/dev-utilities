import { expect, test } from '@playwright/test';

test.describe('Tool - Image annotator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/image-annotator');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Image annotator - IT Tools');
  });

  test('', async ({ page }) => {

  });
});
