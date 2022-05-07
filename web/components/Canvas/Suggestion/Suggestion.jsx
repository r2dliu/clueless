import React, { useContext, } from "react";
import {
  Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography,
} from "@mui/material";
import { GameContext } from "@/components/helpers/GameContext";
import styles from "./Suggestion.module.scss";
import formatLabel from "@/components/helpers/utils";
import Cards from "../Board/Cards";

function Suggestion(props) {
  const { gameIdContext, clientIdContext, gameStateContext, websocket} =
    useContext(GameContext);

  const [gameId, _setGameId] = gameIdContext;
  const [clientId, _setClientId] = clientIdContext;
  const [gameState, setGameState] = gameStateContext;

  const player = gameState?.assignments[clientId] || "";
  const playersCards = gameState?.cards_to_display[player] || [];
  const suggestionCards = [gameState?.suggestion?.room, gameState?.suggestion?.suspect, gameState?.suggestion?.weapon];

  const suggestor = formatLabel(gameState?.suggestion_starter);
  const nextToDisprove = gameState?.next_to_disprove;

  const passSuggestion = () => {
    websocket?.current?.send(
      JSON.stringify({
        type: "disprove_suggestion",
        card: "none",
      })
    );
  };

  return (
    <div>
       <Dialog
        open={gameState.is_active_suggestion}
        onClose={!gameState.is_active_suggestion}
      >

        {/* it's your turn to disprove */}
        {player == nextToDisprove && (
          <div>
            <DialogTitle>
            {`${suggestor} made a suggestion. It's currently your turn to disprove it.`}
            </DialogTitle>
            <DialogContent dividers>
              <DialogContentText>
                <Typography gutterBottom paragraph>
                  It is your turn to disprove the suggestion. Either select your card to disprove the suggestion or pass.
                </Typography>
              </DialogContentText>

              {/* suggestion cards */}
              <DialogContentText>
                <Typography gutterBottom paragraph>
                  {`${suggestor}'s Suggestion`}
                </Typography>
              </DialogContentText>
              <Cards cards={suggestionCards}/>
              
              {/* your cards */}
              <DialogContentText>
                <Typography gutterBottom paragraph>
                  {`Your Cards`}
                </Typography>
              </DialogContentText>
              <Cards cards={playersCards}/>

            </DialogContent>
            <DialogActions>
              <Button 
                      onClick={passSuggestion}
                      // disabled={gameState?.suggestion_valid_cards?.length > 0}
                      variant="contained">
                        Pass
              </Button>
            </DialogActions>
          </div>
        )}

        {/* it's someone else's turn */}
        {player != nextToDisprove && (
          <div>
            <DialogTitle>
            {`${suggestor} made a suggestion. It's currently ${formatLabel(nextToDisprove)}'s to disprove it.`}
            </DialogTitle>
            <DialogContent dividers>
              <DialogContentText>
                <Typography gutterBottom paragraph>
                  On your turn you will have the chance to disprove the suggestion or pass.
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
