const Router = require('koa-router');
const router = new Router();
const koaBody = require('koa-body');
const redis = require('redis');
const bb = require('bluebird');
const _ = require('lodash');

bb.promisifyAll(redis.RedisClient.prototype);

const sms = require('./sms');

client = redis.createClient();

client.on("error", function (err) {
   console.log("Error " + err);
});


const {checkPhone, getRandomOTP, validOTP} = require('./util');


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
    try {
        await client.delAsync(number); 
        await client.setAsync(number, otp, 'EX', 1200); //OTPs expire after 1200 seconds
        const resp = await sms.send(number, 'Your Login OTP is ' + otp);
        ctx.body = {
            status: true,
            resp
        }
    } catch (error) {
        ctx.body = {
            status: false,
            error
        }
    }
});

router.post('/api/verifyotp', koaBody(), async (ctx, next) => {
    const {body} = ctx.request;
    const {number, otp} = body;
    if (!number || !checkPhone.test(number) || !validOTP(otp)) {
        ctx.body = {
            status: false
        }
    }
    try {
        const resp = await client.getAsync(number);
        if(resp === _.toString(otp)) {
            await client.delAsync(number); 
            ctx.body = {
                status: true
            }
        }
        ctx.body = {
            status: false
        }
        
    } catch (error) {
        ctx.body = {
            status: false
        }
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