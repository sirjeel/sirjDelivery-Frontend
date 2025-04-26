'use client';
import React, { useState, useEffect } from "react";
import styles from "./start.module.css";
import { useAppDispatch, useAppSelector} from "../../../store/hooks";
import { setstartend } from "../../../store/stopsSlice";
import { StartStopBarProps } from "../../../types/index";

const StartStopBar: React.FC<StartStopBarProps> = ({ mode, data }) => {
  const [id, setId] = useState("");
  const dispatch = useAppDispatch();
   // below is the toggler to re render home stops UI after update on local storage has been made
  const local = useAppSelector((state) => state.stops.updateStartButton);
  


  useEffect(() => {
    const onPress = (selectedid: string) => {
      if (selectedid) {
        if (mode === "start") {
          localStorage.setItem('startStop', JSON.stringify([]));
        } else {
          localStorage.setItem('endStop', JSON.stringify([]));
        }
          // below is the toggler to re render home stops UI after update on local storage has been made
            dispatch(setstartend(!local));
      }
    };

    onPress(id);
  }, [id]);

  return (
    <div className={styles.todoList}>
      <div><div className={styles.todoText}>{data.name}</div></div>
      <div>
      <button className={styles.proRemove} onClick={() => setId(data.stopId)}>
      <i className="fa-solid fa-trash"></i>
      </button>
      </div>    
    </div>
  );
};

export default StartStopBar;
