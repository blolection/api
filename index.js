const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();

router.get('/whoami', function (ctx, next) {
  ctx.body = {version: '0.0.1', status: 'OK'}
});

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(4567);