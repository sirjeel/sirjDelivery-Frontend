'use client';
import styles from "./stops.module.css";
import { useRouter } from "next/navigation";


const StopBar = ({ data }) => {
  const router = useRouter();
  const handleDestination = () => {
    localStorage.setItem('rideDestination', JSON.stringify([data]));
    router.push("home/ride")
  }

  return (
    <div className={styles.todoList} onClick={handleDestination}>
      <p className={styles.todoText}>{data.name}</p>
      </div>
  );
};

export default StopBar;
