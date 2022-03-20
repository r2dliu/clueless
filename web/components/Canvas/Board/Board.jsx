import React from "react";
import styles from "./Board.module.scss";

function Board({ gameId }) {
  return <div className={styles.Board}>{`gameid: ${gameId}`}</div>;
}

export default Board;
