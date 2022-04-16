import React, { useContext, useState, useRef, useEffect } from "react";
import { GameContext } from "@/components/helpers/GameContext";
import styles from "./Board.module.scss";
import { Button } from "@mui/material";

function Board() {
  const [messages, setMessages] = useState([]);
  const { gameIdContext, clientIdContext, gameStateContext, websocket } =
    useContext(GameContext);

  const [gameId, _setGameId] = gameIdContext;
  const [clientId, _setClientId] = clientIdContext;
  const [gameState, _setGameState] = gameStateContext;

  const gameStateRef = useRef();
  const [startGameError, setStartGameError] = useState("");

  useEffect(() => {
    if (websocket.current) {
      websocket.current.addEventListener("state", (message) => {
        console.log(message);
        const parsed_msg = JSON.parse(message?.data);
        if (parsed_msg?.state && parsed_msg?.clientId) {
          setMessages((prevMessages) => [
            ...prevMessages,
            `${parsed_msg.clientId} : ${parsed_msg.state}`,
          ]);
        }
      });
    }
  }, [websocket]);

  const startGame = async () => {
    console.log(`starting game with ${'placeholderLOL'}/6 players`);
    const response = await fetch("/start_game", {
      method: "GET", headers: {
        "Content-type": "application/json"
      }
    });
    if (!response.ok) {
      setStartGameError(response.statusText);
    } else {
      const state = await response.json();
      _setGameState(state);
    }
  };

  return (
    <div className={styles.Board}>
      <div>{`you are: ${clientId}`}</div>
      <div>{`gameid: ${gameId}`}</div>
      <div>{`state: ${gameState}`}</div>

      <div>
        <b>start game</b>
        {messages.map((message, i) => (
          <p key={i}>{message}</p>
        ))}
        <Button
          id="start_game"
          variant="outlined"
          onClick={startGame}
        />
      </div>

      <div>
        <b>make move</b>
        {messages.map((message, i) => (
          <p key={i}>{message}</p>
        ))}
        <Button
          id="make_move"
          variant="outlined"
          onClick={() => {
            websocket?.current?.send(
              JSON.stringify({
                state: gameState,
                clientId: clientId,
              })
            );
          }}
        />
      </div>

      <div>
        <b>make accusation</b>
        {messages.map((message, i) => (
          <p key={i}>{message}</p>
        ))}
        <Button
          id="make_accusation"
          variant="outlined"
          onClick={() => {
            websocket?.current?.send(
              JSON.stringify({
                state: gameState,
                clientId: clientId,
              })
            );
          }}
        />
      </div>
    </div >
  );
}

export default Board;
