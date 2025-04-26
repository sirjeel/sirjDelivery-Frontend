'use client';
import React, { useState, useEffect } from "react";
import styles from './stop.module.css';
import {stopsLocalstorage, completeStop} from "../../../helper";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import Loader from "../../../components/Loader";
import { useRouter } from "next/navigation";
import StopBar from "../../../components/MobileApp/stopsbar/StopBar";


const StopView = () => {

  const [loading, setLoading] = useState(false);
  const [errStops, setErrorstops] = useState([]);
  const [refreshpage, setRefresh] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  
  const handleErrorStops = (id) => {
    setLoading(true);
    const  stops  =  stopsLocalstorage('stops')
    const index = stops.findIndex(item => item.stopId === id);
    if (index !== -1) { stops.splice(index, 1); } else { console.warn(`Stop with id ${id} not found.`)}
    localStorage.setItem('stops', JSON.stringify(stops));
    setLoading(false);
    setRefresh(!refreshpage);
  }
     
 
      

  useEffect(() => {
    const  fetchstops  =  stopsLocalstorage('stops');
    const  errStops  =  fetchstops.filter(item => item.status === "error");
      setErrorstops(errStops);
    }, [refreshpage]);



  return (
    <div className={styles.stopCard}>
      <div><div className={styles.dragIcon}><div className={styles.dragBar}></div></div> </div>
      <div>
      <div className={styles.stopHeader}>
        <div > <p className={styles.errorText}> {errStops.length} Stops with Error !</p></div>
        <button className={styles.closeBtn} onClick={()=> router.back()}>×</button>
      </div>
      </div>
      <div className={styles.results}>
          {errStops?.map((item, index) => (
            <div className={styles.todoList}>
            <div className={styles.proremove}><i className="fa-solid fa-flag"></i></div>
            <div className={styles.todoTextB}>{item.name}</div>
            <div className={styles.proremove} onClick={() => handleErrorStops(item.stopId)}>
            <i className="fa-solid fa-trash"></i>
            </div>  
            </div>
          ))}
      </div>  
      {/* Spinner Modal */}
      {loading && (<div className="modalBackground"> <Loader /></div>)}   
    </div>
  );
}

export default StopView;