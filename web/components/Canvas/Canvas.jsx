import React, { useState, useCallback, useEffect, useRef } from "react";
import Board from "./Board";

import styles from "./Canvas.module.scss";
import Menu from "./Menu/Menu";

function Canvas() {
  const textFieldRef = useRef();
  const websocket = useRef(null);
  const [gameId, setGameId] = useState("");
  const [error, setError] = useState("");

  return (
    <div className={styles.Canvas}>
      <div className={styles.box}>
        {!gameId && <Menu setGameId={setGameId} />}
        {gameId && <Board gameId={gameId} />}
      </div>
      {/* todo: Treat the game board as a seperate view and move the sidebar to the game board 
          <div className={styles.sidebar}>sidebar</div> 
      */}
    </div>
  );
}

export default Canvas;
