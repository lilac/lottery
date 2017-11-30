const Router = require('koa-router');

const router = new Router();

async function echo(ctx) {
    ctx.body = ctx.params;
}

router.get('/echo/:msg', echo);

module.exports = router;
