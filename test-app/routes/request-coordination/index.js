const Router = require('@koa/router');

const router = new Router({ prefix: '/request-coordination' });

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
          <h1>Request coordination tests</h1>
          <p>Original page content</p>
          <div bx-pane="sibling-pane-one">
            <a id="sibling-pane-one-link" href="/request-coordination" bx-target="sibling-pane-one">Refresh sibling pane one</a>
            <div bx-pane="sibling-pane-one-child">
              <a id="sibling-pane-one-child-link" href="/request-coordination" bx-target="sibling-pane-one-child">Refresh sibling pane one child</a>
            </div>
          </div>
          <div bx-pane="sibling-pane-two">
            <a id="sibling-pane-two-link" href="/request-coordination" bx-target="sibling-pane-two">Refresh sibling pane two</a>
            <div bx-pane="sibling-pane-two-child">
              <a id="sibling-pane-two-child-link" href="/request-coordination" bx-target="sibling-pane-two-child">Refresh sibling pane two child</a>
            </div>
          </div>
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
