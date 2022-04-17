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
  const connections = {};

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

  // This is currently unused but meant to keep track of how many players are in the lobby
  const updateLobby = async () => {
    const response = await fetch("/get_connections");
    if (!response.ok) {
      setStartGameError(response.statusText);
    } else {
      const players = await response.json();
      console.log(players);
      connections = players;
    }
  };

  // Define each button separately below so we can dynamically show or hide them
  // Checks game_phase and assigns the div if the phase is correct, or a blank string if not
  const characterSelection = (gameState.game_phase == 0) ? (
    <div>
      <b>Select Character</b><br></br>
      {messages.map((message, i) => (
        <p key={i}>{message}</p>
      ))}
      <Button
        id="select_character"
        variant="outlined"
        onClick={() => {
          websocket?.current?.send(
            JSON.stringify({
              clientId: clientId,
              token: "miss_scarlet",
            })
          );
        }}
      >Miss Scarlet</Button>
      <Button
        id="select_character"
        variant="outlined"
        onClick={() => {
          websocket?.current?.send(
            JSON.stringify({
              clientId: clientId,
              token: "colonel_mustard",
            })
          );
        }}
      >Colonel Mustard</Button>
      <Button
        id="select_character"
        variant="outlined"
        onClick={() => {
          websocket?.current?.send(
            JSON.stringify({
              clientId: clientId,
              token: "professor_plum",
            })
          );
        }}
      >Professor Plum</Button>
      <Button
        id="select_character"
        variant="outlined"
        onClick={() => {
          websocket?.current?.send(
            JSON.stringify({
              clientId: clientId,
              token: "mr_green",
            })
          );
        }}
      >Mr. Green</Button>
      <Button
        id="select_character"
        variant="outlined"
        onClick={() => {
          websocket?.current?.send(
            JSON.stringify({
              clientId: clientId,
              token: "mrs_white",
            })
          );
        }}
      >Mrs. White</Button>
      <Button
        id="select_character"
        variant="outlined"
        onClick={() => {
          websocket?.current?.send(
            JSON.stringify({
              clientId: clientId,
              token: "mrs_peacock",
            })
          );
        }}
      >Mrs. Peacock</Button>
    </div>
  ) : "";

  const button_startGame = (gameState.game_phase == 0) ? (
    <div>
      <b>Start Game</b>
      {messages.map((message, i) => (
        <p key={i}>{message}</p>
      ))}
      <Button
        id="start_game"
        variant="outlined"
        onClick={startGame}
      />
    </div>
  ) : "";

  const button_makeMove = (gameState.game_phase == 1) ? (
    <div>
      <b>Make Move</b>
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
  ) : "";

  const button_makeAccusation = (gameState.game_phase == 1) ? (
    <div>
      <b>Make Accusation</b>
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
  ) : "";

  return (
    <div className={styles.Board}>
      <div>{`you are: ${clientId}`}</div>
      <div>{`gameid: ${gameId}`}</div>
      <div>{`state: ${JSON.stringify(gameState)}`}</div>
      <div>{`players: ${JSON.stringify(connections)}`}</div>

      {characterSelection}
      {button_startGame}
      {button_makeMove}
      {button_makeAccusation}

    </div >
  );
}

export default Board;
