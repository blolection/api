const Koa = require('koa');
const serve = require('koa-static');

const app = new Koa();
const router = require('./controller');
const cors = require('@koa/cors');

app.use(cors());
app.use(serve(__dirname + '/public'));
app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(4567);