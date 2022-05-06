import React, { useState, useEffect, useContext } from "react";
import {
  Card,
  CardMedia,
  ButtonBase,
} from "@mui/material";
import { GameContext } from "@/components/helpers/GameContext";
import styles from "./CharSelect.module.scss";


function SuspectImage({ name }) {
  return (
    <div className={styles.suspect}>
      <CardMedia component={"img"} src={`/static/board/${name}.jpg`} />
    </div>
  );
}

function CharSelect() {
  const { gameIdContext, clientIdContext, gameStateContext, websocket } =
    useContext(GameContext);

  const [gameId, _setGameId] = gameIdContext;
  const [clientId, _setClientId] = clientIdContext;
  const [gameState, setGameState] = gameStateContext;
  const [history, setHistory] = useState([]);
  const [assignments, setAssignments] = useState({});
  const suspects = [
    "colonel_mustard",
    "miss_scarlet",
    "professor_plum",
    "mr_green",
    "mrs_white",
    "mrs_peacock",
  ];

  useEffect(() => {
    if (
      typeof gameState?.previous_move === "string" ||
      gameState?.previous_move instanceof String
    ) {
      console.log(gameState?.previous_move);
      setHistory((history) => [...history, gameState?.previous_move]);
    }

    if (gameState?.game_phase === 0) {
      let newAssignments = {};
      for (const player in gameState?.assignments) {
        newAssignments[`${gameState?.assignments[player]}`] = player;
      }
      setAssignments(newAssignments);
      console.log(newAssignments);
    }

  }, [gameState]);


  return (
    gameState.game_phase === 0 && (
      <div className={styles.CharSelect}>
        {suspects.map((suspect) => (
          <Card sx={{
          }}>
            <ButtonBase
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
              <SuspectImage name={suspect}></SuspectImage>

            </ButtonBase>
          </Card>
        ))
        }
      </div >
    )
  );
}

export default CharSelect;
