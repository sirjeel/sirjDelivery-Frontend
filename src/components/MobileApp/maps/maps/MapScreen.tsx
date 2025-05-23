'use client';

import { AdvancedMarker, APIProvider, Map } from '@vis.gl/react-google-maps';
import { useState, useEffect, useCallback } from 'react';
import GlyphMarker from '../glyphMark/GlyphMarker';
import GpsLocation from '../gpsButton/GpsButton';
import { transformMarker, stopsLocalstorage } from '../../../../helper';
import { useAppSelector, useAppDispatch } from '../../../../store/hooks';
import { setMapClickedStop } from '../../../../store/stopsSlice';
import { setPosition, setCenter } from '../../../../store/mapsSlice';
import { useRouter, usePathname } from "next/navigation";
import styles from "./map.module.css";


const MapScreen = () => {
  const [selectedStop, setSelectedStop] = useState(null);
  const [stops, setStops] = useState([]);
  const userPosition = useAppSelector((state) => state.maps.userPosition);
  const centerPosition = useAppSelector((state) => state.maps.center);
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const updateLocalStorage = useAppSelector((state) => state.stops.updateLocalStorage);
  const local = useAppSelector((state) => state.stops.updateMapclickStop);
  const router = useRouter();
  


    useEffect(() => {
      const  fetchstops  =  stopsLocalstorage('stops')      
      const  cleanStops  =  fetchstops.filter(item => item.status !== "error");
       setStops(cleanStops);      
      }, [updateLocalStorage]);


  // Stable callback for geolocation update
  const handlePositionUpdate = useCallback(
    (position) => {
      dispatch(setPosition(position));
    },
    [dispatch]
  );

  const handleLocationError = useCallback((error) => {
    console.error("Error fetching geolocation: ", error.message);
  }, []);

  // Set up geolocation tracking inside useEffect with cleanup
  useEffect(() => {
    let watchId;

    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        handlePositionUpdate,
        handleLocationError,
        {
          enableHighAccuracy: true,
          maximumAge: 90000, // Cache location for 3 minutes
          timeout: 27000, // Timeout if unable to get location within 27 seconds
        }
      );
      console.log("GPS tracking started:", watchId);
    } else {
      alert("Geolocation is not supported by this browser.");
    }

    return () => {
      if (watchId !== undefined) {
        navigator.geolocation.clearWatch(watchId);
        console.log("GPS tracking stopped:", watchId);
      }
    };
  }, [handlePositionUpdate, handleLocationError]);

  // Load initial center location
  useEffect(() => {
    const adjustCenter = async () => {
      const locations = await transformMarker(stops); // get the locations from stops
  
      if (locations[0]?.position) {
        dispatch(setCenter(locations[0].position));        
      } else if (userPosition?.coords) {
        dispatch(setCenter({ lat: userPosition.coords.latitude, lng: userPosition.coords.longitude, }));        
      } else {
        return
      }
    };
  
    adjustCenter();
  }, [userPosition]); 

  // below use effect handles when user click on map screen stop the bottom sheet change and redirect to ride route
  useEffect(() => {
    if (selectedStop) {
      localStorage.setItem('rideDestination', JSON.stringify([selectedStop]));

      if (pathname === "/home/ride") {
        dispatch(setMapClickedStop(!local));
        
      } else {
        router.push("/home/ride");
      }
    }
  }, [selectedStop]);
   
 

  return (
    <div style={{ height: '50vh', width: '100vw' }}>
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API}>
        {centerPosition  ? (
          <>
          <Map
            defaultZoom={15}
            mapId='your-map-id'
            defaultCenter={centerPosition}
            reuseMaps={true}
            gestureHandling={'greedy'}
            disableDefaultUI={true}
            streetViewControl={false}
            fullscreenControl={true}
          >
            {stops.map((stop, index) => (
              <AdvancedMarker
                key={stop.stopId}
                position={{ lat: stop.lat, lng: stop.lng }}
                onClick={() => setSelectedStop(stop)}
              >
                <GlyphMarker serial={index + 1} status={stop?.status} />
              </AdvancedMarker>
            ))}  

            {userPosition?.coords && (
              <AdvancedMarker
                 position={{ lat: userPosition.coords.latitude, lng: userPosition.coords.longitude }} >
              <div className={styles["blue-dot-position"]}></div>
               </AdvancedMarker>
             )}

            {/* 
            {selectedStop && (
              <InfoWindow
                position={{ lat: selectedStop.lat, lng: selectedStop.lng }}
                onCloseClick={() => setSelectedStop(null)}
              >
                {selectedStop.name}
              </InfoWindow>
            )}
            */}            
          </Map>
           {/* Absolutely position the GPS button over the map */}
        <GpsLocation />          
      </>
        ) : (
        <div className={styles.modalBackground}>
          <div id="myModal" className="modal">
            <div className="modal-content">
              <div className={styles.ldsdualring}></div>
          </div>
        </div>
        </div> 
        )}
      </APIProvider>
    </div>
  );
};

export default MapScreen;
