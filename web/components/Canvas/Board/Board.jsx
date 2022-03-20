import React, { useState, useCallback, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button, TextField } from "@mui/material";
import styles from "./Board.module.scss";

function Board() {
  const textFieldRef = useRef();
  const [gameId, setGameId] = useState("");
  const [error, setError] = useState("");

  const createNewGame = async () => {
    console.log("creating new game");
    const response = await fetch("/new_game");
    if (!response.ok) {
      setError(response.statusText);
    } else {
      const gameId = await response.json();
      setGameId(gameId);
      // TODO: connect client
    }
  };

  const joinGame = () => {
    // todo connect client
    console.log(`todo join game ${textFieldRef.current.value}`);
  };

  let board;
  if (!gameId) {
    board = (
      <div className={styles.buttons}>
        <div className={styles.newGame}>
          <Button variant="contained" onClick={createNewGame}>
            Create New Game
          </Button>
        </div>
        <div> --- or --- </div>
        <div className={styles.joinGame}>
          <div>
            <TextField
              className={styles.textField}
              id="outlined-basic"
              label="Game ID"
              variant="outlined"
              inputRef={textFieldRef}
            />
          </div>

          <div>
            <Button variant="contained" onClick={joinGame}>
              Join
            </Button>
          </div>
        </div>
      </div>
    );
  } else {
    board = <div>{`gameid: ${gameId}`}</div>;
  }

  return <div className={styles.Board}>{board}</div>;
}

export default Board;
