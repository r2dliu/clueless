import React, { useContext } from "react";
import { GameContext } from "@/components/helpers/GameContext";
import Chat from "./Chat";
import Controls from "./Controls";
import Cards from "./Cards";
import styles from "./Sidebar.module.scss";

function Sidebar() {
  return (
    <div className={styles.Sidebar}>
      <div>
        <Chat />
        <br></br>
        <br></br>
        <Controls />
        <Cards />
      </div>
    </div>
  );
}

export default Sidebar;
