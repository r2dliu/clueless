import React, { useState, useEffect, useContext, useRef } from "react";
import { GameContext } from "@/components/helpers/GameContext";
import { TextField } from "@mui/material";

function Chat() {
  const [messages, setMessages] = useState([]);
  const { gameIdContext, clientIdContext, gameStateContext, websocket } =
    useContext(GameContext);
  const [clientId, _setClientId] = clientIdContext;
  const chatInputRef = useRef();
  useEffect(() => {
    if (websocket.current) {
      websocket.current.addEventListener("message", (message) => {
        console.log(message);
        const parsed_msg = JSON.parse(message?.data);
        if (parsed_msg?.chat && parsed_msg?.clientId) {
          setMessages((prevMessages) => [
            ...prevMessages,
            `${parsed_msg.clientId} : ${parsed_msg.chat}`,
          ]);
        }
      });
    }
  }, [websocket]);

  console.log(messages);
  return (
    <div>
      <b>chat</b>
      {messages.map((message, i) => (
        <p key={i}>{message}</p>
      ))}
      <TextField
        inputRef={chatInputRef}
        id="chat"
        variant="outlined"
        onKeyPress={(e) => {
          if (e.key === "Enter" && !!chatInputRef.current.value) {
            websocket?.current?.send(
              JSON.stringify({
                chat: chatInputRef.current.value,
                clientId: clientId,
              })
            );
            chatInputRef.current.value = "";
          }
        }}
      />
    </div>
  );
}

export default Chat;
