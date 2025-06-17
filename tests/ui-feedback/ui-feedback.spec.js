const { test, expect } = require('@playwright/test');

test.describe('in-flight UI feedback', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/links/interception');
  });

  test('adds busy indicators during request', async ({ page }) => {
    await page.route('**/links/interception/internal-link', async route => {
      await new Promise(r => setTimeout(r, 500));
      await route.continue();
    });

    const navPane = page.locator('[bx-nav-pane="main"]');

    await page.click('#internal-link');

    await expect(navPane).toHaveClass('bx-busy');
    await expect(navPane).toHaveAttribute('aria-busy', 'true');

    await page.waitForSelector('p:has-text("This is an internal page")');

    await expect(navPane).not.toHaveClass('bx-busy');
    await expect(navPane).not.toHaveAttribute('aria-busy', 'true');
  });
});