const Router = require('@koa/router');
const ajaxRoutes = require('./ajax');
const formsRoutes = require('./forms');
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
          <ul>
            <li><a href="/ajax" bx-target="main">ajax tests</a></li>
            <li><a href="/forms" bx-target="main">form tests</a></li>
            <li><a href="/links" bx-target="main">link tests</a></li>
          </ul>
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
router.use(formsRoutes.routes(), formsRoutes.allowedMethods());
router.use(linksRoutes.routes(), linksRoutes.allowedMethods());

module.exports = router;
