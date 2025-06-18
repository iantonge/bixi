const { test, expect } = require('@playwright/test');

test.describe('load content events', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/events');
  });

  test('allows cancelling the content update', async ({ page }) => {
    await page.evaluate(() => {
      const pane = document.querySelector('[bx-nav-pane="main"]');
      pane.addEventListener('bixi:beforeLoadContent', e => e.preventDefault());
    });

    await page.click('#load-content-link');
    await page.waitForTimeout(1000);

    const text = await page.textContent('#initial-content');
    expect(text).toBe('Original page content');
  });

  test('allows modifying the content before insertion', async ({ page }) => {
    await page.evaluate(() => {
      const pane = document.querySelector('[bx-nav-pane="main"]');
      pane.addEventListener('bixi:beforeLoadContent', e => {
        e.detail.newContent.querySelector('#new-content').textContent = 'Modified via event';
      });
    });

    await page.click('#load-content-link');
    await page.waitForSelector('#new-content');

    const text = await page.textContent('#new-content');
    expect(text).toBe('Modified via event');
  });

  test('allows detaching listeners from the target before content is loaded', async ({ page }) => {
    await page.evaluate(() => {
      const pane = document.querySelector('[bx-nav-pane="main"]');
      window.oldPane = pane;
      window.callCount = 0;
      window.listener = () => window.callCount++;
      pane.addEventListener('custom:event', window.listener);
      document.body.addEventListener('bixi:beforeLoadContent', (e) => {
        e.target.removeEventListener('custom:event', window.listener);
      });
    });

    await page.evaluate(() => window.oldPane.dispatchEvent(new CustomEvent('custom:event')));
    let count = await page.evaluate(() => window.callCount);
    expect(count).toBe(1);
    await page.click('#load-content-link');
    await page.waitForSelector('#new-content');
    await page.evaluate(() => window.oldPane.dispatchEvent(new CustomEvent('custom:event')));
    count = await page.evaluate(() => window.callCount);
    expect(count).toBe(1);
  });

  test('allows attaching listeners to the new content after it is loaded', async ({ page }) => {
    await page.evaluate(() => {
      window.afterTriggered = false;
      document.addEventListener('bixi:afterLoadContent', (e) => {
        e.target.querySelector('#new-button').addEventListener('click', () => { window.afterTriggered = true; });
      });
    });

    await page.click('#load-content-link');
    await page.waitForSelector('#new-button');
    await page.click('#new-button');
    const triggered = await page.evaluate(() => window.afterTriggered);
    expect(triggered).toBe(true);
  });
});