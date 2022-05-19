import React from "react";
import { user } from "./interfaces";
import { useParams } from "react-router-dom";

const Lobbies = () => {
  let [ws, setWs] = React.useState<WebSocket | undefined>();
  const [users, setUsers] = React.useState<user[]>([]);
  const [started, setStarted] = React.useState(false);
  const [ready, setReady] = React.useState(false);
  const [dealtCards, setDealtCards] = React.useState([]);
  const [yourCards, setYourCards] = React.useState([]);
  const [lifes, setLifes] = React.useState([]);

  const { id } = useParams();
  const url = `ws://localhost:5000/lobby/${id}/`;

  React.useEffect(() => {
    if (id) {
      setWs(new WebSocket(url));
    }
  }, [id]);

  if (!id) return <>Id missing from params</>;

  if (ws) {
    ws.onmessage = (e) => {
      const message = JSON.parse(e.data);
      if (message.type === 1) {
        setUsers(message.data as user[]);
      } else if (message.type === 2) {
        setStarted(true);
      } else if (message.type === 3) {
        setYourCards(message.data);
      } else if (message.type === 4) {
        setDealtCards(message.data);
      } else if (message.type === 5) {
        setLifes(message.data);
      }
    };
  }

  const toggleReady = async () => {
    if (ws !== undefined) {
      console.log("toggle ready");
      ws.send(JSON.stringify({ type: 1, data: null }));
    }
  };

  const DealtCards = (): JSX.Element => {
    return (
      <>
        {dealtCards.map((card) => (
          <h1>{card}</h1>
        ))}
      </>
    );
  };

  const YouCards = (): JSX.Element => {
    const sendCard = (card: number) => {
      if (ws) {
        ws.send(JSON.stringify({ type: 2, data: card }));
        setYourCards(yourCards.filter((_card) => _card !== card));
      }
    };

    return (
      <>
        {yourCards.map((card) => (
          <>
            <h1>{card}</h1>
            <button onClick={() => sendCard(card)}>Put this one!</button>
          </>
        ))}
      </>
    );
  };

  return (
    <>
      {JSON.stringify(users)}
      <button
        onClick={(e) => {
          e.preventDefault();
          toggleReady();
          setReady(!ready);
        }}
      >
        ready
      </button>
      <h2>{ready ? "ready" : "not ready"}</h2>
      {started ? (
        <div>
          <h1>Started</h1>
          <DealtCards />
          <YouCards />
          <h2>lifes: {lifes}</h2>
        </div>
      ) : (
        <div>
          <h1>Waiting for players to ready up</h1>
        </div>
      )}
    </>
  );
};

export default Lobbies;
