import React, { useState, useEffect, useContext, useRef } from "react";
import { GameContext } from "@/components/helpers/GameContext";
import styles from "./Chat.module.scss";
import { TextField, Chip } from "@mui/material";


function Chat() {
  const [messages, setMessages] = useState([]);
  const { gameIdContext, clientIdContext, gameStateContext, websocket } =
    useContext(GameContext);
  const [clientId, _setClientId] = clientIdContext;
  const chatInputRef = useRef();

  const [gameState, setGameState] = gameStateContext;
  const [action, setAction] = useState("");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (
      typeof gameState?.previous_move === "string" ||
      gameState?.previous_move instanceof String
    ) {
      console.log(gameState?.previous_move);
      if (history[history.length - 1] != gameState?.previous_move) {
        setHistory((history) => [...history, gameState?.previous_move]);
      }
    }
  }, [gameState]);

  useEffect(() => {
    if (websocket.current) {
      websocket.current.addEventListener("message", (message) => {
        const parsed_msg = JSON.parse(message?.data);
        if (!parsed_msg.type) {
          // handle error, all messages should have type
        }

        if (
          parsed_msg.type === "chat" &&
          parsed_msg?.chat &&
          parsed_msg?.clientId
        ) {
          setMessages((prevMessages) => [
            ...prevMessages,
            `${parsed_msg.clientId} : ${parsed_msg.chat}`,
          ]);
        }
      });
    }
  }, [websocket]);

  // TODO: action history isn't right..updates every time somebody chats
  return (
    <div>
      <div className={styles.Chat}>
        <div className={styles.messagesWrapper}>
          <div className={styles.messageBox}>
            {messages.map((message, i) => (
              <p key={i}>{message}</p>
            ))}
          </div>
        </div>

        <TextField
          inputRef={chatInputRef}
          id="chat"
          variant="outlined"
          label="Chat"
          size="small"
          onKeyPress={(e) => {
            if (e.key === "Enter" && !!chatInputRef.current.value) {
              websocket?.current?.send(
                JSON.stringify({
                  type: "chat",
                  chat: chatInputRef.current.value,
                  clientId: clientId,
                })
              );
              chatInputRef.current.value = "";
            }
          }}
        />
      </div>
      <br></br>
      <br></br>
      <div className={styles.MoveHistory}>
        <b>Move History</b>
        <div className={styles.messagesWrapper}>
          <div className={styles.messageBox}>
            {history.map((action) => (
              // Chip is too big to fit in the chatbox :(
              //<Chip label={action} variant="outlined" key={action} />
              <p key={action}>{action}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
