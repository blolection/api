const Koa = require('koa');


const app = new Koa();
const router = require('./controller');
const cors = require('@koa/cors');

app.use(cors());

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(4567);