const Koa = require('../my-koa');
const Router = require('../my-koa-router');
const serve = require('../my-koa-static');
const path = require('path');

const app = new Koa();

app.use(serve(path.resolve(__dirname, '../public')));
const router = new Router();
router.get('/test', async (ctx, next) => {
  console.log('test');
  console.log(path.join('../public', './test.html'));
  ctx.body = 'text4';
  await next();
});
app.use(async (ctx, next) => {
  console.log(1);
  await next();
  console.log(4);
});
app.use(async (ctx, next) => {
  console.log(2);
  await next();
  console.log(3);
});
app.use(router.routes());
app.listen(3000);
