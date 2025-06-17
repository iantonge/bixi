const { test, expect } = require('@playwright/test');

test.describe('bixi form interception', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/forms');
  });

  test('intercepts GET form submission', async ({ page }) => {
    await Promise.all([
      page.waitForSelector('p:has-text("GET form submitted")'),
      page.click('#get-form button:has-text("Plain submit")')
    ]);
    const content = await page.textContent('[bx-pane=main]');
    expect(content).toContain('GET form submitted');
  });

  test('uses formaction when provided', async ({ page }) => {
    await Promise.all([
      page.waitForSelector('p:has-text("Another GET form submitted")'),
      page.click('#get-form button:has-text("Formaction submit")')
    ]);
    const content = await page.textContent('[bx-pane=main]');
    expect(content).toContain('Another GET form submitted');
  });

  test('uses formmethod attribute for POST', async ({ page }) => {
    await Promise.all([
      page.waitForSelector('p:has-text("POST form submitted")'),
      page.click('#get-form button:has-text("Formmethod submit")')
    ]);
    const content = await page.textContent('[bx-pane=main]');
    expect(content).toContain('POST form submitted');
  });

  test('includes submitter name/value in request', async ({ page }) => {
    await Promise.all([
      page.waitForSelector('p:has-text("some value")'),
      page.click('#get-form button:has-text("Additional value submit")')
    ]);
    const content = await page.textContent('[bx-pane=main]');
    expect(content).toContain('some value');
  });

  test('intercepts form with method POST', async ({ page }) => {
    await Promise.all([
      page.waitForSelector('p:has-text("POST form submitted")'),
      page.click('#post-form button')
    ]);
    const content = await page.textContent('[bx-pane=main]');
    expect(content).toContain('POST form submitted');
  });
});
