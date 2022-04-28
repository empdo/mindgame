import Koa from "koa";
import koaBody from "koa-body";
import KoaRouter from "koa-router";
import jwt from "jsonwebtoken";

const app = new Koa();
const router = new KoaRouter();

const config = {
  PORT: 5000,
};

let lobbies: { [id: string]: Lobby } = {};

class Lobby {
  id: string;
  players = [];

  constructor(id: string, jwt: string) {
    this.id = id;
  }
}

router.get("/", (ctx, next) => {
  ctx.body = "hello there";
});

router.post("/lobby/", (ctx, next) => {
  //create lobby, return jwt to connect with
  const id = ctx.params.id;
  let jwtSecretKey = process.env.JWT_SECRET_KEY;

  if (!id || !jwtSecretKey) {
    return;
  }
  let data = {
    time: Date(),
    id,
  };

  const token = jwt.sign(data, jwtSecretKey);
});

router.get("/lobby/ws", (ctx, next) => {
  //connect to lobby, provide jwt and server connects to lobby
});

app.use(koaBody());
app.use(router.routes());
app.listen(5000);

console.log(`Started server on port ${config.PORT}`);
