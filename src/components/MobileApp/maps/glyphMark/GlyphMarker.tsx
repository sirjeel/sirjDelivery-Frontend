
import styles from "./glyph.module.css";

type GlyphMarkerProps = {
  serial: number;
};


const GlyphMarker = ({ serial }: GlyphMarkerProps) => {
   return (
    <div className={styles.pin}><span>{serial}</span></div> 
   ) 
  };

  export default GlyphMarker;