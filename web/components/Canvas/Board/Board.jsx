import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Typography,
} from "@mui/material";
import formatLabel from "@/components/helpers/utils";
import { GameContext } from "@/components/helpers/GameContext";
import styles from "./Board.module.scss";

function Board() {
  const { gameIdContext, clientIdContext, gameStateContext, websocket } =
    useContext(GameContext);

  const [gameId, _setGameId] = gameIdContext;
  const [clientId, _setClientId] = clientIdContext;
  const [gameState, setGameState] = gameStateContext;

  const suspects = [
    "colonel_mustard",
    "miss_scarlet",
    "professor_plum",
    "mr_green",
    "mrs_white",
    "mrs_peacock",
  ];

  const clientSuspect = (gameState?.assignments || {})[`${clientId}`];
  const [action, setAction] = useState("");
  const [accusation, currentAccusation] = useState({});
  const [rulesOpen, setRulesOpen] = useState(false);

  // this is a action history for the incremental demo
  const [history, setHistory] = useState([]);

  const openRulesDialog = () => setRulesOpen(true);
  const closeRulesDialog = () => setRulesOpen(false);

  useEffect(() => {
    if (websocket.current) {
      websocket.current.addEventListener("message", (message) => {
        console.log(message);
        const new_state = JSON.parse(message?.data);
        console.log(new_state);
        if (!new_state.type) {
          console.log(new_state);
          return;
          // handle error, all messages should have type
        }
        console.log(new_state);
        if (new_state.type === "state") {
          setGameState((prevGameState) => {
            return { ...prevGameState, ...new_state };
          });
        }
        else if (new_state.type === "turn_error") {
          alert("Error: It is not your turn!");
        }
      });
    }
  }, [websocket]);

  useEffect(() => {
    if (
      typeof gameState?.previous_move === "string" ||
      gameState?.previous_move instanceof String
    ) {
      console.log(gameState?.previous_move);
      setHistory((history) => [...history, gameState?.previous_move]);
    }

  }, [gameState]);

  useEffect(() => {
    console.log('rules open -> ' + rulesOpen)

  }, [rulesOpen]);


  return (
    <div className={styles.Board}>
      {/* message dump */}
      <div>{`you are: ${clientId}`}</div>
      <div>{`gameid: ${gameId}`}</div>
      {/*
        <div className={styles.state}>{`gamestate: ${JSON.stringify(
          gameState
        )}`}</div>
      */}

      {history.map((action) => (
        <Chip label={action} variant="outlined" key={action} />
      ))}

      {/* character selection */}
      {gameState.game_phase === 0 && (
        <div>
          <b>Select Character</b>
          <br></br>
          {suspects.map((suspect) => (
            <Button
              key={`suspect-${suspect}`}
              variant="outlined"
              onClick={() => {
                websocket?.current?.send(
                  JSON.stringify({
                    type: "select_character",
                    clientId: clientId,
                    character_token: suspect,
                  })
                );
              }}
            >
              {suspect}
            </Button>
          ))}
        </div>
      )}
      <br />

      {/* starting game */}
      {gameState.game_phase === 0 && (
        <Button
          id="start"
          variant="outlined"
          onClick={() => {
            websocket?.current?.send(
              JSON.stringify({
                type: "start",
              })
            );
            openRulesDialog();
          }}
        >
          Start Game
        </Button>
      )}


      {gameState.game_phase === 1 && rulesOpen && (
        <div>
          <Dialog
            open={rulesOpen}
            onClose={closeRulesDialog}
          >
            <DialogTitle>
              {"Welcome to Clue-less"}
            </DialogTitle>
            <DialogContent dividers>
              <DialogContentText>
                <Typography gutterBottom paragraph>
                  Mr. Boddy has been murdered in his mansion. You must find out who killed him, what did they kill him with, and where the murder happened.
                </Typography>

                <Typography>
                  Game Play
                </Typography>
                <Typography gutterBottom paragraph>
                  On your turn, you may move to any room, hallway, or secret passage adjacent to your current location.
                </Typography>

                <Typography>
                  Suggestions
                </Typography>
                <Typography gutterBottom paragraph>
                  You may make a suggestion anytime you enter a room. You must provide a suspect, a murder weapon, and the room you are in. For example, Mrs. White
                  in the library with the rope. Then your opponents (going in the turn order) must prove your suggestion false by showing you one of their cards 
                  that matches your suggestion. The suggestion ends when either a player has disproved your suggestion, or all players have passed. After making a
                  suggestion you may make an accusation or end your turn.
                </Typography>

                <Typography>
                  Accusations
                </Typography>
                <Typography gutterBottom paragraph>
                  When you believe you have cracked the case, you may make an accusation. You will provide the suspect, murder weapon, and the room the crime was
                  commited. If you are correct, you win! If you are not correct, then you will no longer be able to move, make suggestions, or make accustations. 
                  However, you will still disprove other players suggestions. You may make an accusation at any time before ending your turn.
                </Typography>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={closeRulesDialog}>Let&apos;s get started</Button>
            </DialogActions>
          </Dialog>
        </div>
      )}

      {gameState.game_phase === 1 && !rulesOpen && (
          <b>It is {formatLabel(gameState.current_turn)}&apos;s turn</b>
      )}


      {gameState.game_phase === 2 && (
        <div>Game Over! {formatLabel(gameState?.winner)} won!</div>
      )}
    </div>
  );
}

export default Board;
