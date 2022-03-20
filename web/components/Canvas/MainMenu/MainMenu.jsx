import React, { useState, useCallback, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button, TextField } from "@mui/material";
import styles from "./MainMenu.module.scss";

function MainMenu({ setGameId }) {
  const textFieldRef = useRef();
  const [newGameError, setNewGameError] = useState("");

  const createNewGame = async () => {
    console.log("creating new game");
    const response = await fetch("/new_game");
    if (!response.ok) {
      setNewGameError(response.statusText);
    } else {
      const gameId = await response.json();
      console.log(gameId);
      setGameId(gameId);
    }
  };

  const joinGame = () => {
    // todo connect client
    console.log(`todo join game ${textFieldRef.current.value}`);
  };

  return (
    <div className={styles.MainMenu}>
      <div className={styles.buttons}>
        <div className={styles.newGame}>
          <Button variant="contained" onClick={createNewGame}>
            Create New Game
          </Button>
          {/* todo show error if unable to create new game */}
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
              onSubmit={joinGame}
            />
          </div>
          <div>
            <Button variant="contained" onClick={joinGame}>
              Join
            </Button>
          </div>
          {/* todo show error if unable to join */}
        </div>
      </div>
    </div>
  );
}

export default MainMenu;
