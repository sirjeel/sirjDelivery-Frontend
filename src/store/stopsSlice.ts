import { createSlice, PayloadAction } from "@reduxjs/toolkit";


  

  // Non-persisted CounterB slice
  export const stopsSlice = createSlice({
    name: "stops",
    initialState: { 
      stops: [], 
      },
    reducers: {
      setStops: (state, action) => {
        state.stops = action.payload;
      }, 
    },
  });
  







// Actions

export const { setStops } = stopsSlice.actions;
export default stopsSlice.reducer;
