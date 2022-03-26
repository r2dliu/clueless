import React, { useState, useCallback, useEffect, useRef } from "react";
import Board from "./Board";

import styles from "./Canvas.module.scss";
import MainMenu from "./MainMenu";

function Canvas() {
  const textFieldRef = useRef();
  const websocket = useRef(null);
  const [gameId, setGameId] = useState("");
  const [clientId, setClientId] = useState("");
  const [error, setError] = useState("");

  return (
    <div className={styles.Canvas}>
      <div className={styles.box}>
        {!gameId && (
          <MainMenu setGameId={setGameId} setClientId={setClientId} />
        )}
        {gameId && <Board gameId={gameId} />}
      </div>
      {/* todo: Treat the game board as a seperate view and move the sidebar to the game board 
          <div className={styles.sidebar}>sidebar</div> 
      */}
    </div>
  );
}

export default Canvas;
