const Koa = require('koa');
const { koaBody } = require('koa-body');
const serve = require('koa-static');
const path = require('path');
const router = require('./routes');
const app = new Koa();

app.use(koaBody({ multipart: true }));
app.use(router.routes());
app.use(router.allowedMethods());
app.use(serve(path.join(__dirname, '../src')));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
