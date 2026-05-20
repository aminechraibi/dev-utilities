import { expect, test } from '@playwright/test';

test.describe('Tool - Numbering bubbles', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/numbering-bubbles');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Numbering bubbles - IT Tools');
  });

  test('', async ({ page }) => {

  });
});
