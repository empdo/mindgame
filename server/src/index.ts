import Koa from "koa";
import koaBody from "koa-body";
import koaWs from "koa-easy-ws";
import KoaRouter from "@koa/router";
import koaCors from "@koa/cors";
import WebSocket from "ws";
import { v4 as uuidv4 } from "uuid";

const app = new Koa();
const router = new KoaRouter();

const config = {
  PORT: 5000,
};

let lobbies: { [id: string]: Lobby } = {};

export const sleep = async (duration: number) =>
  await new Promise<void>((resolve) => setTimeout(resolve, duration));

class Player {
  name: string;
  ws: WebSocket;
  readyState: boolean;
  id: string;
  lobby: Lobby;
  cards: number[] = [];

  constructor(name: string, ws: WebSocket, lobby: Lobby) {
    this.name = name;
    this.ws = ws;
    this.readyState = false;
    this.id = uuidv4();
    this.lobby = lobby;

    this.ws.on("message", this.handleMessage.bind(this));
    this.ws.onclose = () => this.socketClose();
  }

  handleMessage(e: string) {
    if (!e) return;

    const { type, data } = JSON.parse(e);

    if (type === 1) {
      this.readyState = !this.readyState;

      if (this.lobby.players.every((player) => player.readyState === true)) {
        this.lobby.initGame();
      }
    } else if (type === 2) {
      this.lobby.playedCards.push(data);
      this.cards = this.cards.filter((card) => card !== data);
    }

    this.lobby.alertPlayersList();
  }

  socketClose() {
    this.lobby.players = this.lobby.players.filter((p) => p.ws !== this.ws);

    if (this.lobby.players.length === 0) {
      this.lobby.isPlaying = false;
    }

    this.lobby.alertPlayersList();
  }
}

class Lobby {
  id: string;
  players: Player[] = [];
  isPlaying: boolean = false;
  playedCards: number[] = [];
  lifes: number = 0;

  constructor(id: string) {
    this.id = id;
  }

  addPlayer(player: Player) {
    if (!player.ws) return;

    this.players.push(player);

    this.alertPlayersList();
  }

  async initGame() {
    this.isPlaying = true;
    await this.gameloop();
  }

  async gameloop() {
    this.broadcast(2);

    let round = 1;
    this.lifes = this.players.length;
    this.broadcast(5, this.lifes);

    while (round < 8 && this.lifes > 0) {
      this.initRound(round);
      let correctCard = true;
      let hasPlayedAllCards = false;

      while (!hasPlayedAllCards && correctCard) {
        this.broadcast(4, this.playedCards);
        await this.waitForCard();

        const length = this.playedCards.length;
        if (length === 1) {
          //check lowest card
        }

        correctCard =
          this.playedCards[length - 1] > this.playedCards[length - 2] ||
          this.playedCards.length < 2;

        hasPlayedAllCards = this.players.every(
          (player) => player.cards.length === 0
        );
      }

      if (!correctCard) {
        this.playedCards = [];
        this.lifes -= 1;
        this.broadcast(5, this.lifes);
      } else {
        round += 1;
      }
    }

    if (!this.lifes) {
      this.broadcast(6);
      this.gameloop();
    }
  }

  async waitForCard() {
    const length = this.playedCards.length;
    while (length >= this.playedCards.length) {
      await sleep(10);
    }
  }

  alertPlayersList() {
    this.broadcast(
      1,
      this.players.map((player) => {
        return {
          name: player.name,
          readyState: player.readyState,
        };
      })
    );
  }

  broadcast(type: number, data?: any, ws?: WebSocket) {
    this.players.forEach((player) => {
      player.ws.send(
        JSON.stringify({
          type,
          data,
        })
      );
    });
  }

  initRound(roundIndex: number) {
    console.log("initiating round...");

    this.playedCards = [];
    let numbers = [...Array(100).keys()];
    numbers = numbers.sort(() => 0.5 - Math.random());

    //byt ut mot broadcast function
    this.players.forEach((player) => {
      player.cards = numbers.splice(0, roundIndex);
      player.ws.send(JSON.stringify({ type: 3, data: player.cards }));
    });
  }
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
  if (!lobbies[id].isPlaying && !(lobbies[id].players.length >= 4)) {
    lobbies[id].addPlayer(new Player(ctx.request.hostname, ws, lobbies[id]));
    ctx.body = "Lobby is playing";
  }
});

app.use(koaBody());
app.use(koaWs());
app.use(koaCors());
app.use(router.routes());
app.listen(5000);

console.log(`Started server on port ${config.PORT}`);
