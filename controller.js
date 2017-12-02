const Router = require('koa-router');
const router = new Router();
const koaBody = require('koa-body');

const {checkPhone, getRandomOTP} = require('util');


router.get('/whoami', (ctx, next) => {
    ctx.body = {
        version: '0.0.1',
        status: true
    }
});
router.post('/api/getotp', koaBody(), async(ctx, next) => {
    const {body} = ctx.request;
    const {number} = body;
    if (!number || !checkPhone.test(number)) {
        ctx.body = {
            status: false
        }
    }
    const otp = getRandomOTP();
    ctx.body = {
            status: true
    }
});

router.post('/api/verifyotp', koaBody(), function (ctx, next) {
    ctx.body = {
        status: true
    }
});

router.post('/api/candidates', koaBody(), function (ctx, next) {
    ctx.body = {
        candidates: [],
        status: true
    }
});

router.post('/api/vote', koaBody(), function (ctx, next) {
    ctx.body = {
        status: true
    }
});

module.exports = router;