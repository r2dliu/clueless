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
import { compose } from "@mui/system";

function MainMenu() {
  const { gameIdContext, clientIdContext, gameStateContext, websocket } =
    useContext(GameContext);

  const [gameId, setGameId] = gameIdContext;
  const [clientId, setClientId] = clientIdContext;
  const [gameState, setGameState] = gameStateContext;

  const userNameFieldRef = useRef();
  const existingGameFieldRef = useRef();
  const [newGameError, setNewGameError] = useState("");
  const [clientIdInput, setClientIdInput] = useState(null);
  const [gameIdInput, setGameIdInput] = useState(null);
  const [errors, setErrors] = useState({ nameInput: "", gameIdInput: "" });

  const invalidClientIdMessage = "Enter an display name.";
  const invalidGameIdMessage = "Enter a valid game ID.";

  const createNewGame = async () => {
    if (!userNameFieldRef.current.value) {
      console.log("error no username entered. todo display this error");
      setErrors({ nameInput: invalidClientIdMessage });
      return;
    }

    console.log("creating new game...");
    const response = await fetch("/new_game");
    if (!response.ok) {
      setNewGameError(response.statusText);
    } else {
      const newGameId = await response.json();
      const new_websocket = new WebSocket(
        `ws://localhost:8000/ws/${newGameId}/${userNameFieldRef.current.value}`
      );
      websocket.current = new_websocket;
      new_websocket.onerror = (e) => console.log(e);
      new_websocket.onopen = () => {
        setGameState((prevGameState) => {
          return { ...prevGameState, connected: true };
        });
        console.log("ws opened");
      };
      new_websocket.onclose = () => {
        setGameState((prevGameState) => {
          return { ...prevGameState, connected: false };
        });
        console.log("ws closed");
      };
      new_websocket.onmessage = (message) => {
        console.log(`got message: ${message}`);
      };

      // setting gameId must come last, because it makes main menu unmount
      // and causes board to mount in it's place
      setClientId(userNameFieldRef.current.value);
      setGameId(newGameId);
    }
  };

  const joinGame = () => {
    const errors = {};
    if (!userNameFieldRef.current.value) {
      console.log("error no username entered todo display");
      errors.nameInput = invalidClientIdMessage;
    }

    if (!existingGameFieldRef.current.value) {
      console.log("error no gameid entered todo display");
      errors.gameIdInput = invalidGameIdMessage;
    }

    if (errors.clientIdInput || errors.gameIdInput) {
      setErrors(errors);
      return;
    }

    const new_websocket = new WebSocket(
      `ws://localhost:8000/ws/${existingGameFieldRef.current.value}/${userNameFieldRef.current.value}`
    );
    websocket.current = new_websocket;
    new_websocket.onerror = (e) => {
      console.log(e);
    };
    new_websocket.onopen = () => {
      setGameState((prevGameState) => {
        return { ...prevGameState, connected: true };
      });
      console.log("ws opened");
    };
    new_websocket.onclose = (e) => {
      setGameState((prevGameState) => {
        return { ...prevGameState, connected: false };
      });
      console.log(e);
      console.log("ws closed");
    };
    new_websocket.onmessage = (message) => {
      console.log(`got message: ${message}`);
    };

    setClientId((_prevClientId) => userNameFieldRef.current.value);
    setGameId((_prevGameId) => existingGameFieldRef.current.value);
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
            inputRef={userNameFieldRef}
            label="Display Name"
            variant="standard"
            fullWidth
            required
            onChange={(e) => handleNameInputChange(e.target.value)}
            error={Boolean(errors?.nameInput)}
            helperText={errors?.nameInput}
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
          <TextField
            inputRef={existingGameFieldRef}
            label="Game ID"
            variant="standard"
            onChange={(e) => handleGameIdInputChange(e.target.value)}
            error={Boolean(errors?.gameIdInput)}
            helperText={errors?.gameIdInput}
          />
          <Button variant="contained" onClick={joinGame}>
            Join Game
          </Button>
          {/* todo show error if unable to join */}
        </Container>
      </CardContent>
    </Card>
  );
}

export default MainMenu;
