import { createSlice, PayloadAction } from "@reduxjs/toolkit";


  /*
below are list of views
optimize
startRoute
inProgress
finishRoute
stopview  only id
  */

  // Non-persisted CounterB slice
  export const stopsSlice = createSlice({
    name: "stops",
    initialState: {  
      start:"off",
      end: "off",
      view: "", // default view is startRoute
      // below are dashboard stops
      stops: [],
      updateLocalStorage: false,
      updateStartButton: false,
      updateMapclickStop: false,
      },
    reducers: { 
      setStart: (state, action: PayloadAction<string>) => {
        state.start = action.payload;
      },
      setEnd: (state, action: PayloadAction<string>) => {
        state.end = action.payload;
      },
      setView: (state, action: PayloadAction<string>) => {
        state.view = action.payload;
      },
      setStops: (state, action) => {
        state.stops = action.payload;
      }, 
      setLocalstorage: (state, action: PayloadAction<boolean>) => {
        state.updateLocalStorage = action.payload;
      },
      setstartend: (state, action: PayloadAction<boolean>) => {
        state.updateStartButton = action.payload;
      },
      setMapClickedStop: (state, action: PayloadAction<boolean>) => {
        state.updateMapclickStop = action.payload;
      },
    },
  });


  



export const { setStops, setStart, setEnd, setView, setLocalstorage, setstartend, setMapClickedStop } = stopsSlice.actions;
export default stopsSlice.reducer;
