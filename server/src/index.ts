import Koa from "koa";
import koaBody from "koa-body";
import KoaRouter from "@koa/router";
import koaWs from "koa-easy-ws";
import koaCors from "@koa/cors";

const app = new Koa();
const router = new KoaRouter();

const config = {
  PORT: 5000,
};

let lobbies: { [id: string]: Lobby } = {};

class Player {
  name: string;
  ws: WebSocket;
  readyState: boolean;

  constructor(name: string, ws: WebSocket) {
    this.name = name;
    this.ws = ws;
    this.readyState = false;
  }
}

class Lobby {
  id: string;
  players: Player[] = [];

  constructor(id: string) {
    this.id = id;
  }

  addPlayer = (player: Player) => {
    if (!player.ws) return;

    this.players.push(player);

    player.ws.onclose = () => this.socketClose(player);
    player.ws.onmessage = (e) => this.handleMessage(e, player);

    this.alertPlayersList();
  };

  handleMessage = (e: MessageEvent<any>, player: Player) => {
    if (!e.data) return;

    const { type, data } = JSON.parse(e.data);

    if (type === 1) {
      player.readyState = !player.readyState;
    }

    this.alertPlayersList();
  };

  socketClose = (player: Player) => {
    this.players = this.players.filter((p) => p.ws !== player.ws);
    this.alertPlayersList();
  };

  gameloop = () => {
    //skicka att de börjar till varej spelare
    //de bygger sin scene
    //de skickar okej tillbaka
  };

  alertPlayersList = () => {
    //change to only update the thing that has changed
    this.players.forEach((player) => {
      player.ws.send(
        JSON.stringify({
          type: "1",
          data: this.players.map((player) => {
            return {
              name: player.name,
              readyState: player.readyState,
            };
          }),
        })
      );
    });
    console.log(lobbies);
  };
}

router.get("/", (ctx) => {
  ctx.body = "mindgame";
});

router.get("/lobbies", (ctx) => {
  ctx.body = Object.keys(lobbies);
});

router.get("/lobby/:id/", async (ctx) => {
  //connect to lobby
  const id = ctx.params.id;
  if (!ctx.ws || !id) return;

  const ws: WebSocket = await ctx.ws();

  if (!lobbies[id]) {
    console.log(`Creating lobby with id: ${id}`);
    lobbies[id] = new Lobby(id);
  }

  lobbies[id].addPlayer(new Player(ctx.request.hostname, ws));
});

app.use(koaBody());
app.use(koaWs());
app.use(koaCors());
app.use(router.routes());
app.listen(5000);

console.log(`Started server on port ${config.PORT}`);
