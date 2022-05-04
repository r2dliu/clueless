import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Chip,
} from "@mui/material";
import formatLabel from "@/components/helpers/utils";
import { GameContext } from "@/components/helpers/GameContext";
import styles from "./Board.module.scss";
import Rules from "../Rules/Rules";

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
  const [rulesOpen, setRulesOpen] = useState(false);

  // { suspect: player }
  const [assignments, setAssignments] = useState({});

  // this is a action history for the incremental demo
  const [history, setHistory] = useState([]);

  const openRulesDialog = () => setRulesOpen(true);
  const closeRulesDialog = () => setRulesOpen(false);

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
        else if (new_state.type === "turn_error") {
          alert("Error: It is not your turn!");
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

    if(gameState?.game_phase === 0) {
      let newAssignments = {};
      for (const player in gameState?.assignments) {
        newAssignments[`${gameState?.assignments[player]}`] = player;
      }
      setAssignments(newAssignments);
      console.log(newAssignments);
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
              disabled={assignments[suspect]}
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
            openRulesDialog();
          }}
        >
          Start Game
        </Button>
      )}


      {gameState.game_phase === 1 && rulesOpen && (
        <Rules rulesOpen={rulesOpen}
                closeRulesDialog={closeRulesDialog}
                openRulesDialog={openRulesDialog}/>
      )}

      {gameState.game_phase === 1 && !rulesOpen && (
          <b>It is {formatLabel(gameState.current_turn)}&apos;s turn</b>
      )}


      {gameState.game_phase === 2 && (
        <div>Game Over! {formatLabel(gameState?.winner)} won!</div>
      )}
    </div>
  );
}

export default Board;
