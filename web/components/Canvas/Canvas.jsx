import React, { useContext, useState } from "react";
import cn from "classnames";
import Board from "./Board";
import Sidebar from "./Sidebar";
import { GameContext } from "@/components/helpers/GameContext";

import styles from "./Canvas.module.scss";
import MainMenu from "./MainMenu";

import { createTheme, ThemeProvider } from '@mui/material/styles';
const theme = createTheme(
  // TODO: pick a theme https://mui.com/material-ui/customization/color/
  {
    palette: {
      primary: {
        main: '#00695c',
      },
      secondary: {
        main: '#4db6ac',
      },
    },
  }
);

function Canvas() {
  const { gameIdContext, _clientIdContext, _gameStateContext } =
    useContext(GameContext);
  const [gameId, _setGameId] = gameIdContext;
  
  const [rulesOpen, setRulesOpen] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <div className={cn(styles.Canvas, { [styles.inGame]: !!gameId })}>
        <div className={styles.container}>
          {!gameId && <MainMenu />}
          {gameId && (
            <>
              <Board rulesOpen={rulesOpen} setRulesOpen={setRulesOpen}/>
              <Sidebar setRulesOpen={setRulesOpen} />
            </>
          )}
        </div>
        {/* todo: Treat the game board as a seperate view and move the sidebar to the game board 
          <div className={styles.sidebar}>sidebar</div> 
      */}
      </div>
    </ThemeProvider>
  );

}

export default Canvas;
