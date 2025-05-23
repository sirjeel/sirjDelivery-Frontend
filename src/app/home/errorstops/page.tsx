'use client';
import React, { useState, useEffect } from "react";
import styles from './stop.module.css';
import {stopsLocalstorage, getRouteId} from "../../../helper";
import {useMutate} from "../../../coreApi";
import Loader from "../../../components/Loader";
import { useRouter } from "next/navigation";


const StopView = () => {

  const [loading, setLoading] = useState(false);
  const [errStops, setErrorstops] = useState([]);
  const [refreshpage, setRefresh] = useState(false);  
  const [routeid, setRouteid] = useState("");
  const [stopid, setStopid] = useState("");
  const router = useRouter();
  const { data, error, fetchQuery} = useMutate();
  

    const urlbackend = process.env.NEXT_PUBLIC_API_URL
    // On mount: set routeid
    useEffect(() => {
      const routeidfromlocal = getRouteId();
      setRouteid(routeidfromlocal);
    }, []);

     useEffect(() => {
      if (error) {
        setLoading(false);
        alert("stop cannot be deleted please try again later")
      }
      if (data?.success ) {
        const  stops  =  stopsLocalstorage('stops')
        const index = stops.findIndex(item => item.stopId === stopid);
        if (index !== -1) { stops.splice(index, 1); } else { console.warn(`Stop with id ${stopid} not found.`)}
        localStorage.setItem('stops', JSON.stringify(stops));
        setStopid("");
        setLoading(false);
        setRefresh(prev => !prev);

      }
    }, [data, error]);
 
    useEffect(() => {
      if (stopid) {
    setLoading(true);
    const  stops  =  stopsLocalstorage('stops')
    if (routeid) {
     fetchQuery(`${urlbackend}/route/deletestop`, { method: 'DELETE',    bodyData: { routeId: routeid, stopId: stopid } });
    } else {
    const index = stops.findIndex(item => item.stopId === stopid);
    if (index !== -1) { stops.splice(index, 1); } else { console.warn(`Stop with id ${stopid} not found.`)}
    localStorage.setItem('stops', JSON.stringify(stops));
    setStopid("");
    setLoading(false);
    setRefresh(prev => !prev);

    } 
  }
    }, [stopid, routeid]);    

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
            <div className={styles.todoList} key={item.stopId || index}>
            <div className={styles.proremove}><i className="fa-solid fa-flag"></i></div>
            <div className={styles.todoTextB}>{item?.name}</div>
            <div className={styles.proremove} onClick={() => setStopid(item?.stopId)}>
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