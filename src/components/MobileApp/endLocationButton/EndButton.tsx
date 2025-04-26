'use client';
import styles from './autocomplete.module.css';
import { useAppDispatch} from "../../../store/hooks";
import { setEnd } from "../../../store/stopsSlice";
import  StartBar from '../startbar/StartStopBar';
import { stopsLocalstorage } from '../../../helper';

const EndButton = () => {
   const dispatch =  useAppDispatch();
   const  endstop  =  stopsLocalstorage('endStop');


  return (
    <div className={styles.searchContainer} onClick={() => dispatch(setEnd('on'))}>
      <div className={styles.iconGps}><span><i className="fa-solid fa-retweet"></i></span></div> 
            <div className={styles.searchBar} >           
              {endstop.length ? (
                <StartBar mode={'end'} data={endstop[0]} />
              ) : (
                <div className={styles.grid}>
                  <div className={styles.searchS}>Round trip</div>
                  <div className={styles.subtitle}>Roundtrip from current location</div>
                </div>
              )}              
            </div>
        <div className={styles.camIcon}><span><i className="fa-solid fa-chevron-down"></i></span></div>
    </div>    
  );
};

export default EndButton;
