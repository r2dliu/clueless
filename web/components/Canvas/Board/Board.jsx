import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Chip,
} from "@mui/material";
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

  const rooms = [
    "study",
    "hall",
    "lounge",
    "library",
    "billiard",
    "dining",
    "conservatory",
    "ballroom",
    "kitchen",
  ];

  const weapons = [
    "rope",
    "lead_pipe",
    "knife",
    "wrench",
    "candlestick",
    "revolver",
  ];

  const clientSuspect = (gameState?.assignments || {})[`${clientId}`];
  const [action, setAction] = useState("");
  const [accusation, currentAccusation] = useState({});

  // this is a action history for the incremental demo
  const [history, setHistory] = useState([]);

  // todo clean these all up into a accusation and suggestion objects. using a single object was causing async issues
  const [accusationSuspect, setAccusationSuspect] = useState("");
  const [accusationWeapon, setAccusationWeapon] = useState("");
  const [accusationRoom, setAccusationRoom] = useState("");

  const [suggestionSuspect, setSuggestionSuspect] = useState("");
  const [suggestionWeapon, setSuggestionWeapon] = useState("");
  const [suggestionRoom, setSuggestionRoom] = useState("");

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

  function formatLabel(label) {
    // capitalize and add a space for suspect/room/weapon labels
    return label
      .split(/_/g)
      .map((word) => {
        return word[0].toUpperCase() + word.substring(1);
      })
      .join(" ");
  }

  return (
    <div className={styles.Board}>
      {/* message dump */}
      <div>{`you are: ${clientId}`}</div>
      <div>{`gameid: ${gameId}`}</div>
      <div className={styles.state}>{`gamestate: ${JSON.stringify(
        gameState
      )}`}</div>

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
      <br />
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
          }}
        >
          Start Game
        </Button>
      )}

      {gameState.game_phase === 1 && (
        <b>It is {formatLabel(gameState.current_turn)}&apos;s turn</b>
      )}

      <br></br>
      {/* game controls */}
      {gameState.game_phase === 1 && (
        <div>
          <Button
            id="move"
            variant="outlined"
            onClick={() => {
              setAction("move");
            }}
          >
            Move
          </Button>
          <Button
            id="suggestion"
            variant="outlined"
            onClick={() => {
              setAction("suggestion");
            }}
          >
            Make Suggestion
          </Button>
          <Button
            id="accusation"
            variant="outlined"
            onClick={() => {
              setAction("accusation");
            }}
          >
            Make Accusation
          </Button>
        </div>
      )}

      {gameState.game_phase === 1 &&
        action == "move" &&
        (gameState?.allowed_moves || {})[clientSuspect].map((move) => {
          return (
            <Button
              key="actual-move"
              variant="outlined"
              onClick={() => {
                websocket?.current?.send(
                  JSON.stringify({
                    type: "move",
                    suspect: clientSuspect,
                    location: move,
                  })
                );
              }}
            >
              {move}
            </Button>
          );
        })}

      {/* todo lots of repeatd code beneath, clean up */}
      {gameState.game_phase === 1 && action == "suggestion" && (
        <div className={styles.suggestion}>
          <div className={styles.controls}>
            <FormControl sx={{ minWidth: 160 }}>
              <InputLabel id="suggestion-suspect-selection-label">
                Select Suspect
              </InputLabel>
              <Select
                labelId="suggestion-suspect-selection-label"
                id="suggestion-suspect-selection"
                value={suggestionSuspect}
                label="Suspect"
                onChange={(event) => {
                  setSuggestionSuspect(event.target.value);
                }}
              >
                {suspects.map((suspect) => (
                  <MenuItem key={suspect} value={suspect}>
                    {formatLabel(suspect)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 160 }}>
              <InputLabel id="suggestion-weapon-selection-label">
                Select Weapon
              </InputLabel>
              <Select
                labelId="suggestion-weapon-selection-label"
                id="suggestion-weapon-selection"
                value={suggestionWeapon}
                label="Weapon"
                onChange={(event) => {
                  setSuggestionWeapon(event.target.value);
                }}
              >
                {weapons.map((weapon) => (
                  <MenuItem key={weapon} value={weapon}>
                    {formatLabel(weapon)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 160 }}>
              <InputLabel id="suggestion-room-selection-label">
                Select Room
              </InputLabel>
              <Select
                labelId="suggestion-room-selection-label"
                id="suggestion-room-selection"
                value={suggestionRoom}
                label="Room"
                onChange={(event) => {
                  setSuggestionRoom(event.target.value);
                }}
              >
                {rooms.map((room) => (
                  <MenuItem key={room} value={room}>
                    {formatLabel(room)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className={styles.submission}>
            <Button
              key={`submit-suggestion`}
              variant="contained"
              onClick={() => {
                websocket?.current?.send(
                  JSON.stringify({
                    type: "suggestion",
                    suspect: suggestionSuspect,
                    room: suggestionRoom,
                    weapon: suggestionWeapon,
                  })
                );
              }}
            >
              Submit Suggestion
            </Button>
            <Button
              key={`cancel-suggestion`}
              variant="outlined"
              onClick={() => {
                setAccusationRoom("");
                setSuggestionSuspect("");
                setSuggestionWeapon("");
              }}
            >
              Cancel Suggestion
            </Button>
          </div>
          <div className={styles.submission}></div>
        </div>
      )}

      {gameState.game_phase === 1 && action == "accusation" && (
        <div className={styles.accusation}>
          <div className={styles.controls}>
            <FormControl sx={{ minWidth: 160 }}>
              <InputLabel id="accusation-suspect-selection-label">
                Select Suspect
              </InputLabel>
              <Select
                labelId="accusation-suspect-selection-label"
                id="accusation-suspect-selection"
                value={accusationSuspect}
                label="Suspect"
                onChange={(event) => {
                  setAccusationSuspect(event.target.value);
                }}
              >
                {suspects.map((suspect) => (
                  <MenuItem key={suspect} value={suspect}>
                    {formatLabel(suspect)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 160 }}>
              <InputLabel id="accusation-weapon-selection-label">
                Select Weapon
              </InputLabel>
              <Select
                labelId="accusation-weapon-selection-label"
                id="accusation-weapon-selection"
                value={accusationWeapon}
                label="Weapon"
                onChange={(event) => {
                  setAccusationWeapon(event.target.value);
                }}
              >
                {weapons.map((weapon) => (
                  <MenuItem key={weapon} value={weapon}>
                    {formatLabel(weapon)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 160 }}>
              <InputLabel id="accusation-room-selection-label">
                Select Room
              </InputLabel>
              <Select
                labelId="accusation-room-selection-label"
                id="accusation-room-selection"
                value={accusationRoom}
                label="Room"
                onChange={(event) => {
                  setAccusationRoom(event.target.value);
                }}
              >
                {rooms.map((room) => (
                  <MenuItem key={room} value={room}>
                    {formatLabel(room)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className={styles.submission}>
            <Button
              key={`submit-accusation`}
              variant="contained"
              onClick={() => {
                websocket?.current?.send(
                  JSON.stringify({
                    type: "accusation",
                    suspect: accusationSuspect,
                    room: accusationRoom,
                    weapon: accusationWeapon,
                  })
                );
              }}
            >
              Submit Accusation
            </Button>
            <Button
              key={`cancel-accusation`}
              variant="outlined"
              onClick={() => {
                setAccusationRoom("");
                setAccusationSuspect("");
                setAccusationWeapon("");
              }}
            >
              Cancel Accusation
            </Button>
          </div>
        </div>
      )}

      {gameState.game_phase === 2 && (
        <div>Game Over! {formatLabel(gameState?.winner)} won!</div>
      )}
    </div>
  );
}

export default Board;
