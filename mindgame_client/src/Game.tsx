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
      return { ...state, Lives: action.data };
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
        console.log(data.type);
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

  return (
    <>
      <GameContext.Provider value={gameReducer}>
        <Players />
        <Lobby toggle={toggleReady} />
        {gameReducer.started ? (
          <div>
            <h1>Started</h1>
            <h2>lifes: {gameReducer.lives}</h2>
          </div>
        ) : (
          <div></div>
        )}
      </GameContext.Provider>
    </>
  );
};

export default Game;
