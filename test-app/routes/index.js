const Router = require('@koa/router');
const ajaxRoutes = require('./ajax');
const linksRoutes = require('./links');

const router = new Router();

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
          <h1>Welcome to bixi test app</h1>
          <a href="/links" bx-target="main">link tests</a>
        </div>
        <script type="module">
          import { init } from '/bixi.js';
          init();
        </script>
      </body>
    </html>
    `;
});

router.use(ajaxRoutes.routes(), ajaxRoutes.allowedMethods());
router.use(linksRoutes.routes(), linksRoutes.allowedMethods());

module.exports = router;
