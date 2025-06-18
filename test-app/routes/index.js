const Router = require('@koa/router');
const ajaxRoutes = require('./ajax');
const autofocusRoutes = require('./autofocus');
const eventsRoutes = require('./events');
const formsRoutes = require('./forms');
const linksRoutes = require('./links');
const navigationRoutes = require('./navigation');
const paneRoutes = require('./panes');
const requestCoordinationRoutes = require('./request-coordination');

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
        <div bx-nav-pane="main">
          <h1>Welcome to bixi test app</h1>
          <ul>
            <li><a href="/ajax" bx-target="main">ajax tests</a></li>
            <li><a href="/autofocus" bx-target="main">autofocus tests</a></li>
            <li><a href="/events" bx-target="main">event tests</a></li>
            <li><a href="/forms" bx-target="main">form tests</a></li>
            <li><a href="/links" bx-target="main">link tests</a></li>
            <li><a href="/navigation" bx-target="main">navigation tests</a></li>
            <li><a href="/panes" bx-target="main">pane tests</a></li>
            <li><a href="/request-coordination" bx-target="main">request coordination tests</a></li>
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

router.use(ajaxRoutes.routes(), ajaxRoutes.allowedMethods());
router.use(autofocusRoutes.routes(), autofocusRoutes.allowedMethods());
router.use(eventsRoutes.routes(), eventsRoutes.allowedMethods());
router.use(formsRoutes.routes(), formsRoutes.allowedMethods());
router.use(linksRoutes.routes(), linksRoutes.allowedMethods());
router.use(navigationRoutes.routes(), navigationRoutes.allowedMethods());
router.use(paneRoutes.routes(), paneRoutes.allowedMethods());
router.use(requestCoordinationRoutes.routes(), requestCoordinationRoutes.allowedMethods());

module.exports = router;
