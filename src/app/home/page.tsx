"use client";
import styles from "./page.module.css";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setLocalstorage } from "../../store/stopsSlice";
import Autocomplete from "../../components/MobileApp/autocomplete/Autocomplete";
import { stopsLocalstorage, goButton, megaCleanzing } from "../../helper";
import StopBar from "../../components/MobileApp/stopsbar/StopBar";
import StartStopBar from "../../components/MobileApp/startbar/StartStopBar";
import StartButton from "../../components/MobileApp/startLocationButton/StartButton";
import Loader from "../../components/Loader";
import EndButton from "../../components/MobileApp/endLocationButton/EndButton";


const Home = () => {
  const start = useAppSelector((state) => state.stops.start);
  const end = useAppSelector((state) => state.stops.end);
  const updateLocalStorage = useAppSelector((state) => state.stops.updateLocalStorage);
  const updatestartendstops = useAppSelector((state) => state.stops.updateStartButton);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [stops, setStops] = useState([]);
  const [errStops, setErrorstops] = useState([]);
  const [startStop, setStartStops] = useState([]);
  const [endStop, setEndStops] = useState([]);

 

  const renderWebviewStops = () => dispatch(setLocalstorage(!updateLocalStorage))

  useEffect(() => {          
    window.addEventListener('stopsUpdated', renderWebviewStops);
    console.log("Webview Eventlisteners has been added");

    return () => {
      window.removeEventListener('stopsUpdated', renderWebviewStops);
      console.log("Webview Eventlisteners has been removed");}
    }, []);

  useEffect(() => {
    const  fetchstops  =  stopsLocalstorage('stops')
    const  stops  =  fetchstops.filter(item => item.status === "pending");
    const  errStops  =  fetchstops.filter(item => item.status === "error");
    if (stops.length > 0) setStops(stops);
    if (errStops.length > 0) setErrorstops(errStops);      
    }, [updateLocalStorage]);

  useEffect(() => {
      const startStopL = stopsLocalstorage("startStop");
      const endStopL = stopsLocalstorage("endStop");
      if (startStopL.length > 0) setStartStops(startStopL);
      if (endStopL.length > 0) setEndStops(endStopL);         
      }, [updatestartendstops]);
  
  

  const handleOptimize = async () => {
    setLoading(true);
      // Prevent execution if there are less than 2 stops
      if (stops.length < 2) {
          console.warn("Insufficient stops: At least 2 stops are required.");
          alert("Please add at least 2 stops to optimize the route.");
          setLoading(false);
          return;
      }
    if (stops.length > 0) {
      const  fetchstops  =  stopsLocalstorage('stops')
      const  cleanedStops  =  fetchstops.filter(item => item.status !== "error");
      localStorage.setItem('stops', JSON.stringify(cleanedStops));
      
      const resp = await goButton();
      if (resp) {
        router.push("home/maps");
      }
    } else {
      setLoading(false);
      alert("No stops selected");
    }
  };



  return (
    <div className={styles.layout}>
      {/* Search and Camera row */}
      <div>
        <div className={styles.dragIcon}>
          <div className={styles.dragBar}></div>
        </div>
      </div>

      <div>
        <div className={styles.arrowStyle}>
          <div className={styles.searchbarArrow}><Autocomplete /></div>
          <div className={styles.navRight} onClick={() => {setLoading(true); router.push("home/maps");}}>
            <i className="fa-solid fa-arrow-right"></i>
          </div>
        </div>
      </div>

      {/* Start Section */}
      {startStop.length > 0 ? (
        <div className={styles.startlabelGrid}>
          <div className={styles.startlabel}><div><b>Start:</b></div><StartStopBar mode={"start"} data={startStop[0]} /></div></div>) : (
      start === "off" ? (
        <div className={styles.StartWrapper}><div className={styles.centerB}><StartButton /></div></div>
      ) : (
        <div className={styles.StartWrapper}><div className={styles.centerB}><Autocomplete mode={"start"} /></div></div>
      ))}

      {/* End  Section */}
      {endStop.length > 0 ? (
        <div className={styles.startlabelGrid}>
          <div className={styles.startlabel}><div><b>End:</b></div><StartStopBar mode={"end"} data={endStop[0]} /></div></div>) : (
      end === "off" ? (
        <div className={styles.StartWrapper}><div className={styles.centerC}><EndButton /></div></div>
      ) : (
        <div className={styles.StartWrapper}><div className={styles.centerB}><Autocomplete mode={"end"} /></div> </div>
      ))}

      {/* Selected Stops  */}
      <div className={styles.results}>
        <div >
        {errStops.length ? (<div className={styles.errorList} onClick={() => router.push("home/errorstops")}>
          <p className={styles.errorText}> {errStops.length} Stops with Error Tap here to see !</p></div>) : ""}
          {stops?.map((item, index) => (
            <StopBar key={index} data={item} />
          ))}
        </div>
      </div>

      {/* Optimize Route Button */}
      <div className={styles.buttonWrapper} onClick={handleOptimize}>
        <button className={styles.btnTheme}>
          <i className="fa-solid fa-arrows-rotate"></i>
          <span className={styles.btnText}>Optimize Route</span>
        </button>
      </div>

      {/* Spinner Modal */}
      {loading && (<div className="modalBackground"> <Loader /></div>)}
    </div>
  );
};

export default Home;
