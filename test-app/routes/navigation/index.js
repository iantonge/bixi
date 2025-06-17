const Router = require('@koa/router');

const router = new Router({ prefix: '/navigation' });

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
          <h1>Navigation tests</h1>
          <p id="navigation-page-content" class="page-content">Original page content</p>
          <ul>
            <li><a id="another-page-link" href="/navigation/another-page" hx-target="main">Another page</a></li>
            <li><a id="another-page-redirect-link" href="/navigation/another-page-redirect" hx-target="main">Redirect to another page</a></li>
            <li><a id="different-page-link" href="/navigation/different-page" hx-target="main">A different page</a></li>
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

router.get('/another-page', async (ctx) => {
  ctx.type = 'html';
  ctx.body = `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>bixi test app</title>
      </head>
      <body>
        <div bx-nav-pane="main">
          <h1>Navigation tests</h1>
          <p id="another-page-content" class="page-content">Another page content</p>
          <ul>
            <li><a id="navigation-page-link" href="/navigation" hx-target="main">Navigation page</a></li>
            <li><a id="different-page-link" href="/navigation/different-page" hx-target="main">A different page</a></li>
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

router.get('/another-page-redirect', async (ctx) => {
  ctx.redirect('/navigation/another-page');
});

router.get('/different-page', async (ctx) => {
  ctx.type = 'html';
  ctx.body = `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>bixi test app</title>
      </head>
      <body>
        <div bx-nav-pane="main">
          <h1>Navigation tests</h1>
          <p id="different-page-content" class="page-content">Different page content</p>
          <ul>
            <li><a id="navigation-page-link" href="/navigation" hx-target="main">Navigation page</a></li>
            <li><a id="another-page-link" href="/navigation/another-page" hx-target="main">Another page</a></li>
            <li><a id="another-page-redirect-link" href="/navigation/another-page-redirect" hx-target="main">Redirect to another page</a></li>
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

module.exports = router;
