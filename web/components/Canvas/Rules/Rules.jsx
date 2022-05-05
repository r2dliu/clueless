import React from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Typography,
} from "@mui/material";
import styles from "./Rules.module.scss";

function Rules(props) {
  return (
    <div>
      <Dialog
        open={props.rulesOpen}
        onClose={props.closeRulesDialog}
      >
        <DialogTitle>
          {"Welcome to Clue-less"}
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText>
            <Typography gutterBottom paragraph className={styles.header}>
              Mr. Boddy has been murdered in his mansion. You must find out who killed him, what did they kill him with, and where the murder happened.
            </Typography>

            <Typography className={styles.header}>
              Game Play
            </Typography>
            <Typography gutterBottom paragraph>
              On your turn, you may move to any room, hallway, or secret passage adjacent to your current location. Only one player may be in a hallway at a time.
              If another player is in a hallway, you cannot move through it. If you begin your turn in a hallway, you must move to one of the adjacent rooms and make
              a suggestion.
            </Typography>

            <Typography className={styles.header}>
              Suggestions
            </Typography>
            <Typography gutterBottom paragraph>
              You may make a suggestion anytime you enter a room. You must provide a suspect, a murder weapon, and the room you are in. For example, Mrs. White
              in the library with the rope. Then going in the turn order, your opponents must prove your suggestion false by showing you one of their cards 
              that matches your suggestion (or pass if they cannot disprove the suggestion). The suggestion ends when either a player has disproved your suggestion,
              or all players have passed. After making a suggestion you may make an accusation or end your turn.
            </Typography>

            <Typography className={styles.header}>
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
          <Button onClick={props.closeRulesDialog}
                  variant="contained">
                    Let&apos;s get started
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Rules;
