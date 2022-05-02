import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Box,
  Chip,
} from "@mui/material";
import formatLabel from "@/components/helpers/utils";
import getToken from "@/components/helpers/token";
import { GameContext } from "@/components/helpers/GameContext";
import styles from "./Board.module.scss";

import BoardGrid from "@/components/helpers/grid";
import Cards from "./Cards";

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
  const [accusation, currentAccusation] = useState({});

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
        } else if (new_state.type === "turn_error") {
          alert("Error: It is not your turn!");
        }
      });
    }
  }, [websocket]);

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

      {/* display board */}
      {gameState.game_phase === 1 && (

        <div>
          < BoardGrid suspectLocs={gameState?.suspect_locations}
          />
        </div>
      )
      }

      {/* display current turn text and token */}
      {
        gameState.game_phase === 1 && (
          <b>It is {formatLabel(gameState.current_turn)}&apos;s turn</b>

        )
      }
      {gameState.game_phase === 1 && (
        <div className={styles[getToken(gameState.current_turn)]}>
        </div>

      )
      }

      {
        gameState.game_phase === 2 && (
          <div>Game Over! {formatLabel(gameState?.winner)} won!</div>
        )
      }

      <Cards />
    </div >
  );
}

export default Board;
