const { test, expect } = require('@playwright/test');

test.describe('bixi link interception', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/links/interception');
  });

  test('throws on external link with bx-target', async ({ page }) => {
    await page.click('#external-link');
    const errors = await page.evaluate(() => window.bixiErrors);
    expect(errors).toContain('Bixi error: Cannot progressively enhance external links');
  });

  test('throws on internal link with target=_blank and bx-target', async ({ page }) => {
    await page.click('#internal-link-with-target');
    const errors = await page.evaluate(() => window.bixiErrors);
    expect(errors).toContain('Bixi error: Cannot progressively enhance links with target attribute');
  });

  test('throws on links targeting a non-existant pane', async ({ page }) => {
    await page.click('#internal-link-non-existant-target');
    const errors = await page.evaluate(() => window.bixiErrors);
    expect(errors).toContain('Bixi error: No pane named non-existant found in current document');
  });

  // NOTE: Simulating meta key presses doesn't seem to work with Playwright
  const modifiers = [
    { name: 'Ctrl key', options: { modifiers: ['Control'] }, skipWebkit: false },
    { name: 'Shift key', options: { modifiers: ['Shift'] }, skipWebkit: false },
    { name: 'Middle mouse button', options: { button: 'middle' }, skipWebkit: true }
  ];

  for (const { name, options, skipWebkit } of modifiers)
  {
    test(`skips click events when ${name} modifier used`, async ({ page, context, browserName }) => {
      test.skip(skipWebkit && browserName === 'webkit', `Webkit doesn't support synthetic ${name} events`)
      const [newPage] = await Promise.all([
        context.waitForEvent('page'), // Wait for new tab to open
        page.click('#internal-link', options),
      ]);

      await newPage.waitForLoadState();
      const newPageContent = await newPage.textContent('[bx-pane=main]');
      expect(newPageContent).toContain('This is an internal page');
      const content = await page.textContent('[bx-pane=main]');
      expect(content).toContain('Original page content');
      
    }); 
  }

  test('intercepts internal link with bx-target', async ({ page }) => {
    await Promise.all([
      page.waitForSelector('p:has-text("This is an internal page")'),
      page.click('#internal-link')
    ]);
    const content = await page.textContent('[bx-pane=main]');
    expect(content).toContain('This is an internal page');
  });

  test('intercepts internal link with bx-target clicked via nested span', async ({ page }) => {
    await Promise.all([
      page.waitForSelector('p:has-text("This is an internal page")'),
      page.click('#internal-link-span')
    ]);
    const content = await page.textContent('[bx-pane=main]');
    expect(content).toContain('This is an internal page');
  });

  test('ignores extra clicks within debounce window', async ({ page }) => {
    let requestCount = 0;
    await page.route('**/links/interception/internal-link', async route => {
      requestCount++;
      await new Promise(r => setTimeout(r, 100));
      await route.continue();
    });

    await page.evaluate(() => {
      const link = document.querySelector('#internal-link');
      link.click();
      link.click();
      link.click();
    });

    await page.waitForSelector('p:has-text("This is an internal page")');
    expect(requestCount).toBe(1);
  });
});
