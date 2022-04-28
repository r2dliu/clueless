import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Chip,
} from "@mui/material";
import formatLabel from "@/components//helpers/utils";
import { GameContext } from "@/components/helpers/GameContext";
import styles from "./Board.module.scss";

function Board() {
  const { gameIdContext, clientIdContext, gameStateContext, websocket } =
    useContext(GameContext);

  const [gameId, _setGameId] = gameIdContext;
  const [clientId, _setClientId] = clientIdContext;
  const [gameState, setGameState] = gameStateContext;

  const suspects = [
    "colonel_mustard",
    "miss_scarlet",
    "professor_plum",
    "mr_green",
    "mrs_white",
    "mrs_peacock",
  ];

  const clientSuspect = (gameState?.assignments || {})[`${clientId}`];
  const [action, setAction] = useState("");
  const [accusation, currentAccusation] = useState({});

  // this is a action history for the incremental demo
  const [history, setHistory] = useState([]);


  useEffect(() => {
    if (websocket.current) {
      websocket.current.addEventListener("message", (message) => {
        console.log(message);
        const new_state = JSON.parse(message?.data);
        console.log(new_state);
        if (!new_state.type) {
          console.log(new_state);
          return;
          // handle error, all messages should have type
        }
        console.log(new_state);
        if (new_state.type === "state") {
          setGameState((prevGameState) => {
            return { ...prevGameState, ...new_state };
          });
        }
      });
    }
  }, [websocket]);

  useEffect(() => {
    if (
      typeof gameState?.previous_move === "string" ||
      gameState?.previous_move instanceof String
    ) {
      console.log(gameState?.previous_move);
      setHistory((history) => [...history, gameState?.previous_move]);
    }

  }, [gameState]);


  return (
    <div className={styles.Board}>
      {/* message dump */}
      <div>{`you are: ${clientId}`}</div>
      <div>{`gameid: ${gameId}`}</div>
      {/*
        <div className={styles.state}>{`gamestate: ${JSON.stringify(
          gameState
        )}`}</div>
      */}

      {history.map((action) => (
        <Chip label={action} variant="outlined" key={action} />
      ))}

      {/* character selection */}
      {gameState.game_phase === 0 && (
        <div>
          <b>Select Character</b>
          <br></br>
          {suspects.map((suspect) => (
            <Button
              key={`suspect-${suspect}`}
              variant="outlined"
              onClick={() => {
                websocket?.current?.send(
                  JSON.stringify({
                    type: "select_character",
                    clientId: clientId,
                    character_token: suspect,
                  })
                );
              }}
            >
              {suspect}
            </Button>
          ))}
        </div>
      )}
      <br />

      {/* starting game */}
      {gameState.game_phase === 0 && (
        <Button
          id="start"
          variant="outlined"
          onClick={() => {
            websocket?.current?.send(
              JSON.stringify({
                type: "start",
              })
            );
          }}
        >
          Start Game
        </Button>
      )}

      {gameState.game_phase === 1 && (
        <b>It is {formatLabel(gameState.current_turn)}&apos;s turn</b>
      )}


      {gameState.game_phase === 2 && (
        <div>Game Over! {formatLabel(gameState?.winner)} won!</div>
      )}
    </div>
  );
}

export default Board;
