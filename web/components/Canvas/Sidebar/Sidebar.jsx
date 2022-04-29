import React, { useContext } from "react";
import { GameContext } from "@/components/helpers/GameContext";
import Chat from "./Chat";
import Controls from "./Controls";
import styles from "./Sidebar.module.scss";


function Sidebar() {
  return (
    <div className={styles.Sidebar}>
      <div>
        <Chat />
        <br></br>
        <br></br>
        <Controls />
      </div>
    </div>
  );
}

export default Sidebar;
