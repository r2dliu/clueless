import React, { useContext, useEffect, useState } from "react";
import {
  Button,

} from "@mui/material";
import formatLabel from "@/components/helpers/utils";
import getToken from "@/components/helpers/token";
import { GameContext } from "@/components/helpers/GameContext";
import styles from "./Board.module.scss";
import Rules from "../Rules/Rules";

import BoardGrid from "@/components/helpers/grid";
import Cards from "./Cards";
import CharSelect from "./CharSelect";


function Board(props) {
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

  // { suspect: player }
  const [assignments, setAssignments] = useState({});

  // this is a action history for the incremental demo
  const [history, setHistory] = useState([]);

  const openRulesDialog = () => props.setRulesOpen(true);
  const closeRulesDialog = () => props.setRulesOpen(false);

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
      {gameState.game_phase === 0 && (
        <div>{`you are: ${clientId}`}</div>
      )}
      {gameState.game_phase === 0 && (
        <div>{`gameid: ${gameId}`}</div>
      )}
      <br />


      {/* character select images */}
      {gameState.game_phase === 0 && (
        <div>{`Select Your Character`}</div>
      )}
      < CharSelect />


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


      {gameState.game_phase === 1 && props.rulesOpen && (
        <Rules rulesOpen={props.rulesOpen}
          closeRulesDialog={closeRulesDialog}
          openRulesDialog={openRulesDialog} />
      )}


      {/* display board */}
      {gameState.game_phase === 1 && (

        <div style={{
          position: 'relative',
          bottom: 0,
          justifyContent: 'center',
          left: 120, // TODO: center the board properly
        }} >
          < BoardGrid />
        </div>
      )
      }

      {/* display current turn text and token */}
      {
        gameState.game_phase === 1 && (
          <b>It is {formatLabel(gameState.current_turn)}&apos;s turn</b>

        )
      }
      {
        gameState.game_phase === 1 && (
          <div className={styles[getToken(gameState.current_turn)]}>
          </div>

        )
      }

      {
        gameState.game_phase === 2 && (
          <div>Game Over! {formatLabel(gameState?.winner)} won!</div>
        )
      }

      {
        gameState.game_phase === 3 && (
          <div>Game Over! Nobody wins!</div>
        )
      }

      <Cards />
    </div >
  );
}

export default Board;
