const { test, expect } = require('@playwright/test');

test.describe('updateHead', () => {
  test('updates document head with default selectors', async ({ page }) => {
    await page.goto('/head');
    await expect(page).toHaveTitle('Page 1');
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', 'desc1');
    await expect(page.locator('meta[custom="custom"]')).toHaveAttribute('content', 'custom1');

    await page.click('#page2-link');
    await page.waitForSelector('text=Head update test page 2');

    await expect(page).toHaveTitle('Page 2');
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', 'desc2');
    await expect(page.locator('meta[custom="custom"]')).toHaveAttribute('content', 'custom1');

    await page.goBack();
    await page.waitForSelector('text=Head update test page 1');
    await expect(page).toHaveTitle('Page 1');
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', 'desc1');
    await expect(page.locator('meta[custom="custom"]')).toHaveAttribute('content', 'custom1');
  });

  test('honours custom headContentSelectors', async ({ page }) => {
    await page.goto('/head/custom');
    await expect(page).toHaveTitle('Custom Page 1');
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', 'cdesc1');
    await expect(page.locator('meta[custom="custom"]')).toHaveAttribute('content', 'ccustom1');

    await page.click('#custom-page2-link');
    await page.waitForSelector('text=Custom head selectors test page 2');

    await expect(page).toHaveTitle('Custom Page 2');
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', 'cdesc1');
    await expect(page.locator('meta[custom="custom"]')).toHaveAttribute('content', 'ccustom2');

    await page.goBack();
    await page.waitForSelector('text=Custom head selectors test page 1');
    await expect(page).toHaveTitle('Custom Page 1');
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', 'cdesc1');
    await expect(page.locator('meta[custom="custom"]')).toHaveAttribute('content', 'ccustom1');
  });
});