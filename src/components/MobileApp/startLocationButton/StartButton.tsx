'use client';
import styles from './autocomplete.module.css';
import { useAppDispatch} from "../../../store/hooks";
import { setStart } from "../../../store/stopsSlice";
import  StartBar from '../startbar/StartStopBar';
import { stopsLocalstorage } from '../../../helper';

const StartButton = () => {
   const dispatch =  useAppDispatch();
   const  startstop  =  stopsLocalstorage('startStop');


  return (
    <div className={styles.searchContainer} onClick={() => dispatch(setStart('on'))}>
       <div className={styles.iconGps}><span><i className="fa-solid fa-location-crosshairs"></i></span></div>
            <div className={styles.searchBar} >           
              {startstop.length ? (
                <StartBar mode={'start'} data={startstop[0]} />
              ) : (
                <p className={styles.searchS}><b>Use current location</b></p>
              )}              
            </div>
        <div className={styles.camIcon}><span><i className="fa-solid fa-chevron-down"></i></span></div>
    </div>
  );
};

export default StartButton;
