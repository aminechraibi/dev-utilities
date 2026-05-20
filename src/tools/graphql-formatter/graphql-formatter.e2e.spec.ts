import { expect, test } from '@playwright/test';

test.describe('Tool - Graphql formatter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/graphql-formatter');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Graphql formatter - IT Tools');
  });

  test('', async ({ page }) => {

  });
});
