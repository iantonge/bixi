const Router = require('@koa/router');

const router = new Router({ prefix: '/interception' });

router.get('/', async (ctx) => {
  ctx.type = 'html';
  ctx.body = `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>bixi test app</title>
      </head>
      <body>
        <div bx-nav-pane="main">
          <h1>Link interception tests</h1>
          <p>Original page content</p>
          <ul>
            <li><a id="external-link" href="https://example.com" bx-target="main">External link</a></li>
            <li><a id="internal-link-with-target" href="/links/interception/internal-link" bx-target="main" target="_blank">Internal link with target</a></li>
            <li><a id="internal-link" href="/links/interception/internal-link" bx-target="main">Internal link</a></li>
            <li><a href="/links/interception/internal-link" bx-target="main"><span id="internal-link-span">Internal link with span</span></a></li>
            <li><a id="internal-link-non-existant-target" href="/links/interception/internal-link" bx-target="non-existant">Internal link targeeting non-existant pane</a></li>
          </ul>
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

router.get('/internal-link', async (ctx) => {
  ctx.type = 'html';
  ctx.body = `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>bixi test app</title>
      </head>
      <body>
        <div bx-nav-pane="main">
          <h1>Link interception tests</h1>
          <p>This is an internal page</p>
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

module.exports = router;
