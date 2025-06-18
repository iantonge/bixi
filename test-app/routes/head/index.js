const Router = require('@koa/router');

const router = new Router({ prefix: '/head' });

router.get('/', async (ctx) => {
  ctx.type = 'html';
  ctx.body = `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Page 1</title>
        <meta name="description" content="desc1">
        <meta custom="custom" content="custom1">
      </head>
      <body>
        <div bx-nav-pane="main">
          <p>Head update test page 1</p>
          <a id="page2-link" href="/head/page2" bx-target="main">Page 2</a>
        </div>
        <script type="module">
          import { init } from '/bixi.js';
          window.bixiErrors = [];
          init({ onError: (err) => window.bixiErrors.push(err.message) });
        </script>
      </body>
    </html>
    `;
});

router.get('/page2', async (ctx) => {
  ctx.type = 'html';
  ctx.body = `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Page 2</title>
        <meta name="description" content="desc2">
        <meta custom="custom" content="custom2">
      </head>
      <body>
        <div bx-nav-pane="main">
          <p>Head update test page 2</p>
          <a id="page1-link" href="/head" bx-target="main">Page 1</a>
        </div>
        <script type="module">
          import { init } from '/bixi.js';
          window.bixiErrors = [];
          init({ onError: (err) => window.bixiErrors.push(err.message) });
        </script>
      </body>
    </html>
    `;
});

router.get('/custom', async (ctx) => {
  ctx.type = 'html';
  ctx.body = `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Custom Page 1</title>
        <meta name="description" content="cdesc1">
        <meta custom="custom" content="ccustom1">
      </head>
      <body>
        <div bx-nav-pane="main">
          <p>Custom head selectors test page 1</p>
          <a id="custom-page2-link" href="/head/custom/page2" bx-target="main">Page 2</a>
        </div>
        <script type="module">
          import { init } from '/bixi.js';
          window.bixiErrors = [];
          init({ onError: (err) => window.bixiErrors.push(err.message), headContentSelectors: ['title', 'meta[custom]'] });
        </script>
      </body>
    </html>
    `;
});

router.get('/custom/page2', async (ctx) => {
  ctx.type = 'html';
  ctx.body = `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Custom Page 2</title>
        <meta name="description" content="cdesc2">
        <meta custom="custom" content="ccustom2">
      </head>
      <body>
        <div bx-nav-pane="main">
          <p>Custom head selectors test page 2</p>
          <a id="custom-page1-link" href="/head/custom" bx-target="main">Page 1</a>
        </div>
        <script type="module">
          import { init } from '/bixi.js';
          window.bixiErrors = [];
          init({ onError: (err) => window.bixiErrors.push(err.message), headContentSelectors: ['title', 'meta[custom]'] });
        </script>
      </body>
    </html>
    `;
});

module.exports = router;