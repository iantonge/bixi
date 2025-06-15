const { test, expect } = require('@playwright/test');

test.describe('bixi ajax requests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ajax');
  });

  test('throw when bx-target missing from response', async ({ page }) => {
    await page.click('#missing-pane-response-link');
    await page.waitForTimeout(100); // allow async error to propagate
    const errors = await page.evaluate(() => window.bixiErrors);
    expect(errors).toContain('Bixi error: No pane named main found in server response');
  });
});
