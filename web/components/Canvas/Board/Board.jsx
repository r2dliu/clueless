import React, { useContext } from "react";
import { GameContext } from "@/components/helpers/GameContext";
import styles from "./Board.module.scss";

function Board() {
  const { gameIdContext, clientIdContext, gameStateContext } =
    useContext(GameContext);

  const [gameId, _setGameId] = gameIdContext;
  const [clientId, _setClientId] = clientIdContext;

  return (
    <div className={styles.Board}>
      <div>{`you are: ${clientId}`}</div>
      <div>{`gameid: ${gameId}`}</div>
    </div>
  );
}

export default Board;
