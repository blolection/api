const Koa = require('koa');


const app = new Koa();
const router = require('./controller');

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(4567);