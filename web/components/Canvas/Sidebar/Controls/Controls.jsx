import React, { useState, useEffect, useContext } from "react";
import {
    Button,
    ButtonGroup,
    FormControl,
    InputLabel,
    MenuItem,
    Select,

} from "@mui/material";
import formatLabel from "@/components/helpers/utils";
import { GameContext } from "@/components/helpers/GameContext";
import styles from "../Sidebar.module.scss";


function Controls(props) {
    const { gameIdContext, clientIdContext, gameStateContext, websocket } =
        useContext(GameContext);

    const [gameId, _setGameId] = gameIdContext;
    const [clientId, _setClientId] = clientIdContext;
    const [gameState, setGameState] = gameStateContext;

    const openRulesDialog = () => props.setRulesOpen(true);

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
    const currentRoom = (gameState?.suspect_locations || {})[clientSuspect];
    const previousMove = gameState?.previous_move;
    const [action, setAction] = useState("");
    const [accusation, currentAccusation] = useState({});

    const [accusationErrors, setAccusationErrors] = useState({
        "room": false,
        "weapon": false,
        "suspect": false
    })

    // todo clean these all up into a accusation and suggestion objects. using a single object was causing async issues
    const [accusationSuspect, setAccusationSuspect] = useState("");
    const [accusationWeapon, setAccusationWeapon] = useState("");
    const [accusationRoom, setAccusationRoom] = useState("");

    const [suggestionErrors, setSuggestionErrors] = useState({
        "room": false,
        "weapon": false,
        "suspect": false
    })
    const [suggestionSuspect, setSuggestionSuspect] = useState("");
    const [suggestionWeapon, setSuggestionWeapon] = useState("");
    const [suggestionRoom, setSuggestionRoom] = useState("");

    const [isControlsLocked, setIsControlsLocked] = useState(true);

    useEffect(() => {
        // toggle controls lock
        if (gameState?.current_turn && gameState?.assignments[clientId])
            setIsControlsLocked(
                gameState.current_turn != gameState.assignments[clientId]
            );
    }, [gameState]);

    function validateAccusationFields() {
        // only calling the hook once to avoid race condition
        let isSuspectValid = true, isRoomValid = true, isWeaponValid = true;
        if(!accusationSuspect) isSuspectValid = false;
        if(!accusationRoom) isRoomValid = false;
        if(!accusationWeapon) isWeaponValid = false;
        setAccusationErrors({
            "weapon" : !isWeaponValid,
            "room" : !isRoomValid,
            "suspect" : !isSuspectValid
        })
    }

    function validateSuggestionFields() {
        // only calling the hook once to avoid race condition
        let isSuspectValid = true, isRoomValid = true, isWeaponValid = true;
        if(!suggestionSuspect) isSuspectValid = false;
        if(!suggestionRoom) isRoomValid = false;
        if(!suggestionWeapon) isWeaponValid = false;
        setSuggestionErrors({
            "weapon" : !isWeaponValid,
            "room" : !isRoomValid,
            "suspect" : !isSuspectValid
        })
    }

    return (
        <div>

            {/* game controls */}
            {
                gameState.game_phase === 1 && (
                    <div>
                        <ButtonGroup
                            orientation="vertical"
                        >
                            <Button
                                id="move"
                                variant="contained"
                                onClick={() => {
                                    setAction("move");
                                }}
                                disabled={isControlsLocked
                                    || String(previousMove).includes(clientSuspect)}
                                size="large"
                            >
                                Move
                            </Button>
                            <Button
                                id="suggestion"
                                variant="contained"
                                onClick={() => {
                                    setAction("suggestion");
                                }}
                                disabled={isControlsLocked
                                    || currentRoom.includes('start') //cant make suggestion on turn one
                                    || !rooms.includes(currentRoom)} //cant make suggestion if not in a room
                                size="large"
                            >
                                Make Suggestion
                            </Button>
                            <Button
                                id="accusation"
                                variant="contained"
                                onClick={() => {
                                    setAction("accusation");
                                }}
                                disabled={isControlsLocked}
                                size="large"
                            >
                                Make Accusation
                            </Button>
                            <Button
                                id="end_turn"
                                variant="contained"
                                onClick={() => {
                                    setAction("end_turn");
                                }}
                                disabled={isControlsLocked}
                                size="large"
                            >
                                End Turn
                            </Button>
                            <Button
                                id="see_rules"
                                variant="contained"
                                onClick={() => {
                                    openRulesDialog();
                                }}
                                disabled={isControlsLocked}
                                size="large"
                            >
                                See Rules
                            </Button>
                        </ButtonGroup>
                    </div>
                )
            }

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
                                setAction("");
                            }}
                            disabled={isControlsLocked}
                        >
                            {move}
                        </Button>
                    );
                })
            }

            {gameState.game_phase === 1 && action == "end_turn" && (
                <Button
                    key="end_turn"
                    variant="outlined"
                    onClick={() => {
                        websocket?.current?.send(
                            JSON.stringify({
                                type: "end_turn",
                            })
                        );
                    }}
                    disabled={isControlsLocked}
                >
                    Submit
                </Button>
            )}

            {/* todo lots of repeated code beneath, clean up */}
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
                                error={suggestionErrors.suspect}
                                disabled={isControlsLocked}
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
                                error={suggestionErrors.weapon}
                                disabled={isControlsLocked}
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
                                error={suggestionErrors.room}
                                disabled={isControlsLocked}
                            >
                                <MenuItem key={currentRoom} value={currentRoom}>
                                    {formatLabel(currentRoom)}
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <div className={styles.submission}>
                        <Button
                            key={`submit-suggestion`}
                            variant="contained"
                            onClick={() => {
                                if(suggestionRoom && suggestionSuspect && suggestionWeapon) {
                                    websocket?.current?.send(
                                        JSON.stringify({
                                            type: "suggestion",
                                            suspect: suggestionSuspect,
                                            room: suggestionRoom,
                                            weapon: suggestionWeapon,
                                        })
                                    );
                                }
                                else {
                                    validateSuggestionFields();
                                }
                            }}
                            disabled={isControlsLocked}
                        >
                            Submit Suggestion
                        </Button>
                        <Button
                            key={`cancel-suggestion`}
                            variant="outlined"
                            onClick={() => {
                                setSuggestionRoom("");
                                setSuggestionSuspect("");
                                setSuggestionWeapon("");
                                setSuggestionErrors({
                                    "room": false,
                                    "weapon": false,
                                    "suspect": false
                                });
                            }}
                            disabled={isControlsLocked}
                        >
                            Clear Suggestion
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
                                disabled={isControlsLocked}
                                error={accusationErrors.suspect}
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
                                disabled={isControlsLocked}
                                error={accusationErrors.weapon}
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
                                disabled={isControlsLocked}
                                error={accusationErrors.room}
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
                                if (accusationSuspect && accusationRoom && accusationWeapon) {
                                  websocket?.current?.send(
                                    JSON.stringify({
                                      type: "accusation",
                                      suspect: accusationSuspect,
                                      room: accusationRoom,
                                      weapon: accusationWeapon,
                                    })
                                  );
                                } else {
                                    validateAccusationFields()
                                }
                            }}
                            disabled={isControlsLocked}
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
                                setAccusationErrors({
                                    "room": false,
                                    "weapon": false,
                                    "suspect": false
                                });
                            }}
                            disabled={isControlsLocked}
                        >
                            Clear Accusation
                        </Button>
                    </div>
                </div>
            )}

        </div>
    )
}

export default Controls;
