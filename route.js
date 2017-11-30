const Router = require('koa-router');
const echo = require('./echo');

const router = new Router();

router.get('/echo/:msg', echo);

module.exports = router;
