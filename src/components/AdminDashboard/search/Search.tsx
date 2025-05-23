'use client';
import React, { useEffect } from "react";
import { useForm, type FieldValues } from "react-hook-form";
import styles from "./search.module.css";
import { useAppDispatch } from '../../../store/hooks';
import {flattenStops } from '../../../helper';
import {useMutate } from '../../../coreApi';
import { setStops } from '../../../store/stopsSlice';


const Search = () => {
  const dispatch =  useAppDispatch();
    const { data, error, loading: loadingB, fetchQuery } = useMutate();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
    trigger,
  } = useForm({
    mode: "onChange", // validate on change for instant feedback
  });

  useEffect(() => {
    if (error) {
        console.error("Error submitting query request:", error);
        alert("Submitting query request failed. Please try again");
        return;
    }
    if (!data) return
    if (data.routes.length > 0) {
      const flattenedStops = flattenStops(data?.routes);
      dispatch(setStops(flattenedStops));
    }
  }, [data, error]);
  

  const onSubmit = async (data: FieldValues) => {
    const { start, end } = data;
    console.log(start); // result is start "2025-04-03"    
    fetchQuery(`${process.env.NEXT_PUBLIC_API_URL}/route/fetchroutebetweenDates`, { method: 'POST', bodyData: {startDate: start, endDate: end }  });       
  }
 
  return (
    <div className={`${styles["record-header"]} ${styles.records}`}>
      <form className={styles.formM} onSubmit={handleSubmit(onSubmit)}>
        
        <div
          className={`${styles.startGrid} ${
            errors.start || errors.end ? styles.startGridError : ""
          }`}
        >
          <div className={styles.dateGrid}>
            <label className={styles.labeldate}>Start</label>
            <input
              type="date"
              className={styles.date}
              {...register("start", {
                required: "Start date is required",
              })}
              onChange={(e) => {
                register("start").onChange(e);
                trigger("end"); // revalidate end date when start changes
              }}
            />
          </div>

          <div className={styles.dateGrid}>
            <label className={styles.labelEnd}>End</label>
            <input
              type="date"
              className={styles.date}
              {...register("end", {
                required: "End date is required",
                validate: {
                  notFuture: (value) => {
                    const today = new Date().toISOString().split("T")[0];
                    return value <= today || "End date cannot be in the future";
                  },
                  notBeforeStart: (value) => {
                    const start = getValues("start");
                    return (
                      !start || value >= start || "End date cannot be before start date"
                    );
                  },
                },
              })}
            />
          </div>

          {errors.start && (
            <p className={styles.errorM}>{errors.start.message}</p>
          )}
          {errors.end && (
            <p className={styles.errorM}>{errors.end.message}</p>
          )}
        </div>

        <div 
           className={`${styles.searchGrid} ${
            errors.start || errors.end || errors.address ? styles.addressGridError : ""
          }`}
        >
          <div className={styles.name}>
            <input type="text" placeholder="Name" />
          </div>

          <div className={styles.name}>
            <input
              type="text"
              placeholder="Address"
              {...register("address", {
                minLength: {
                  value: 10,
                  message: "Address must be at least 10 characters",
                },
              })}
            />
          </div>         

          <div className={styles.searchButton}>
            <button
              className={styles.recordSearch}
              disabled={isSubmitting}
              type="submit"
            >
              Search
            </button>
          </div>
          {errors.start && (
            <p className={styles.errorM}></p>
          )}
          {errors.end && (
            <p className={styles.errorM}></p>
          )}
           {errors.address && (
            <p className={styles.errorM}>{errors.address.message}</p>
          )}
        </div>
      </form>
    </div>
  );
};

export default Search;
