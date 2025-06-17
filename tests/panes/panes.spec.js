const { test, expect } = require('@playwright/test');

test.describe('pane error handling', () => {
  test('throws when multiple panes found in current document', async ({ page }) => {
    await page.goto('/panes/duplicate-current');
    await page.click('#single-pane-link');
    await page.waitForTimeout(100);
    const errors = await page.evaluate(() => window.bixiErrors);
    expect(errors).toContain('Bixi error: Multiple panes named main found in current document');
  });

  test('throws when multiple panes found in server response', async ({ page }) => {
    await page.goto('/panes/single');
    await page.click('#duplicate-response-link');
    await page.waitForTimeout(100);
    const errors = await page.evaluate(() => window.bixiErrors);
    expect(errors).toContain('Bixi error: Multiple bx-nav-panes named main found in server response');
  });
});