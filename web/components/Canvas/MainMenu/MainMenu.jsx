import React, { useState, useRef } from "react";
import TextField from "@mui/material/TextField";
import styles from "./MainMenu.module.scss";

import {
  Button,
  Card,
  CardContent,
  Container,
  Typography,
} from "@mui/material";

function MainMenu({ setGameId, setClientId }) {
  const textFieldRef = useRef();
  const [newGameError, setNewGameError] = useState("");
  const [clientIdInput, setClientIdInput] = useState(null);
  const [gameIdInput, setGameIdInput] = useState(null);
  const [errors, setErrors] = useState({ nameInput: "", gameIdInput: "" });

  const invalidClientIdMessage = "Enter an display name.";
  const invalidGameIdMessage = "Enter a valid game ID.";

  const createNewGame = async () => {
    if (!clientIdInput) {
      setErrors({ nameInput: invalidClientIdMessage });
      return;
    }

    console.log(`hello ${clientIdInput}`);
    console.log("creating new game...");
    const response = await fetch("/new_game");
    if (!response.ok) {
      setNewGameError(response.statusText);
    } else {
      const gameId = await response.json();
      console.log(gameId);
      setGameId(gameId);
      setClientId(displayName);
    }
  };

  const joinGame = () => {
    const errors = {};
    if (!clientIdInput) {
      errors.nameInput = invalidClientIdMessage;
    }
    // todo validate the game id is for a current game
    if (!gameIdInput) {
      errors.gameIdInput = invalidGameIdMessage;
    }
    if (errors.clientIdInput || errors.gameIdInput) {
      setErrors(errors);
      return;
    }

    // todo connect client
    console.log(`todo join game ${gameIdInput}`);
  };

  const handleGameIdInputChange = (val) => {
    setErrors({ ...errors, gameIdInput: "" });
    val
      ? setGameIdInput(val)
      : setErrors({ ...errors, gameIdInput: invalidGameIdMessage });
  };

  const handleNameInputChange = (val) => {
    setErrors({ ...errors, nameInput: "" });
    val
      ? setClientIdInput(val)
      : setErrors({ ...errors, nameInput: invalidClientIdMessage });
  };

  return (
    <Card className={styles.MainMenu}>
      <CardContent>
        <Typography className={styles.menuTitle}>
          Welcome to Clueless
        </Typography>
        <Container className={styles.menuContent}>
          <TextField
            onChange={(e) => handleNameInputChange(e.target.value)}
            label="Display Name"
            variant="standard"
            fullWidth
            required
            error={Boolean(errors?.nameInput)}
            helperText={errors?.nameInput}
          />
          <Container className={styles.createGame}>
            <Button variant="contained" onClick={createNewGame}>
              Create New Game
            </Button>
            {/* todo show error if unable to create new game */}
          </Container>
          <div className={styles.divider}> --- or --- </div>
          <Container className={styles.joinGame}>
            <TextField
              onChange={(e) => handleGameIdInputChange(e.target.value)}
              label="Game ID"
              variant="standard"
              error={Boolean(errors?.gameIdInput)}
              helperText={errors?.gameIdInput}
            />
            <Button variant="contained" onClick={joinGame}>
              Join Game
            </Button>
            {/* todo show error if unable to join */}
          </Container>
        </Container>
      </CardContent>
    </Card>
  );
}

export default MainMenu;
