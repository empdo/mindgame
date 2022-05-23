import React from "react";
import { ActionType, GameEvent, LobbyState } from "./interfaces";
import { useParams } from "react-router-dom";
import Players from "./Players";
import Lobby from "./Lobby";
import "./game.scss";
import Cards from "./Cards";
//import AnimationEnd from "./AnimationEnd";

const defaultLobbyState: LobbyState = {
  players: [],
  started: false,
  ready: false,
  dealtCards: [],
  yourCards: [],
  lives: 0,
  lost: false,
  round: 0,
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
      return {
        ...state,
        round: action.data.length,
        yourCards: action.data.sort(function (a, b) {
          return a > b ? -1 : 1;
        }),
      };
    case ActionType.Lives:
      return { ...state, lives: action.data };
    case ActionType.Lost:
      return { ...state, lost: action.data };
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
      const ws = new WebSocket(url);
      ws.addEventListener("message", (e) => {
        const data = JSON.parse(e.data);
        handleGameReducer(data);
      });

      setWs(ws);
    }
  }, [id, url]);
  if (!id) return <>Id missing from params</>;

  const toggleReady = () => {
    if (ws) {
      ws.send(JSON.stringify({ type: 1 }));
    }
  };
  const sendCard = (card: number) => {
    if (ws) {
      ws.send(JSON.stringify({ type: 2, data: card }));
    }
  };

  const Lives = () => {
    const hearts = [];
    for (var i = 0; i < gameReducer.lives; i++) {
      hearts.push(
        <img
          src="/favorite_FILL1_wght400_GRAD0_opsz48.svg"
          alt=" "
          key={"heart-" + i}
        />
      );
    }
    const darkHearts = [];
    for (i = 0; i < gameReducer.players.length - gameReducer.lives; i++) {
      darkHearts.push(
        <img
          src="/favorite_FILL1_wght400_GRAD0_opsz48.svg"
          id="dark"
          alt=" "
          key={"darkheart-" + i}
        />
      );
    }
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
        {gameReducer.started ? (
          <Cards sendCard={sendCard} />
        ) : (
          <Lobby toggle={toggleReady} />
        )}
      </GameContext.Provider>
    </>
  );
};

export default Game;
