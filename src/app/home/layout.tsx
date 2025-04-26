
import MapScreen from "../../components/MobileApp/maps/maps/MapScreen";

import styles from "./page.module.css";


const HomeLayout = ({ children }) => {
    return (
     <div className={styles.gridContainer}>
        <div className={styles.top}><MapScreen/></div>    
        <div className={styles.bottom}> {children} </div>  
     </div>
    )
  }
  

  export default HomeLayout;