import React, { useContext } from "react";
import { GameContext } from "@/components/helpers/GameContext";
import Chat from "./Chat";
import Controls from "./Controls";
import Cards from "../Board/Cards";
import styles from "./Sidebar.module.scss";

function Sidebar(props) {
  return (
    <div className={styles.Sidebar}>
      <div>
        <Chat />
        <br></br>
        <br></br>
        <Controls setRulesOpen={props.setRulesOpen} />
      </div>
    </div>
  );
}

export default Sidebar;
