'use client';
import React, { useState, useEffect } from "react";
import styles from './stop.module.css';
import { stopsLocalstorage, completeStop, getRouteId } from "../../../helper";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { setLocalstorage, setMapClickedStop } from "../../../store/stopsSlice";
import Loader from "../../../components/Loader";
import { useRouter } from "next/navigation";
import { useMutate } from "../../../coreApi";

const StopView = () => {
  const [loading, setLoading] = useState(false);
  const [trigger, setTrigger] = useState(false);
  const [ride, setRide] = useState([]);
  const [status, setStatus] = useState({ stopId: null, action: null });
  const [routeid, setRouteid] = useState("");
  const urlbackend = process.env.NEXT_PUBLIC_API_URL

  const dispatch = useAppDispatch();
  const router = useRouter();

  const { data, error, fetchQuery } = useMutate();
  const { data: dataDS, error: errorDS, fetchQuery: deleteStopAPI } = useMutate();
  const { data: dataD, fetchQuery: deleteRoute } = useMutate();

  const local = useAppSelector(state => state.stops.updateLocalStorage);
  const localB = useAppSelector(state => state.stops.updateMapclickStop);

  // On mount: set routeid
  useEffect(() => {
    const routeidfromlocal = getRouteId();
    setRouteid(routeidfromlocal);
  }, []);

  const navigateBrowser = (lat, lng) => {
    if (lat && lng) {
      const url = `https://www.google.com/maps?q=${lat},${lng}`;
      window.open(url, "_blank");
    } else {
      alert("Location not available");
    }
  };


  // Load current ride from local storage
  useEffect(() => {
    const rideStop = stopsLocalstorage("rideDestination");
    setRide(rideStop);
  }, [localB]);

  // React to stop status changes
  useEffect(() => {
    if (!status.stopId || !status.action) return;
    setLoading(true);

    if (routeid) {
      if (status.action === "delete") {
        deleteStopAPI(`${urlbackend}/route/deletestop`, {
          method: 'DELETE',
          bodyData: { routeId: routeid, stopId: status.stopId }
        });
      } else {
        fetchQuery(`${urlbackend}/route/updatestatus`, {
          method: 'PUT',
          bodyData: {
            routeId: routeid,
            status: status.action,
            stopId: status.stopId,
            time: new Date()
          }
        });
      }
    } else {
      completeStop(status.stopId, status.action);
      setTrigger(prev => !prev);
    }
  }, [status]);

  // React to mutation results
  useEffect(() => {
    if (!status.stopId || !status.action) return;

    if (error || errorDS) {
      console.error("Error updating stop:", error || errorDS);
      alert("Error: Unable to update stop. Please try again.");
      setLoading(false);
      return;
    }

    if (data?.success || dataDS?.success) {
      completeStop(status.stopId, status.action);
      setTrigger(prev => !prev);
    }
  }, [data, dataDS, error, errorDS]);

  // Handle stop action follow-up
  useEffect(() => {
    if (!status.stopId || !status.action) return;

    if (status.action === "delete" || status.action === "pending") {
      // reset the action and status 
      setStatus({ stopId: null, action: null })
      dispatch(setLocalstorage(!local));
      router.push("/home/maps");
      /* below code is buggy result in stall in loading state is complex previous path is not known 
        setLoading(false); // <--- ADD THIS LINE
        dispatch(setLocalstorage(!local));
        router.back();
        console.log("router.back() called");*/
    }

    if (status.action === "completed" || status.action === "failed" ) {
      const stops = stopsLocalstorage("stops");
      const pending = stops.filter(item => item.status === "pending");
       // reset the action and status 
      setStatus({ stopId: null, action: null })

      if (pending.length > 0) {
        localStorage.setItem("rideDestination", JSON.stringify([pending[0]]));
        dispatch(setLocalstorage(!local));
        dispatch(setMapClickedStop(!localB));
      } else {
        localStorage.setItem("rideDestination", JSON.stringify([]));
        dispatch(setLocalstorage(!local));
        router.push("/home/maps");
       // before it is this> router.back();
      }
      setLoading(false);
    }
  }, [trigger]);

  // On all stops deleted
  useEffect(() => {
    if (dataDS) {
      const stops = stopsLocalstorage("stops");
      if (stops?.length === 0 && !!routeid) {
        localStorage.setItem("metrics", JSON.stringify([]));
        deleteRoute(`${urlbackend}/route/deleteOneroute`, {
          method: 'DELETE',
          bodyData: { id: routeid }
        });
      }
    }
  }, [dataDS]);

  // Final cleanup on route deletion
  useEffect(() => {
    if (dataD) {
      localStorage.removeItem("routeid");
      console.log("Route deleted. Sending message to ReactNativeWebView");
      window.ReactNativeWebView?.postMessage(JSON.stringify({ message: "routeid", routeid: "" }));
      setRouteid("");
      router.push("/home");
    }
  }, [dataD]);

  

  return (
    <div className={styles.stopCard}>
      <div className={styles.dragIcon}><div className={styles.dragBar}></div></div>

      <div className={styles.stopHeader}>
        <div className={styles.stopAddress}>{ride[0]?.name}</div>
        <button className={styles.closeBtn} onClick={() => router.push("/home/maps")}>×</button>
      </div>

      {routeid && ride[0]?.status === "pending" && (
        <div className={styles.stopActions}>
          <div onClick={() => navigateBrowser(ride[0]?.lat, ride[0]?.lng)}>
            <button className={`${styles.btn} ${styles.navigate} ${styles.active}`}>
              <i className="fa-solid fa-arrow-up-right-from-square"></i> Navigate
            </button>
          </div>
          <div className={styles.gridbtn}>
            <button className={`${styles.btn} ${styles.failed}`} 
              onClick={() => setStatus({ stopId: ride[0]?.stopId, action: "failed" })}>
              Failed
            </button>
            <button className={`${styles.btn} ${styles.delivered}`} 
              onClick={() => setStatus({ stopId: ride[0]?.stopId, action: "completed" })}>
              Delivered
            </button>
          </div>
        </div>
      )}

      <div className={styles.stopSection}>
        <div className={styles.stopItem}>
          <i className="fa-solid fa-location-dot"></i> &nbsp;{ride[0]?.description}
        </div>
      </div>

      <div className={styles.stopFooter}>
        {routeid && ride[0]?.status !== "pending" && (
          <div className={styles.stopItem} onClick={() => setStatus({ stopId: ride[0]?.stopId, action: "pending" })}>
            <i className="fas fa-undo-alt"></i> &nbsp;Undo stop
          </div>
        )}
        <div className={`${styles.stopItem} ${styles.remove}`} 
             onClick={() => setStatus({ stopId: ride[0]?.stopId, action: "delete" })}>
          🗑️ Remove stop
        </div>
      </div>

      {loading && <div className="modalBackground"><Loader /></div>}
    </div>
  );
};

export default StopView;
