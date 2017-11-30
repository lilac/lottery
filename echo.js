/**
 * Created by junjun.deng on 30/11/2017.
 */
async function echo(ctx, next) {
    await next();
    ctx.body = ctx.params;
}

module.exports = echo;
