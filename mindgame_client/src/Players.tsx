import React from "react";
import { GameContext } from "./Game";

const Players = () => {
  const gamedata = React.useContext(GameContext);
  const players = gamedata.players;

  const GetPlayers = () => {
    return (
      <div id="players-container">
        {players.map((player) => {
          return (
            <div key={player.name}>
              <h3>
                {player.name} {player.local && "(you)"}
              </h3>
              {!gamedata.started && (
                <h3>
                  <strong>{player.readyState ? "Ready" : "Not ready"}</strong>
                </h3>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return <GetPlayers />;
};

export default Players;
