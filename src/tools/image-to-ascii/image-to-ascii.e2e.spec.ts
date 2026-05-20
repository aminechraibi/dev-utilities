import { expect, test } from '@playwright/test';

test.describe('Tool - Image to ascii', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/image-to-ascii');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Image to ascii - IT Tools');
  });

  test('', async ({ page }) => {

  });
});
