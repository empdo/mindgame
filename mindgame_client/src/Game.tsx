import React from "react";
import { ActionType, GameEvent, LobbyState } from "./interfaces";
import { useParams } from "react-router-dom";
import Players from "./Players";
import Lobby from "./Lobby";
import "./game.scss";

const defaultLobbyState: LobbyState = {
  players: [],
  started: false,
  ready: false,
  dealtCards: [],
  yourCards: [],
  lives: 0,
};

export const GameContext = React.createContext<LobbyState>(defaultLobbyState);

const gameStateReducer = <T extends GameEvent>(
  state: LobbyState,
  action: T
) => {
  switch (action.type) {
    case ActionType.PlayerJoin:
      return { ...state, players: action.data };
    case ActionType.Started:
      return { ...state, started: action.data };
    case ActionType.DealtCards:
      return { ...state, dealtCards: action.data };
    case ActionType.YourCards:
      return { ...state, YourCards: action.data };
    case ActionType.Lives:
      return { ...state, lives: action.data };
  }
};

const Game = () => {
  let [ws, setWs] = React.useState<WebSocket | undefined>();

  const [gameReducer, handleGameReducer] = React.useReducer(
    gameStateReducer,
    defaultLobbyState
  );

  const { id } = useParams();
  const url = `ws://localhost:5000/lobby/${id}/`;

  React.useEffect(() => {
    if (id) {
      ws = new WebSocket(url);
      ws.addEventListener("message", (e) => {
        const data = JSON.parse(e.data);
        handleGameReducer(data);
      });

      setWs(ws);
    }
  }, [id]);
  if (!id) return <>Id missing from params</>;

  const toggleReady = () => {
    if (ws) {
      ws.send(JSON.stringify({ type: 1 }));
    }
  };

  const Lives = () => {
    console.log(gameReducer.lives);
    const hearts = Array(gameReducer.lives).fill(
      <img src="/favorite_FILL1_wght400_GRAD0_opsz48.svg" alt="" />
    );
    const darkHearts = Array(
      gameReducer.players.length - gameReducer.lives
    ).fill(
      <img src="/favorite_FILL1_wght400_GRAD0_opsz48.svg" id="dark" alt="" />
    );
    return (
      <>
        {hearts} {darkHearts}
      </>
    );
  };

  return (
    <>
      <GameContext.Provider value={gameReducer}>
        <div id="top-bar">
          <Players />
          {gameReducer.started && <Lives />}
        </div>
        {gameReducer.started ? <div></div> : <Lobby toggle={toggleReady} />}
      </GameContext.Provider>
    </>
  );
};

export default Game;
