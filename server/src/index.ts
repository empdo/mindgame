import Koa from "koa";
import koaBody from "koa-body";
import KoaRouter from "@koa/router";
import koaWs from "koa-easy-ws";

const app = new Koa();
const router = new KoaRouter();

const config = {
  PORT: 5000,
};

let lobbies: { [id: string]: Lobby } = {};

class Player {
  name: string;
  ws: WebSocket;

  constructor(name: string, ws: WebSocket) {
    this.name = name;
    this.ws = ws;
  }
}

class Lobby {
  id: string;
  players = [];

  constructor(id: string) {
    this.id = id;
  }
}

router.get("/", (ctx) => {
  ctx.body = "mindgame";
});

router.get("/lobbies", (ctx) => {
  ctx.body = lobbies;
});

router.post("/lobby/:id", (ctx) => {
  //create lobby
  const id = ctx.params.id;
  if (!lobbies[id]) {
    lobbies[id] = new Lobby(id);
    console.log(`Added lobby with id: ${id}`);
  } else {
    ctx.body = "lobby already exists";
  }
});

router.get("/lobby/:id/ws", async (ctx) => {
  //connect to lobby
  if (!ctx.ws) return;

  const ws: WebSocket = await ctx.ws();
});

app.use(koaBody());
app.use(koaWs());
app.use(router.routes());
app.listen(5000);

console.log(`Started server on port ${config.PORT}`);
