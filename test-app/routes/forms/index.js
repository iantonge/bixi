const Router = require('@koa/router');

const router = new Router({ prefix: '/forms' });

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
          <h1>Forms tests</h1>
          <p>Original page content</p>
          <form id="get-form" method="get" action="/forms/get-form" bx-target="main">
            <input type="text" name="some-field" value="some field value" />
            <button type="submit">Plain submit</button>
            <button type="submit" formaction="/forms/another-get-form">Formaction submit</button>
            <button type="submit" formmethod="post" formaction="/forms/post-form">Formmethod submit</button>
            <button type="submit" name="additional-value" value="some value">Additional value submit</button>
          </form>
          <button id="external-get" type="submit" form="get-form" bx-target="child">External GET submit</button>
          <form id="post-form" method="post" action="/forms/post-form" bx-target="main">
            <input type="text" name="some-field" value="some field value" />
            <button type="submit">Plain submit</button>
          </form>
          <div bx-pane="child">
            <p>Original child content.</p>
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

router.get('/get-form', async (ctx) => {
  const { ['some-field']: someField, ['additional-value']: additional } = ctx.query;
  ctx.type = 'html';
  ctx.body = `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>bixi test app</title>
      </head>
      <body>
        <div bx-nav-pane="main">
          <h1>Forms tests</h1>
          <p>GET form submitted: ${someField}${additional ? ' - ' + additional : ''}</p>
          <div bx-pane="child">
            <p>Updated child content.</p>
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

router.get('/another-get-form', async (ctx) => {
  const { ['some-field']: someField } = ctx.query;
  ctx.type = 'html';
  ctx.body = `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>bixi test app</title>
      </head>
      <body>
        <div bx-nav-pane="main">
          <h1>Forms tests</h1>
          <p>Another GET form submitted: ${someField}</p>
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

router.post('/post-form', async (ctx) => {
  const { ['some-field']: someField, ['additional-value']: additional } = ctx.request.body;
  ctx.type = 'html';
  ctx.body = `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>bixi test app</title>
      </head>
      <body>
        <div bx-nav-pane="main">
          <h1>Forms tests</h1>
          <p>POST form submitted: ${someField}${additional ? ' - ' + additional : ''}</p>
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
