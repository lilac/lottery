/**
 * Created by junjun.deng on 30/11/2017.
 */
const echo = require('./echo');

test('echo', async () => {
    const params = {msg: 'hi'};
    const ctx = {params};

    await echo(ctx, () => {});
    expect(ctx.body).toBe(params);
});
