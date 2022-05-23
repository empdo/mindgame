import React from "react";
import "./cards.scss";
import { GameContext } from "./Game";

const Cards = (props: { sendCard: (card: number) => void }) => {
  const gameData = React.useContext(GameContext);
  const [newRound, setNewRound] = React.useState(true);

  React.useEffect(() => {
    setNewRound(true);
    const sleep = async (duration: number) =>
      await new Promise<void>((resolve) => setTimeout(resolve, duration));

    sleep(3000).then(() => {
      setNewRound(false);
    });
  }, [gameData.round]);

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

  const RoundThing = () => {
    return (
      <div id="newRound">
        <h1>Round {gameData.round}</h1>
      </div>
    );
  };

  return (
    <>
      {newRound ? (
        <RoundThing />
      ) : (
        <>
          <div id="dealt-cards">
            <DealtCards />
          </div>
          <span id="spacer" />
          <div id="your-cards">
            <YourCards />
          </div>
        </>
      )}
    </>
  );
};

export default Cards;
