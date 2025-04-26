'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './results.module.css';

const ResultsB = ({ stops, routeId }) => {
  const [ride, setRide] = useState(null);
  const router = useRouter();
  useEffect(() => {
    if (!ride) return;

    localStorage.setItem('rideDestination', JSON.stringify([ride]));
    router.push('/home/ride');
  }, [ride, router]);

  // Early return if no stops
  if (!stops || stops.length === 0) return null;

  

  const handleStopClick = (stop) => setRide(stop);

  return (
    <div>
      {stops.map((stop, index) => {
        const isCompleted = stop.status === 'completed';
        const isFailed = stop.status === 'failed';

        const baseClass = isCompleted || isFailed ? styles.todoListB : styles.todoList;
        const textColor = isCompleted || isFailed ? 'grey' : undefined;
        const fontWeight = isCompleted || isFailed ? 'lighter' : undefined;

        return (
          <div
            key={stop.stopId}
            className={baseClass}
            style={{ cursor: 'default' }}
            onClick={() => handleStopClick(stop)}           
          >
            <div className={styles.serial} style={{ color: textColor, fontWeight }}>
              {index + 1}
            </div>

            <div className={styles.todoText} style={{ color: textColor }}>
              {stop.description}
            </div>

            {(isCompleted || isFailed) && (
              <div className={styles.proGoB}>
                <i
                  className={isCompleted ? 'fa fa-check-circle' : 'fa fa-times-circle'}
                  style={{ fontSize: '1.2rem', color: isCompleted ? 'green' : 'red' }}
                ></i>
              </div>
            )}

            {(!isCompleted && !isFailed && routeId) && (
              <div className={styles.proGo} >
                <i className="fa-solid fa-chevron-right" style={{ fontSize: '0.9rem' }}></i>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ResultsB;
