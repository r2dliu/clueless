import React, { useState, useEffect, useContext } from "react";
import {
  Grid,
  CardMedia,
} from "@mui/material";
import getToken from "@/components/helpers/token";
import { GameContext } from "@/components/helpers/GameContext";
import styles from "./BoardGrid.module.scss";




function Token({ sus, tile_name }) {


  return (
    <div
      style={{
        bottom: 64,
        right: 70
      }}
      className={styles[getToken(sus)]}
    ></div>
  );
}

function Tile({ sus_locs, tile_name }) {


  //Create dictionary of tokens
  var room_tokens = {
    "kitchen": "",
    "study": "",
    "hall": "",
    "lounge": "",
    "library": "",
    "billiard": "",
    "dining": "",
    "conservatory": "",
    "ballroom": "",
    "study_hall": "",
    "lounge_dining": "",
    "hall_lounge": "",
    "dining_kitchen": "",
    "kitchen_ballroom": "",
    "ballroom_conservatory": "",
    "conservatory_library": "",
    "library_study": "",
    "hall_billiard": "",
    "dining_billiard": "",
    "ballroom_billiard": "",
    "library_billiard": "",
  }

  //assign suspect token to corresponding location in room_tokens dictionary
  for (var suspect in sus_locs) { room_tokens[sus_locs[suspect]] = suspect; }

  const suspects_on_tile = [room_tokens[`${tile_name}`]];

  return (
    < Grid item xs={2}
      sx={{
        position: 'relative'
      }} >

      <CardMedia component={"img"} src={`/static/tiles/${tile_name}.jpg`} />
      {suspects_on_tile.map((sus) => (
        <Token sus={sus} tile_name={tile_name} />
      ))}
    </Grid >

  );
}

function BoardGrid() {
  const { gameIdContext, clientIdContext, gameStateContext, websocket } =
    useContext(GameContext);

  const [gameId, _setGameId] = gameIdContext;
  const [clientId, _setClientId] = clientIdContext;
  const [gameState, setGameState] = gameStateContext;
  const [history, setHistory] = useState([]);
  const [assignments, setAssignments] = useState({});
  const suspectLocs = gameState?.suspect_locations;

  const tiles = [
    "study",
    "study_hall",
    "hall",
    "hall_lounge",
    "lounge", //end row 1
    "library_study",
    "blank",
    "hall_billiard",
    "blank",
    "lounge_dining", // end row 2
    "library",
    "library_billiard",
    "billiard",
    "dining_billiard",
    "dining", // end row 3
    "conservatory_library",
    "blank",
    "ballroom_billiard",
    "blank",
    "dining_kitchen", // end row 4
    "conservatory",
    "ballroom_conservatory",
    "ballroom",
    "kitchen_ballroom",
    "kitchen"
  ];


  return (
    <div className={styles.BoardGrid}>
      <Grid
        container
        spacing={0}
        columns={10}
        width={'75%'}>

        {tiles.map((tile) => (
          <Tile sus_locs={suspectLocs} tile_name={tile}></Tile>
        ))}

      </Grid>
    </div >
  );
}

export default BoardGrid;
