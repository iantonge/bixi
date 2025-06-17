const { test, expect } = require('@playwright/test');

test.describe('bixi form disabling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/forms');
  });

  test('disables form inputs during in flight request', async ({ page }) => {
    await page.route('**/forms/get-form*', async route => {
      await new Promise(r => setTimeout(r, 500));
      await route.continue();
    });

    await page.click('#external-get');

    await expect(page.locator('#get-form input[name="some-field"]')).toBeDisabled();
    await expect(page.locator('#get-form button:has-text("Plain submit")')).toBeDisabled();
    await expect(page.locator('#external-get')).toBeDisabled();

    await page.waitForSelector('p:has-text("Updated child content.")');
    await expect(page.locator('#external-get')).not.toBeDisabled();
  });
});