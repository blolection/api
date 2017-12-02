const Router = require('koa-router');
const router = new Router();
const koaBody = require('koa-body');
const redis = require('redis');
const bb = require('bluebird');
const _ = require('lodash');
const uuidv4 = require('uuid/v4');
const rp = require('request-promise');

bb.promisifyAll(redis.RedisClient.prototype);

const sms = require('./sms');

client = redis.createClient();

client.on("error", function (err) {
    console.log("Error " + err);
});


const { checkPhone, getRandomOTP, validOTP} = require('./util');


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

router.post('/api/verifyotp', koaBody(), async(ctx, next) => {
    const {body} = ctx.request;
    const {number, otp} = body;
    if (!number || !checkPhone.test(number) || !validOTP(otp)) {
        ctx.body = {
            status: false,
            error: 1
        }
    }
    try {
        const resp = await client.getAsync(number);
        if (resp === _.toString(otp)) {
            await client.delAsync(number);
            const token = uuidv4();
            await client.setAsync(number + 'token', token);
            const options = {
                method: 'POST',
                url: 'http://localhost:3000/api/user',
                headers: {
                    'content-type': 'application/json'
                },
                body: {
                    '$class': 'org.bhanu.io.User',
                    phone: number,
                    votes: 1
                },
                json: true
            };
            const makeUser = await rp(options);
            ctx.body = {
                status: true,
                token,
                makeUser
            }
        } else {
            ctx.body = {
                status: false,
                error: 2
            }
        }
    } catch (error) {
        console.log(error);
        ctx.body = {
            status: false,
            error: 3
        }
    }
});

router.get('/api/candidates', async(ctx, next) => {
    const options = {
        method: 'GET',
        url: 'http://localhost:3000/api/Candidate'
    };
    const getCandidates = await rp(options);
    ctx.body = {
        candidates: getCandidates,
        status: true
    }
});

router.post('/api/candidate', koaBody(), async (ctx, next) => {
    const {body} = ctx.request;
    const {uid, name, image, symbol, description} = body;
    if (!uid || !checkPhone.test(uid) || !name || !image || !symbol || !description) {
        ctx.body = {
            status: false
        }
    } else {
        const options = {
            method: 'POST',
            url: 'http://localhost:3000/api/Candidate',
            headers: {
                'content-type': 'application/json'
            },
            body: {
                '$class': 'org.bhanu.io.Candidate',
                "uid": uid,
                "name": name,
                "image": image,
                "symbol": symbol,
                "description": description,
                "votes": 0
            },
            json: true
        };
        const makeCandidate = await rp(options);
        ctx.body = {
            status: true,
            makeCandidate
        }
    }
});

router.post('/api/vote', koaBody(), async (ctx, next) => {
    const {body} = ctx.request;
    const {number, token, uid} = body;

    if (!number || !checkPhone.test(number) || !token || !uid || !checkPhone.test(uid)) {
        ctx.body = {
            status: false
        }
    } else {
        const token = await client.getAsync(number + 'token');
        if (token === _.toString(token)) {
            const options = {
                method: 'POST',
                url: 'http://localhost:3000/api/CommitVote',
                headers: {
                    'content-type': 'application/json'
                },
                body: {
                    '$class': 'org.bhanu.io.CommitVote',
                    "voter": `org.bhanu.io.User#${number}`,
                    "contestant": `org.bhanu.io.Candidate#${uid}`,
                },
                json: true
            };
            const makeVote = await rp(options);
            ctx.body = {
                status: true,
                token,
                makeVote
            }
        } else {
            ctx.body = {
                status: false,
                err: 'token not matching'
            }
        }
    }
});

module.exports = router;