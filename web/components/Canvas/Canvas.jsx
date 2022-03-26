import React, { useContext } from "react";
import cn from "classnames";
import Board from "./Board";
import Sidebar from "./Sidebar";
import { GameContext } from "@/components/helpers/GameContext";

import styles from "./Canvas.module.scss";
import MainMenu from "./MainMenu";

function Canvas() {
  const { gameIdContext, _clientIdContext, _gameStateContext } =
    useContext(GameContext);
  const [gameId, _setGameId] = gameIdContext;

  return (
    <div className={cn(styles.Canvas, { [styles.inGame]: !!gameId })}>
      <div className={styles.box}>
        {!gameId && <MainMenu />}
        {gameId && (
          <>
            <Board />
            <Sidebar />
          </>
        )}
      </div>
      {/* todo: Treat the game board as a seperate view and move the sidebar to the game board 
          <div className={styles.sidebar}>sidebar</div> 
      */}
    </div>
  );
}

export default Canvas;
