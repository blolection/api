const Router = require('koa-router');
const router = new Router();

router.get('/whoami', function (ctx, next) {
    ctx.body = {
        version: '0.0.1',
        status: true
    }
});
router.post('/api/getotp', function (ctx, next) {
    ctx.body = {
        status: true
    }
});

router.post('/api/verifyotp', function (ctx, next) {
    ctx.body = {
        status: true
    }
});

router.post('/api/candidates', function (ctx, next) {
    ctx.body = {
        candidates: [],
        status: true
    }
});

router.post('/api/vote', function (ctx, next) {
    ctx.body = {
        status: true
    }
});

module.exports = router;