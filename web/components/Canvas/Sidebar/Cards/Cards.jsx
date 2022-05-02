import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  ButtonGroup,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import formatLabel from "@/components/helpers/utils";
import { GameContext } from "@/components/helpers/GameContext";
import styles from "../Sidebar.module.scss";

function Controls() {
  const { gameIdContext, clientIdContext, gameStateContext, websocket } =
    useContext(GameContext);

  const [gameId, _setGameId] = gameIdContext;
  const [clientId, _setClientId] = clientIdContext;
  const [gameState, setGameState] = gameStateContext;

  const character = gameState?.assignments[clientId];
  const cards = gameState?.player_cards[character];
  console.log(cards);

  return (
    gameState.game_phase === 1 && <div className={styles.Cards}>test2</div>
  );
}

export default Controls;
