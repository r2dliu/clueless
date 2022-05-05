import React, { useState, useEffect, useContext } from "react";
import { CardMedia } from "@mui/material";
import formatLabel from "@/components/helpers/utils";
import { GameContext } from "@/components/helpers/GameContext";
import styles from "./Cards.module.scss";

function Card({ name }) {
  return (
    <div className={styles.card}>
      <CardMedia component={"img"} src={`/static/board/${name}.jpg`} />
    </div>
  );
}

function Cards() {
  const { gameIdContext, clientIdContext, gameStateContext, websocket } =
    useContext(GameContext);

  const [gameId, _setGameId] = gameIdContext;
  const [clientId, _setClientId] = clientIdContext;
  const [gameState, setGameState] = gameStateContext;

  const character = (gameState?.assignments || {})[clientId];
  const cards = (gameState?.cards_to_display || {})[character] || [];

  return (
    gameState.game_phase === 1 && (
      <div className={styles.Cards}>
        test
        {cards.map((name) => (
          <Card key={name} name={name} />
        ))}
      </div>
    )
  );
}

export default Cards;
