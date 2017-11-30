/**
 * Created by junjun.deng on 30/11/2017.
 */
const supertest = require('supertest');
const echo = require('./echo');
const app = require('./server');

test('echo', async () => {
    const params = {msg: 'hi'};
    const ctx = {params};

    await echo(ctx, () => {});
    expect(ctx.body).toBe(params);
});

test('echo route', async () => {
    const response = await supertest(app.callback()).get('/echo/hi');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({msg: 'hi'});
});
