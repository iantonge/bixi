const Router = require('@koa/router');

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
        <h1>Welcome to bixi test app</h1>
        <script type="module">
          import { init } from '/bixi.js';
          init();
        </script>
      </body>
    </html>
    `;
});

module.exports = router;
