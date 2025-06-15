const Router = require('@koa/router');
const interceptionRoutes = require('./interception');

const router = new Router({ prefix: '/links' });

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
          <h1>Link tests</h1>
          <a href="/links/interception" bx-target="main">Link interception tests</a>
        </div>
        <script type="module">
          import { init } from '/bixi.js';
          init();
        </script>
      </body>
    </html>
    `;
});

router.use(interceptionRoutes.routes(), interceptionRoutes.allowedMethods());

module.exports = router;
