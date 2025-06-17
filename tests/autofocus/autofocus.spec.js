const { test, expect } = require('@playwright/test');

test.describe('autofocus behaviour', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/autofocus');
  });

  test('focuses and removes autofocus attribute after navigation', async ({ page }) => {
    await Promise.all([
      page.waitForSelector('#auto-input'),
      page.click('#autofocus-link')
    ]);

    await page.waitForFunction(() => {
      const el = document.querySelector('#auto-input');
      return document.activeElement === el && !el.hasAttribute('autofocus');
    });

    const activeId = await page.evaluate(() => document.activeElement.id);
    expect(activeId).toBe('auto-input');

    const hasAutofocus = await page.$eval('#auto-input', el => el.hasAttribute('autofocus'));
    expect(hasAutofocus).toBe(false);
  });
});