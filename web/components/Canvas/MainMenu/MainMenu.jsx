import React, { useState, useContext, useRef } from "react";
import TextField from "@mui/material/TextField";
import styles from "./MainMenu.module.scss";

import {
  Button,
  Card,
  CardContent,
  Container,
  Typography,
} from "@mui/material";

import { GameContext } from "@/components/helpers/GameContext";

function MainMenu() {
  const { gameIdContext, clientIdContext, _gameStateContext } =
    useContext(GameContext);

  const [gameId, setGameId] = gameIdContext;
  const [clientId, setClientId] = clientIdContext;

  const textFieldRef = useRef();
  const [newGameError, setNewGameError] = useState("");
  const [clientIdInput, setClientIdInput] = useState(null);

  const createNewGame = async () => {
    console.log("hello " + clientIdInput);
    console.log("creating new game");
    const response = await fetch("/new_game");
    if (!response.ok) {
      setNewGameError(response.statusText);
    } else {
      const newGameId = await response.json();
      console.log(newGameId);
      setGameId(newGameId);
      setClientId(displayName);
    }
  };

  const joinGame = () => {
    // todo connect client
    console.log(`todo join game ${textFieldRef.current.value}`);
  };

  return (
    <Card className={styles.MainMenu}>
      <CardContent>
        <Typography className={styles.menuTitle}>
          Welcome to Clueless
        </Typography>
        <Container className={styles.userId}>
          <TextField
            onChange={(e) => setClientIdInput(e.target.value)}
            label="Display Name"
            variant="standard"
            helperText="Please enter your display name."
            fullWidth
            required
          />
        </Container>
        <Container className={styles.createGame}>
          <Button variant="contained" onClick={createNewGame}>
            Create New Game
          </Button>
          {/* todo show error if unable to create new game */}
        </Container>
        <div> --- or --- </div>
        <Container className={styles.joinGame}>
          <TextField id="standard-basic" label="Game ID" variant="standard" />
          <Button variant="contained">Join Game</Button>
          {/* todo show error if unable to join */}
        </Container>
      </CardContent>
    </Card>
  );
}

export default MainMenu;
