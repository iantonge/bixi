const { test, expect } = require('@playwright/test');

test.describe('request coordination', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/request-coordination');
  });

  test('skips descendant request when ancestor is in flight', async ({ page }) => {
    let count = 0;
    await page.route('**/request-coordination', async route => {
      count++;
      await new Promise(r => setTimeout(r, 500));
      await route.continue();
    });

    await page.click('#sibling-pane-one-link');
    await page.waitForTimeout(100);
    await page.click('#sibling-pane-one-child-link');
    await page.waitForTimeout(600);
    expect(count).toBe(1);
  });

  test('aborts in-flight descendant request when ancestor starts', async ({ page }) => {
    let started = 0;
    let finished = 0;
    await page.route('**/request-coordination', async route => {
      started++;
      await new Promise(r => setTimeout(r, 500));
      await route.continue();
    });

    page.on('requestfinished', req => { if (req.url().includes('/request-coordination')) finished++; });

    await page.click('#sibling-pane-one-child-link');
    await page.waitForTimeout(100);
    await page.click('#sibling-pane-one-link');

    await page.waitForTimeout(600);
    expect(started).toBe(2);
    expect(finished).toBe(1);
  });
});
