import React from "react";
import "./cards.scss";
import { GameContext } from "./Game";
import { LobbyState } from "./interfaces";

const Cards = (props: { sendCard: (card: number) => void }) => {
  const gameData = React.useContext(GameContext);

  const DealtCards = () => {
    return (
      <>
        {gameData.dealtCards.map((card) => {
          return (
            <div className="card">
              <h2>{card}</h2>
            </div>
          );
        })}
      </>
    );
  };

  const YourCards = () => {
    return (
      <>
        {gameData.yourCards.map((card) => {
          return (
            <div
              className="card"
              onClick={() => {
                props.sendCard(card);
                gameData.yourCards = gameData.yourCards.filter(
                  (_card) => _card !== card
                );
              }}
            >
              <h2>{card}</h2>
            </div>
          );
        })}
      </>
    );
  };

  return (
    <>
      <div id="dealt-cards">
        <DealtCards />
      </div>
      <div id="your-cards">
        <span id="spacer" />
        <YourCards />
      </div>
    </>
  );
};

export default Cards;
