import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { StopsFirebase } from "../types/index";


  

  // Non-persisted CounterB slice
  export const stopsSlice = createSlice({
    name: "stops",
    initialState: { 
      stops: [] as StopsFirebase[], 
      },
    reducers: {
      setStops: (state, action: PayloadAction<StopsFirebase[]>) => {
        state.stops = action.payload;
      }, 
    },
  });
  







// Actions

export const { setStops } = stopsSlice.actions;
export default stopsSlice.reducer;
