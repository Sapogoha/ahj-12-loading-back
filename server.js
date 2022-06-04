const http = require('http');
const Koa = require('koa');
const Router = require('koa-router');
const koaBody = require('koa-body');
const cors = require('@koa/cors');
const slow = require('koa-slow');
const faker = require('faker');
const router = new Router();
const app = new Koa();
const port = process.env.PORT || 7070;
const server = http.createServer(app.callback());

app.use(
  cors({
    origin: '*',
    credentials: true,
    'Access-Control-Allow-Origin': true,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
);

app.use(
  koaBody({
    text: true,
    urlencoded: true,
    multipart: true,
    json: true,
  })
);

app.use(
  slow({
    delay: 5000,
  })
);

router.get('/news/arts&culture', async (ctx) => {
  function createNews() {
    return {
      id: faker.datatype.uuid(),
      image: faker.image.abstract(70, 70),
      text: faker.lorem.sentence(8),
      received: Date.now(),
    };
  }

  const quantity = 3;
  const news = Array.from({ length: quantity }, createNews);

  ctx.response.body = JSON.stringify({
    status: 'ok',
    timestamp: Date.now(),
    news,
  });
});

app.use(router.routes()).use(router.allowedMethods());

server.listen(port, () => console.log('Server started'));
