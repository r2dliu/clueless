import React, { useState, useEffect, useContext } from "react";
import {
  Grid,
  CardMedia,
} from "@mui/material";
import getToken from "@/components/helpers/token";
import { GameContext } from "@/components/helpers/GameContext";
import styles from "./BoardGrid.module.scss";




function Token({ sus, tile_name }) {
  var y_coord = 64;
  var x_coord = 70;

  if (sus === 'colonel_mustard') {
    y_coord = 64;
    x_coord = 70;
  }
  else if (sus === 'miss_scarlet') {
    y_coord = 64;
    x_coord = 80;
  }
  else if (sus === 'professor_plum') {
    y_coord = 64;
    x_coord = 90;
  }
  else if (sus === 'mr_green') {
    y_coord = 74;
    x_coord = 70;
  }
  else if (sus === 'mrs_white') {
    y_coord = 84;
    x_coord = 80;
  }
  else if (sus === 'mrs_peacock') {
    y_coord = 94;
    x_coord = 90;
  }
  else if (sus === '') {
    y_coord = 64;
    x_coord = 76;
  }

  return (
    <div
      style={{
        bottom: y_coord,
        right: x_coord,
      }}
      className={styles[getToken(sus)]}
    ></div>
  );
}

function Tile({ sus_locs, tile_name }) {

  // get all suspects on tile
  let suspects_on_tile = [];
  for (var suspect in sus_locs) {

    if (sus_locs[suspect] == tile_name) {
      suspects_on_tile.push(suspect);
    }

  }

  return (
    < Grid item xs={2}
      sx={{
        position: 'relative'
      }} >

      <CardMedia component={"img"} src={`/static/tiles/${tile_name}.jpg`} />
      {suspects_on_tile.map((sus) => (
        <Token sus={sus} tile_name={tile_name} key={sus} />
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
          <Tile sus_locs={suspectLocs} tile_name={tile} key={tile}></Tile>
        ))}

      </Grid>
    </div >
  );
}

export default BoardGrid;
