import React, { useState, useCallback, useEffect, useRef } from "react";
import TextField from "@mui/material/TextField";
import Board from "./Board";

import styles from "./Canvas.module.scss";

function Canvas() {
  const textFieldRef = useRef();
  const websocket = useRef(null);
  const [error, setError] = useState("");

  return (
    <div className={styles.Canvas}>
      <div className={styles.box}>
        <Board />
      </div>
      <div className={styles.sidebar}>sidebar</div>
    </div>
    // <div>
    //   <TextField
    //     id="outlined-basic"
    //     label="Outlined"
    //     variant="outlined"
    //     inputRef={textFieldRef}
    //   />
    //   <button
    //     onClick={() => {
    //       if (!websocket.current) {
    //         websocket.current = new WebSocket(
    //           `ws://localhost:8000/ws/${textFieldRef.current.value}`
    //         );
    //         console.log("connection open!");
    //         console.log(websocket.current);
    //         websocket.current.onopen = function (e) {
    //           setError("");
    //         };

    //         websocket.current.onerror = function (e) {
    //           setError("Websocket error");
    //           console.log(e, "resetting websocket");
    //           websocket.current.close();
    //           websocket.current = null;
    //           console.log(websocket);
    //         };
    //         return () => websocket.current.close();
    //       }
    //     }}
    //   >
    //     Fill out input above with string, then click Me to change Socket Url
    //   </button>

    //   <div>Websocket status: {websocket.current?.readyState}</div>
    //   <div>Error: {error}</div>
    // </div>
  );
}

export default Canvas;
