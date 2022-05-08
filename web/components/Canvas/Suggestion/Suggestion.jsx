import React, { useContext, useEffect, useState } from "react";
import {
  Button, CardMedia, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography,
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

  function selectCard(name) {
    websocket?.current?.send(
      JSON.stringify({
        type: "disprove_suggestion",
        card: name,
      })
    );
  };

  const clearSuggestion= () => {
    websocket?.current?.send(
      JSON.stringify({
        type: "terminate_suggestion",
      })
    );
  };

  // useEffect(() => {
  //   if (gameState.is_active_suggestion && !suggestionDialogOpen) {
  //     openSuggestionDialog()
  //   }
  // }, [gameState]);

  return (
    <div>
      <Dialog
        /* open has to change to something along the lines of gameState.is_active_suggestion && gameState.suggestion_starter == "" 
           to get the end suggestion states to show. You will also need to clear the remaining state (suggestion_stater, disproval card) to reset */ 
        open={gameState.is_active_suggestion}
      >

        {/* it's your turn to disprove */}
        {player == nextToDisprove && !gameState?.suggestion_end_state && (
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
              <Cards cards={playersCards}
                     isClickable={true}
                     onClick={selectCard}
                     validCards={gameState?.suggestion_valid_cards}
              />

            </DialogContent>
            <DialogActions>
              <Button 
                      onClick={passSuggestion}
                      disabled={gameState?.suggestion_valid_cards?.length > 0}
                      variant="contained">
                        Pass
              </Button>
            </DialogActions>
          </div>
        )}

        {/* it's someone else's turn */}
        {player != nextToDisprove && !gameState?.suggestion_end_state && (
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

        {/* suggestor - disproven */}
        {player == gameState?.suggestion_starter && gameState?.suggestion_end_state && gameState?.suggestion_disproval_card && (
          <div>
            <DialogTitle>
              {`${formatLabel(gameState.next_to_disprove)} disproved your suggestion with the ${formatLabel(gameState.suggestion_disproval_card)}.`}
            </DialogTitle>
            <DialogContent>
              <div className={styles.disprovalCard}>
                <Cards cards={[gameState.suggestion_disproval_card]}/>
                {/* <CardMedia component={"img"} src={`/static/board/${gameState.suggestion_disproval_card}.jpg`} /> */}
              </div>
            </DialogContent>
            <DialogActions>
            <Button onClick={() => {clearSuggestion()}}
                    variant="contained">
                      Continue
              </Button>
            </DialogActions>
          </div>
        )}

        {/* suggestor - all passed */}
        {player == gameState?.suggestion_starter && gameState?.suggestion_end_state &&  gameState?.suggestion_all_passed && (
          <div>
            <DialogTitle>
              {`Everyone passed your suggestion.`}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                <Typography gutterBottom paragraph>
                  Your suggestion:
                </Typography>
              </DialogContentText>
              <div className={styles.disprovalCard}>
                <Cards cards={[gameState.suggestion.suspect, gameState.suggestion.weapon, gameState.suggestion.room]}/>
                {/* <CardMedia component={"img"} src={`/static/board/${gameState.suggestion.suspect}.jpg`} />
                <CardMedia component={"img"} src={`/static/board/${gameState.suggestion.weapon}.jpg`} />
                <CardMedia component={"img"} src={`/static/board/${gameState.suggestion.room}.jpg`} /> */}
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => {clearSuggestion()}}
                      variant="contained">
                        Continue
              </Button>
            </DialogActions>
          </div>
        )}

        {/* non-suggestor - they need to wait for the suggestor to ack the suggestion unfortunatley */}
        {player != gameState?.suggestion_starter && gameState?.suggestion_end_state && (
          <div>
            <DialogTitle>
              {`${formatLabel(suggestor)}'s suggestion has been resolved. The case will continue shortley.`}
            </DialogTitle>
          </div>
        )}

      </Dialog>
    </div>
  );
}

export default Suggestion;
