
import styles from "./glyph.module.css";

type GlyphMarkerProps = {
  serial: number;
  status: string;
};


const GlyphMarker = ({ serial, status = "pending" }: GlyphMarkerProps ) => {
   return (
    <div className={`${styles.pin} ${status !== "pending" ? styles.pinfaded : null }`}><span>{serial}</span></div> 
   ) 
  };

  export default GlyphMarker;