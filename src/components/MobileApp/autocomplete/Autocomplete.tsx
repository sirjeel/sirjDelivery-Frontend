'use client';
import React, { useState, useEffect, useCallback, useRef } from "react";
import styles from './autocomplete.module.css';
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { setStart, setEnd } from "../../../store/stopsSlice";
import { stopsLocalstorage, fetchData, debounce, addStop, getRouteId } from '../../../helper';
import { useMutate  } from '../../../coreApi';
import { Predictions } from "../../../types/index";
import { setLocalstorage, setstartend } from "../../../store/stopsSlice";

const Autocomplete = ({ mode = 'stops' }) => {
  const [inputValue, setInputValue] = useState('');
  const [predictions, setPredictions] = useState<Predictions[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const { data, error, loading: loadingB, fetchQuery } = useMutate();
  const [placeid, setSetplaceid] = useState("");
  const [newStop, setNewstop] = useState(null);

  // in redux id dont persist if app killed id lost therefore put in local storage to persist id 
  // to make sure id is available all times puttting in useeffect result in id got missed when state change
  // because useeffect has to be linked to redux that is pretty daunting task to sync redux with useeffect 
  const routeid = getRouteId();
   
  // below is the toggler to re render home stops UI after update on local storage has been made
   const local = useAppSelector((state) => state.stops.updateLocalStorage);
   const localB = useAppSelector((state) => state.stops.updateStartButton);

  const closeBar = () => {
    mode === "start" ? dispatch(setStart('off')) : dispatch(setEnd('off'));
  };



  // Debounced input value for predictions
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      if (value.trim().length < 8 || !/^[a-zA-Z0-9\s,.-]+$/.test(value)) {
        setPredictions([]);
        return;
      }
      fetchData(value).then(resp => {
        console.log("Predictions:", resp);
        setPredictions(resp || []);
      });
    }, 1500),
    []
  );

 

  const handleSelect = (stop) => {    
    if (mode === "start") {
      localStorage.setItem("startStop", JSON.stringify([stop]));
      // below is the toggler to re render home stops UI after update on local storage has been made
      dispatch(setstartend(!localB));
    } else if (mode === "end") {
      localStorage.setItem("endStop", JSON.stringify([stop]));
       // below is the toggler to re render home stops UI after update on local storage has been made
      dispatch(setstartend(!localB));
    } else {
      const stops = stopsLocalstorage("stops");
      localStorage.setItem("stops", JSON.stringify([...stops, stop]));
       // below is the toggler to re render home stops UI after update on local storage has been made
      dispatch(setLocalstorage(!local));
    }
    setInputValue('');
    setPredictions([]);
    closeBar();
  };

  useEffect(() => {
    if (data?.success || error) {
      if (data?.success) {
        // Only call handleSelect if we haven't already handled the stop
      if (newStop) {
        handleSelect(newStop);
        setNewstop(null); // ✅ prevent repeat
      }     
      } else {
        console.error("Error:", error);
        alert("Error: Unable to add stop. Please try again.");
        setInputValue('');
        setPredictions([]);
        closeBar();
        return
      }
    }    
  }, [data, error]);

  useEffect(() => {

    const addRideStop = async () => {
      if (placeid) {
        const stop = await addStop(placeid);
      if (!stop) {
        console.error("Error: Unable to add stop.");
        return;
      }
        if (routeid) {
          fetchQuery(`route/addstop`, { method: 'PUT', bodyData: { routeId: routeid, stop: stop } });
          setNewstop(stop);
        } else {
          handleSelect(stop);
        }
      }
    }     
    addRideStop();   
  }, [placeid]);

  useEffect(() => {
    debouncedSearch(inputValue);
  }, [inputValue, debouncedSearch]);

  const handleSearch = (value: string) => {
    setInputValue(value);
  };



  const takePhoto = async () => {
    try {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage('OPEN_CAMERA');
      }
    } catch (error) {
      console.error('Error in takePhoto:', error);
    }
  };

    // Handle click outside dropdown
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
          setInputValue('');
          setPredictions([]);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

   
     

  return (
    <div className={styles.searchContainer} ref={wrapperRef}>
      <div className={styles.materialIcon}>search</div>
      <div className={styles.searchBar}>
        <input
          placeholder="Add or find stops"
          value={inputValue}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
      <div className={styles.camIcon}>
        <span
          className={styles.materialIcon}
          onClick={mode === "stops" ? takePhoto : closeBar}
        >
          {mode === "stops" ? "center_focus_strong" : "close"}
        </span>
      </div>

      {predictions.length > 0 ? (
        <div className={styles.dropdown}>
          {predictions.map((item) => (
            <div
              key={item.place_id}
              className={styles.dropdownItem}
              onClick={() => {console.log(item.place_id); setSetplaceid(item.place_id)}}
            >
              <div className={styles.dropdownText}>{item.description}</div>
            </div>
          ))}
        </div>
      ): ""}
    </div>
  );
};

export default Autocomplete;
