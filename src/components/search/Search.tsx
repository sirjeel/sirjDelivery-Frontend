'use client';
import React from "react";
import { useForm, type FieldValues } from "react-hook-form";
import styles from "./search.module.css";
import {getRoutesBetweenDates} from "../../firebase/index";
import { useAppDispatch } from '../../store/hooks';
import { setStops } from '../../store/stopsSlice';
import { flattenStops } from "../../helper";

const Search = () => {
  const dispatch =  useAppDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
    trigger,
  } = useForm({
    mode: "onChange", // validate on change for instant feedback
  });

  const onSubmit = async (data: FieldValues) => {
    const { start, end } = data;
    console.log(start); // result is start "2025-04-03"
    const isoStringStart =  Math.floor(new Date(start).getTime() / 1000);
    const isoStringEnd = Math.floor(new Date(end).getTime() / 1000);
    const endingValue = isoStringEnd + 86400;
    console.log( isoStringStart);
    console.log( isoStringEnd);
    const response = await getRoutesBetweenDates(isoStringStart, endingValue);
    if (!response) {
      // response status is not 2xx
      console.error("Error submitting query request:", response.statusText);
      alert("Submitting query request failed. Please try again");
      return;
      };

      const flattenedStops = flattenStops(response);
      dispatch(setStops(flattenedStops));
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
