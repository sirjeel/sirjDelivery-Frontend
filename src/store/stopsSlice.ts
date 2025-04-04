import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Stop } from "../types/index";


  

  // Non-persisted CounterB slice
  export const stopsSlice = createSlice({
    name: "stops",
    initialState: { 
      stops: [] as Stop[], 
      },
    reducers: {
      setStops: (state, action: PayloadAction<Stop[]>) => {
        state.stops = action.payload;
      }, 
    },
  });
  







// Actions

export const { setStops } = stopsSlice.actions;
export default stopsSlice.reducer;
