"use client";
import styles from "./page.module.css";
import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { setView } from "../../../store/stopsSlice";
import Autocomplete from "../../../components/MobileApp/autocomplete/Autocomplete";
import { stopsLocalstorage, getRouteId } from "../../../helper";
import { useMutate } from "../../../coreApi";
import MapResults from "../../../components/MobileApp/mapResults/MapResults";
import Loader from "../../../components/Loader";

const RouteinProgress = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [stops, setStops] = useState([]);  
  const viewState = useAppSelector((state) => state.stops.view);
  const [metrics, setMetrics] = useState([]);
  const [startroute, setStartroute] = useState(false);
  const [loading, setLoading] = useState(false);
  const updateLocalStorage = useAppSelector((state) => state.stops.updateLocalStorage);
  const local = useAppSelector((state) => state.stops.updateLocalStorage);
  const { data, error, loading: loadingB, fetchQuery } = useMutate();
  const { data: dataD, error: errorD, loading: loadingD, fetchQuery: deleteRoute } = useMutate();
 const routeid = getRouteId();


  const layout = () => {
    if (viewState === "startRoute") {
      return styles.layoutC;
    } else if (viewState === "finishRoute") {
      return styles.layout;
    } else {
      return styles.layoutB;
    }
  };

  


  useEffect(() => {
    const idfromAPI = data?._id; // to be taken from API response
    console.log("idfromAPI", idfromAPI);
    if (idfromAPI) {
      localStorage.setItem('routeid', idfromAPI); 
    const pendingStops = stops.filter((item) => item.status === "pending");
    // below to be taken from API response
    dispatch(setView("inProgress"));
    localStorage.setItem('rideDestination', JSON.stringify([pendingStops[0]]));  
    router.push('/home/ride');
    } 
  },[data]);
 
  const startRoute = () => {
    setLoading(true); 
    const  startStop =  stopsLocalstorage('startStop');
    const  endStop=  stopsLocalstorage('endStop');
    const  cleanedStops  =  stops.filter(item => item.status !== "error");
    localStorage.setItem('stops', JSON.stringify(cleanedStops));
    fetchQuery(`route/create`, { method: 'POST', bodyData: {stops: cleanedStops, metrics: metrics, start: startStop, end: endStop}  });       
  };

const finishRoute = () => {
  setLoading(true);
  
  // clean up app state  
  localStorage.setItem('routeid', ""); 
  localStorage.setItem('stops', JSON.stringify([]));
  localStorage.setItem('rideDestination', JSON.stringify([]));
  localStorage.setItem('startStop', JSON.stringify([]));
  localStorage.setItem('endStop', JSON.stringify([]));  
  localStorage.setItem('metrics', JSON.stringify([]));
  
  window.location.reload();
};


  useEffect(() => {
    const  stopsL =  stopsLocalstorage('stops');
    if (stopsL?.length > 0) setStops(stopsL);    
    // update below line to delete routeid from backend
    if (stopsL?.length === 0 && routeid) {
      localStorage.setItem("metrics", JSON.stringify([]));
      deleteRoute(`route/deleteOneroute`, { method: 'DELETE', bodyData: {id: routeid}  });
      localStorage.setItem('routeid', ""); 
       window.location.reload();
    }  
    const  metricsData =  stopsLocalstorage('metrics');   
    setMetrics(metricsData);
    const pendingStops = stopsL.filter((item) => item.status === "pending");
    if (pendingStops.length > 0 && !routeid) dispatch(setView("startRoute"));    
    if (pendingStops.length === 0 && routeid) dispatch(setView("finishRoute"));
    if (pendingStops.length > 0 && routeid) dispatch(setView("inProgress"));
    if (pendingStops.length === 0 && !routeid) dispatch(setView("")); 
  }, [updateLocalStorage]);


  return (
    <div className={layout()}>
      {/* Search and Camera row */}
      <div><div className={styles.dragIcon}><div className={styles.dragBar}></div></div> </div>
      <div><div className={styles.arrowStyle}>
        <div className={styles.navRight} onClick={() => {setLoading(true); router.push("/home")}}>
            <i className="fa-solid fa-arrow-left"></i>
          </div>
          <div className={styles.searchbarArrow}><Autocomplete /></div></div>
      </div>

      {/* Metrics Row */}
      {viewState === "startRoute" ? (
        ""
      ) : (
        <div><div className={styles.metrics}>
            <p>{metrics[0]?.durationHours} hr {stops.length} stops - {metrics[0]?.distanceKm} km - Finish Time {metrics[0]?.finishTime}</p>
          </div>
        </div>
      )}

      {/* Selected Stops */}
      <div className={styles.results}>
      <MapResults stops={stops} routeId={routeid}/>        
      </div>

      {/* Route Buttons onClick={handleOptimize}*/}
      {viewState === "startRoute" ? (
        <div className={styles.buttonWrapper} onClick={startRoute}>
            <button className={styles.btnTheme}>
            <span className={styles.btnText}>Start Route</span>
          </button>
        </div>
      ) : viewState === "finishRoute" ? (
        <div className={styles.buttonWrapper} onClick={finishRoute}>
          <button className={styles.btnTheme} style={{ "--custom-background-color": "#468252" }}>
            <span className={styles.btnText}>Finish Route</span>
          </button>
        </div>
      ) : ""}

      {/* Spinner Modal */}
      {loading && (<div className="modalBackground"><Loader /></div>)}
    </div>
  );
};

export default RouteinProgress;
