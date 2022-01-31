const { Server, Origins } = require("boardgame.io/server");
const next = require("next");
const Router = require("@koa/router");
const { TicTacToe } = require("./components/game");

const appPort = parseInt(process.env.APP_PORT, 10) || 8000;
// const apiPort = parseInt(process.env.API_PORT, 10) || 8000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = Server({
    games: [TicTacToe],
    origins: [Origins.LOCALHOST],
  });
  const router = new Router();

  router.all("(.*)", async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
  });

  server.app.use(async (ctx, next) => {
    ctx.res.statusCode = 200;
    await next();
  });

  server.app.use(router.routes());
  server.run({
    port: appPort,
    // lobbyConfig: { apiPort }
  });
});