'use client';
import styles from "./gps.module.css";
import { useAppSelector } from '../../../../store/hooks';
import { useMap } from '@vis.gl/react-google-maps';

const GpsLocation = () => {
  const userPosition = useAppSelector((state) => state.maps.userPosition);
  const map = useMap(); // ✅ Get map instance

  const updateLocation = () => {
    if (userPosition?.coords && map) {
      const position = {
        lat: userPosition.coords.latitude,
        lng: userPosition.coords.longitude,
      };
      map.panTo(position); // ✅ Smooth pan to location
    } else {
      alert("User location is not available yet.");
    }
  };

  return (
    <button className={styles["custom-map-control-button"]} onClick={updateLocation}>
      <span><i className="fa-solid fa-location-crosshairs"></i></span>
    </button>
  );
};

export default GpsLocation;
