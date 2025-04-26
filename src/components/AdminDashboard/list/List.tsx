'use client';

import React, {useEffect} from "react";
import styles from "./list.module.css";
import { formatToUKTime} from "../../../helper";
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { setStops } from '../../../store/stopsSlice';

const List = () => {
const stops = useAppSelector((state) => state.stops.stops); // stops slice → stops array
const dispatch = useAppDispatch();

  
  // const [stops, setStops] = useState([]);

      /*
  useEffect(() => {
    async function fetchStops() {
      try {
        const response = await getMostRecentRouteAndFilteredStops();
        console.log( response);
        dispatch(setStops(response?.sortedStops)); // Dispatch the action to set stops in the Redux store
      } catch (error) {
        console.error("Error fetching stops:", error);
      }
    }

    fetchStops();
  }, []);
  
 */

  return (
    <div className={styles.listdashgrid}>
    {stops?.map((item, index) => {
      const dateTime = formatToUKTime(item?.time) ; 
      return (
        <div className={`row ${styles.dashgrid}`} key={index}>
          <div className={styles.serial}>{index + 1}</div>
          <div className={styles.clientB}>{dateTime.length > 0? dateTime[0]: ""}</div>
          <div className={styles.clientB}></div>
          <div>
            <div className={styles["client-info"]}>
              <h4>{item?.description}</h4>
            </div>
          </div>
          <div className={styles.clientC}>{dateTime.length > 0? dateTime[1]: ""}</div>
          <div
            className={`${styles.clientC} ${
              item.status === "completed"
                ? styles.success
                : item.status === "failed"
                ? styles.fail
                : ""
            }`}
          >
            {item?.status}
          </div>
        </div>
      );
    })}
  </div>
  );
};

export default List;
