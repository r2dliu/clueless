import React, { useState, useEffect, useContext } from "react";
import { GameContext } from "@/components/helpers/GameContext";
import styles from "./Cards.module.scss";
import PropTypes, { array, func } from 'prop-types';
import { CardActionArea, CardMedia } from "@mui/material";

function Card({ name }) {
  return (
    <div className={styles.card}>
      <CardMedia component={"img"} src={`/static/board/${name}.jpg`} />
    </div>
  );
}

function Cards(props) {
  const { gameIdContext, clientIdContext, gameStateContext, websocket } =
    useContext(GameContext);

  const [gameId, _setGameId] = gameIdContext;
  const [clientId, _setClientId] = clientIdContext;
  const [gameState, setGameState] = gameStateContext;

  const character = (gameState?.assignments || {})[clientId];
  const cards = props.cards ?  props.cards : (gameState?.cards_to_display || {})[character] || [];

  return (
    gameState.game_phase === 1 && (
      <div className={styles.Cards}>
        {cards.map((name) => (
          <CardActionArea disabled={!props?.isClickable}
            onClick={() => {
              if(props?.isClickable) {
                props?.onClick(name)
              }
            }}
            key={name}>
            <Card key={name} name={name} />
          </CardActionArea>
        ))}
      </div>
    )
  );
}

Cards.propTypes = {
  isClickable: PropTypes.bool,
  onClick: func,
  validCards: array,
}

export default Cards;
