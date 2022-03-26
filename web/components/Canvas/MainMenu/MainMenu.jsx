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

  const createNewGame = async () => {
    if (!userNameFieldRef.current.value) {
      console.log("error no username entered. todo display this error");
      return;
    }

    console.log("creating new game");
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
    if (!userNameFieldRef.current.value) {
      console.log("error no username entered todo display");
      return;
    }

    if (!existingGameFieldRef.current.value) {
      console.log("error no gameid entered todo display");
      return;
    }

    // todo connect client
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

  return (
    <Card className={styles.MainMenu}>
      <CardContent>
        <Typography className={styles.menuTitle}>
          Welcome to Clueless
        </Typography>
        <Container className={styles.userId}>
          <TextField
            inputRef={userNameFieldRef}
            label="Display Name"
            variant="standard"
            helperText="Enter your display name"
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
          <TextField
            inputRef={existingGameFieldRef}
            label="Game ID"
            variant="standard"
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
