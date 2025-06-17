const { test, expect } = require('@playwright/test');

test.describe('bx-nav-pane navigation', () => {

  test('supports browser back and forward', async ({ page }) => {
    await page.goto('/navigation');
    let pageContent = await page.locator('.page-content').textContent();
    expect(pageContent).toBe('Original page content');
    expect(page.url()).toMatch(/\/navigation$/);

    await page.click('#another-page-redirect-link');
    await page.locator('#another-page-content').waitFor();
    pageContent = await page.locator('.page-content').textContent();
    expect(pageContent).toBe('Another page content');
    expect(page.url()).toMatch(/\/navigation\/another-page$/);

    await page.click('#different-page-link');
    await page.locator('#different-page-content').waitFor();
    pageContent = await page.locator('.page-content').textContent();
    expect(pageContent).toBe('Different page content');
    expect(page.url()).toMatch(/\/navigation\/different-page$/);

    await page.goBack();
    await page.locator('#another-page-content').waitFor();
    pageContent = await page.locator('.page-content').textContent();
    expect(pageContent).toBe('Another page content');
    expect(page.url()).toMatch(/\/navigation\/another-page$/);

    await page.goBack();
    pageContent = await page.locator('.page-content').textContent();
    expect(pageContent).toBe('Original page content');
    expect(page.url()).toMatch(/\/navigation$/);

    await page.goForward();
    await page.locator('#another-page-content').waitFor();
    pageContent = await page.locator('.page-content').textContent();
    expect(pageContent).toBe('Another page content');
    expect(page.url()).toMatch(/\/navigation\/another-page$/);

    await page.goForward();
    await page.locator('#different-page-content').waitFor();
    pageContent = await page.locator('.page-content').textContent();
    expect(pageContent).toBe('Different page content');
    expect(page.url()).toMatch(/\/navigation\/different-page$/);
  });
});