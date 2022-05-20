import React from "react";
import { GameContext } from "./Game";

const Lobby = (props: { toggle: () => void }) => {
  const gamedata = React.useContext(GameContext);
  const [ready, notReady] = React.useState(false);
  const accesible = gamedata.players.length <= 0;
  return (
    <div id="lobby">
      {accesible ? (
        <h1>Lobby is either currently playing or already contains 4 players</h1>
      ) : (
        <button
          onClick={(e) => {
            e.preventDefault();
            props.toggle();
            notReady(!ready);
          }}
        >
          {ready ? "Unready" : "Ready"}
        </button>
      )}
    </div>
  );
};

export default Lobby;
