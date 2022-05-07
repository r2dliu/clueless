import React, { useContext, } from "react";
import {
  Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography,
} from "@mui/material";
import { GameContext } from "@/components/helpers/GameContext";
import styles from "./Suggestion.module.scss";
import formatLabel from "@/components/helpers/utils";

function Suggestion(props) {
  const { gameIdContext, clientIdContext, gameStateContext, } =
    useContext(GameContext);

  const [gameId, _setGameId] = gameIdContext;
  const [clientId, _setClientId] = clientIdContext;
  const [gameState, setGameState] = gameStateContext;

  return (
    <div>
       <Dialog
        open={gameState.is_active_suggestion}
        onClose={!gameState.is_active_suggestion}
      >

        {/* it's your turn to disprove */}
        {gameState.assignments[clientId] == gameState.next_to_disprove && (
          <div>
            <DialogTitle>
            {formatLabel(gameState.current_turn) + " made a suggestion. It's currently your turn to disprove it."}
            </DialogTitle>
            <DialogContent dividers>
              <DialogContentText>
                <Typography gutterBottom paragraph>
                  It is your turn to disprove the suggestion. Either select your card to disprove the suggestion or pass.
                </Typography>
              </DialogContentText>

              {/* suggestion cards */}

              {/* your cards */}

            </DialogContent>
            <DialogActions>
              <Button 
                      // onClick={props.pass}
                      // disabled={props.canPass}
                      variant="contained">
                        Pass
              </Button>
            </DialogActions>
          </div>
        )}

        {/* it's someone else's turn */}
        {gameState.assignments[clientId] != gameState.next_to_disprove && (
          <div>
            <DialogTitle>
            {formatLabel(gameState.current_turn) + " made a suggestion. It's currently " + formatLabel(gameState.next_to_disprove) + " to disprove it."}
            </DialogTitle>
            <DialogContent dividers>
              <DialogContentText>
                <Typography gutterBottom paragraph>
                  On your turn, you will have the chance to disprove the suggestion or pass.
                </Typography>
              </DialogContentText>
            </DialogContent>
          </div>
        )}

      </Dialog>
    </div>
  );
}

export default Suggestion;
