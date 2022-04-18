import React, { useContext, useEffect, useState } from "react";
import { Button } from "@mui/material";
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

  const rooms = [
    "study",
    "hall",
    "lounge",
    "library",
    "billiard",
    "dining",
    "conservatory",
    "ballroom",
    "kitchen",
  ];

  const weapons = [
    "rope",
    "lead_pipe",
    "knife",
    "wrench",
    "candlestick",
    "revolver",
  ];

  const clientSuspect = (gameState?.assignments || {})[`${clientId}`];
  const [action, setAction] = useState("");
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
        }
      });
    }
  }, [websocket]);

  return (
    <div className={styles.Board}>
      <div>{`you are: ${clientId}`}</div>
      <div>{`gameid: ${gameId}`}</div>
      <div className={styles.state}>{`gamestate: ${JSON.stringify(
        gameState
      )}`}</div>

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
      <br />
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
        <div>
          <Button
            id="move"
            variant="outlined"
            onClick={() => {
              setAction("move");
            }}
          >
            Move
          </Button>
          <Button
            id="suggestion"
            variant="outlined"
            onClick={() => {
              setAction("suggestion");
            }}
          >
            Make Suggestion
          </Button>
          <Button
            id="accusation"
            variant="outlined"
            onClick={() => {
              setAction("accusation");
            }}
          >
            Make Accusation
          </Button>
        </div>
      )}

      {gameState.game_phase === 1 &&
        action == "move" &&
        (gameState?.allowed_moves || {})[clientSuspect].map((move) => {
          return (
            <Button
              key="actual-move"
              variant="outlined"
              onClick={() => {
                websocket?.current?.send(
                  JSON.stringify({
                    type: "move",
                    suspect: clientSuspect,
                    location: move,
                  })
                );
              }}
            >
              {move}
            </Button>
          );
        })}

      {/* todo lots of repeatd code beneath, clean up */}
      {gameState.game_phase === 1 && action == "suggestion" && (
        <div className={styles.suggestion}>
          <div className={styles.column}>
            <b>Select Character</b>
            <br></br>
            {suspects.map((suspect) => (
              <Button
                key={`suspect-${suspect}`}
                variant="outlined"
                onClick={() => {
                  // todo
                }}
              >
                {suspect}
              </Button>
            ))}
          </div>
          <div className={styles.column}>
            <b>Select Weapon</b>
            <br></br>
            {weapons.map((weapon) => (
              <Button
                key={`weapon-${weapon}`}
                variant="outlined"
                onClick={() => {
                  // todo
                }}
              >
                {weapon}
              </Button>
            ))}
          </div>
          <div className={styles.column}>
            <b>Select Room</b>
            <br></br>
            {rooms.map((room) => (
              <Button
                key={`room-${room}`}
                variant="outlined"
                onClick={() => {
                  // todo
                }}
              >
                {room}
              </Button>
            ))}
          </div>
        </div>
      )}

      {gameState.game_phase === 1 && action == "accusation" && (
        <div className={styles.accusation}>
          <div className={styles.column}>
            <b>Select Character</b>
            <br></br>
            {suspects.map((suspect) => (
              <Button
                key={`suspect-${suspect}`}
                variant="outlined"
                onClick={() => {
                  // todo
                }}
              >
                {suspect}
              </Button>
            ))}
          </div>
          <div className={styles.column}>
            <b>Select Weapon</b>
            <br></br>
            {weapons.map((weapon) => (
              <Button
                key={`weapon-${weapon}`}
                variant="outlined"
                onClick={() => {
                  // todo
                }}
              >
                {weapon}
              </Button>
            ))}
          </div>
          <div className={styles.column}>
            <b>Select Room</b>
            <br></br>
            {rooms.map((room) => (
              <Button
                key={`room-${room}`}
                variant="outlined"
                onClick={() => {
                  // todo
                }}
              >
                {room}
              </Button>
            ))}
          </div>
          <Button
            key={`submit-accusation`}
            variant="outlined"
            onClick={() => {
              websocket?.current?.send(
                JSON.stringify({
                  type: "accusation",
                  suspect: "miss_scarlet",
                  room: "study",
                  weapon: "rope",
                })
              );
            }}
          >
            Submit Accusation
          </Button>
        </div>
      )}
    </div>
  );
}

export default Board;
