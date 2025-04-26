'use client';
import React, { useState, useEffect } from "react";
import styles from './stop.module.css';
import {stopsLocalstorage, completeStop} from "../../../helper";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { setLocalstorage, setMapClickedStop } from "../../../store/stopsSlice";
import Loader from "../../../components/Loader";
import { useRouter } from "next/navigation";
import { useMutate } from "../../../coreApi";



const StopView = () => {

  const [loading, setLoading] = useState(false);
  const [ride, setRide] = useState([]);
  const [status, setStatus] = useState({ stopId: null, action: null });
  const [routeid, setRouteid] = useState("");
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { data, error, loading: loadingB, fetchQuery } = useMutate();
  const { data: dataDS, error: errorDS, loading: loadingDS, fetchQuery: deleteStopAPI } = useMutate();
  // below is the toggler to re render home stops UI after update on local storage has been made
  const local = useAppSelector((state) => state.stops.updateLocalStorage);
  const localB = useAppSelector((state) => state.stops.updateMapclickStop);
  
  
  const navigateBrowser = (lat, lng) => {
    if (lat && lng) {
      const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
      window.open(googleMapsUrl, '_blank');
    } else {
      alert("Location not available");
    }
  }  

  useEffect(() => {
    const routeidfromlocal = localStorage.getItem("routeid");
    setRouteid(routeidfromlocal);
  }, []);

  useEffect(() => {
    const rideStop = stopsLocalstorage("rideDestination");
    setRide(rideStop);
  }, [localB]);

  useEffect(() => {
    if (!status.stopId || !status.action) return;
    setLoading(true);

    if (routeid) {
      if (status.action === "delete" ) {
        deleteStopAPI(`route/deletestop`, { method: 'DELETE', bodyData: {             
            routeId: routeid, 
            stopId: status.stopId
          }
       });
      } else {
        fetchQuery(`route/updatestatus`, { method: 'PUT', bodyData: {      
          routeId: routeid, 
          status: status.action,
          stopId: status.stopId,
          time: new Date()       
        }
      });
      } 
    } else {
      completeStop(status.stopId, status.action);
      if (status.action === "delete") {
        console.log("Trying to go back");
        dispatch(setLocalstorage(!local));
        router.back();        
        console.log("router.back() called");
      }
    }
  },[status]);

 
  useEffect(() => {
     console.log(loadingB, loadingDS)
     if (!status.stopId || !status.action) return;
    if (error || errorDS) {
      console.error("Error:", error);
      setLoading(false);
      alert("Error: Unable to update stop. Please try again.");
      return;
    } 
    
    if (data?.success || dataDS?.success) {
      completeStop(status.stopId, status.action);
      if (status.action === "delete" || status.action=== "pending") {
        console.log("Trying to go back");
        dispatch(setLocalstorage(!local));
        router.back();
        console.log("router.back() called");
      } else {
        const stops = stopsLocalstorage("stops");
        const pendingstops  =  stops.filter(item => item.status === "pending");
        if (pendingstops.length > 0) {
          localStorage.setItem('rideDestination', JSON.stringify([pendingstops[0]]));
          console.log("supected start")
          // below logic to re render map screen plus this screen e.g stop view 
          dispatch(setLocalstorage(!local));
          dispatch(setMapClickedStop(!localB));
          setLoading(false);
          console.log("supected end") 
        } else {
          dispatch(setLocalstorage(!local));
          // Clear rideDestination and redirect
          localStorage.setItem('rideDestination', JSON.stringify([]));
          
          // dispatch(setMapClickedStop(!localB));
          // window.location.reload();
          router.back()
        }
       }
      }      
  }, [data, dataDS, error, errorDS]);

  return (
    <div className={styles.stopCard}>
      <div><div className={styles.dragIcon}><div className={styles.dragBar}></div></div> </div>
      <div>
      <div className={styles.stopHeader}>
        <div className={styles.stopAddress}>{ride[0]?.name}</div>
        <button className={styles.closeBtn} onClick={()=> router.back()}>×</button>
      </div>
      </div>
      
      {routeid && ride[0].status === "pending" ? (
          <div className={styles.stopActions}>
          <div onClick={() => navigateBrowser(ride[0]?.lat, ride[0]?.lng)}>
            <button className={`${styles.btn} ${styles.navigate} ${styles.active}`}>
          <i className="fa-solid fa-arrow-up-right-from-square"></i> Navigate</button></div>
          <div className={styles.gridbtn}>
            <button className={`${styles.btn} ${styles.failed}`} 
                onClick={() => setStatus({ stopId: ride[0]?.stopId, action: "failed" })}>
              Failed</button>
            <button className={`${styles.btn} ${styles.delivered}`} 
                onClick={() => setStatus({ stopId: ride[0]?.stopId, action: "completed" })}>
              Delivered</button>     
          </div>        
        </div>
      ): ""}
    
    
      <div className={styles.stopSection}>
        <div className={styles.stopItem}><i className="fa-solid fa-location-dot"></i> &nbsp;{ride[0]?.description} </div>
      </div>

      <div className={styles.stopFooter}>
        {routeid && ride[0]?.status !== "pending" ? (
          <div className={styles.stopItem} onClick={() => setStatus({ stopId: ride[0]?.stopId, action: "pending" })}>
          <i className='fas fa-undo-alt' ></i> &nbsp;Undo stop </div>
        ): ""}       
        <div className={`${styles.stopItem} ${styles.remove}`} onClick={() => setStatus({ stopId: ride[0]?.stopId, action: "delete" })}>
          🗑️ Remove stop</div>
      </div>
      {/* Spinner Modal */}
      {loading && (<div className="modalBackground"> <Loader /></div>)}   
    </div>
  );
}

export default StopView;