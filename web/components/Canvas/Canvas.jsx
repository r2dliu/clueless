import React, { useState, useCallback, useEffect, useRef } from "react";
import TextField from "@mui/material/TextField";
import Board from "./Board";
import MainMenu from "./MainMenu";

import styles from "./Canvas.module.scss";

function Canvas() {
  const textFieldRef = useRef();
  const websocket = useRef(null);
  const [gameId, setGameId] = useState("");
  const [error, setError] = useState("");

  return (
    <div className={styles.Canvas}>
      <div className={styles.box}>
        {!gameId && <MainMenu setGameId={setGameId} />}
        {gameId && <Board gameId={gameId} />}
      </div>
      <div className={styles.sidebar}>sidebar</div>
    </div>
  );
}

export default Canvas;
