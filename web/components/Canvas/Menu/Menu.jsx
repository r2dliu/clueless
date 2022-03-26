import React, { useState, useRef } from "react";
import TextField from "@mui/material/TextField";
import styles from "./Menu.module.scss";

import {
  Button,
  Card,
  CardContent,
  Container,
  Typography,
} from "@mui/material";

function Menu({ setGameId }) {
  const textFieldRef = useRef();
  const [newGameError, setNewGameError] = useState("");

  const createNewGame = async () => {
    console.log("creating new game");
    const response = await fetch("/new_game");
    if (!response.ok) {
      setNewGameError(response.statusText);
    } else {
      const gameId = await response.json();
      console.log(gameId);
      setGameId(gameId);
    }
  };

  const joinGame = () => {
    // todo connect client
    console.log(`todo join game ${textFieldRef.current.value}`);
  };

  return (
    <Card className={styles.Menu}>
      <CardContent>
        <Typography className={styles.menuTitle}>
          Welcome to Clueless
        </Typography>
        <Container className={styles.createGame}>
          <Button variant="contained" size="large" onClick={createNewGame}>
            Create New Game
          </Button>
          {/* todo show error if unable to create new game */}
        </Container>
        <div> --- or --- </div>
        <Container className={styles.joinsGame}>
          <TextField id="standard-basic" label="Game Id" variant="standard" />
          <Button variant="contained" size="large">
            Join Game
          </Button>
          {/* todo show error if unable to join */}
        </Container>
      </CardContent>
    </Card>
  );
}

export default Menu;
