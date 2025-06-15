const Router = require('@koa/router');

const router = new Router({ prefix: '/ajax' });

router.get('/', async (ctx) => {
  ctx.type = 'html';
  ctx.body = `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>bixi test app</title>
      </head>
      <body>
        <div bx-pane="main">
          <h1>Ajax tests</h1>
          <p>Original page content</p>
          <ul>
            <li><a id="missing-pane-response-link" href="/ajax/missing-pane-response" bx-target="main">Missing pane response link</a></li>
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

router.get('/missing-pane-response', async (ctx) => {
  ctx.type = 'html';
  ctx.body = `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>bixi test app</title>
      </head>
      <body>
        <h1>Ajax tests</h1>
        <p>This page has no panes</p>
      </body>
    </html>
    `;
});

module.exports = router;
