"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const koa_body_1 = __importDefault(require("koa-body"));
const koa_easy_ws_1 = __importDefault(require("koa-easy-ws"));
const router_1 = __importDefault(require("@koa/router"));
const cors_1 = __importDefault(require("@koa/cors"));
const app = new koa_1.default();
const router = new router_1.default();
const config = {
    PORT: 5000,
};
let lobbies = {};
class Player {
    constructor(name, ws) {
        this.name = name;
        this.ws = ws;
        this.readyState = false;
    }
}
class Lobby {
    constructor(id) {
        this.players = [];
        this.addPlayer = (player) => {
            if (!player.ws)
                return;
            this.players.push(player);
            player.ws.onclose = () => this.socketClose(player);
            player.ws.onmessage = (e) => this.handleMessage(e, player);
            this.alertPlayersList();
        };
        this.handleMessage = (e, player) => {
            if (!e.data)
                return;
            const { type, data } = JSON.parse(e.data);
            if (type === 1) {
                player.readyState = !player.readyState;
                if (this.players.every((player) => player.readyState === true)) {
                    this.gameloop();
                }
            }
            this.alertPlayersList();
        };
        this.socketClose = (player) => {
            this.players = this.players.filter((p) => p.ws !== player.ws);
            this.alertPlayersList();
        };
        this.gameloop = () => {
            this.isPlaying = true;
            //skicka att de börjar till varej spelare
            //de bygger sin scene
            //de skickar okej tillbaka
            //
            //randomiza fram kort, dela ut dem
            //lyssna efter requests och hantera det, antingen låt dem spela eller starta om
            //lyckas man så går man upp i level och det startar om
            //
            this.players.forEach((player) => {
                player.ws.onmessage = (e) => this.handleMessageGameLoop(e);
                player.ws.send(JSON.stringify({ type: 2 }));
            });
        };
        this.handleMessageGameLoop = (e) => {
            const { type, data } = JSON.parse(e.data);
        };
        this.alertPlayersList = () => {
            //change to only update the thing that has changed
            this.players.forEach((player) => {
                player.ws.send(JSON.stringify({
                    type: "1",
                    data: this.players.map((player) => {
                        return {
                            name: player.name,
                            readyState: player.readyState,
                        };
                    }),
                }));
            });
            console.log(lobbies);
        };
        this.id = id;
        this.isPlaying = false;
    }
}
router.get("/", (ctx) => {
    ctx.body = "mindgame";
});
router.get("/lobbies", (ctx) => {
    ctx.body = Object.keys(lobbies);
});
router.get("/lobby/:id/", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    //connect to lobby
    const id = ctx.params.id;
    if (!ctx.ws || !id)
        return;
    const ws = yield ctx.ws();
    if (!lobbies[id] && !lobbies[id].isPlaying) {
        console.log(`Creating lobby with id: ${id}`);
        lobbies[id] = new Lobby(id);
    }
    lobbies[id].addPlayer(new Player(ctx.request.hostname, ws));
}));
app.use((0, koa_body_1.default)());
app.use((0, koa_easy_ws_1.default)());
app.use((0, cors_1.default)());
app.use(router.routes());
app.listen(5000);
console.log(`Started server on port ${config.PORT}`);
