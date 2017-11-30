const Koa = require('koa');
const logger = require('koa-logger');
const route = require('./route');

const app = new Koa();
const port = 3000;

app.use(logger());

app.use(route.allowedMethods());
app.use(route.routes());

app.listen(port, () => console.log(`Listen on ${port}...`));

module.exports = app;
