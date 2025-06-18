const Router = require('@koa/router');

const router = new Router({ prefix: '/events' });

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
          <h1>Event tests</h1>
          <p id="initial-content">Original page content</p>
          <a id="load-content-link" href="/events/new-content" bx-target="main">Load content</a>
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

router.get('/new-content', async (ctx) => {
  ctx.type = 'html';
  ctx.body = `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>bixi test app</title>
      </head>
      <body>
        <div bx-nav-pane="main">
          <h1>Event tests</h1>
          <p id="new-content">New page content</p>
          <button id="new-button">New button</button>
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