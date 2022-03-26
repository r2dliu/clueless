import React, { useState, createContext, useRef, Context } from "react";

const GameContext = createContext();

function GameContextProvider({ children }) {
  const [gameId, setGameId] = useState("");
  const [clientId, setClientId] = useState("");
  const [gameState, setGameState] = useState({});
  const websocket = useRef(null);

  return (
    <GameContext.Provider
      value={{
        gameIdContext: [gameId, setGameId],
        clientIdContext: [clientId, setClientId],
        gameStateContext: [gameState, setGameState],
        websocket: websocket,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export { GameContext, GameContextProvider };
