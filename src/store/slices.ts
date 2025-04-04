import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { StopsFirebase } from "../types/StopsFirebase";

// Create a counter slice
export const counterSlice = createSlice({
    name: "counter",
    initialState: { value: 0 },
    reducers: {
      increment: (state) => {
        state.value += 1;
      },
      decrement: (state) => {
        state.value -= 1;
      },
      setCount: (state, action: PayloadAction<number>) => {
        state.value = action.payload;
      },
    },
  });
  
  export const myFiltersSlice = createSlice({
    name: 'myfilters',
    initialState: {
      placeid: ''
      },
    reducers: {   
      setPlaceid: (state, action: PayloadAction<string>) => {       
          // update while search input changes
           state.placeid= action.payload;  
      }  
    },
  })
  
  // Non-persisted CounterB slice
  export const stopsSlice = createSlice({
    name: "stops",
    initialState: { 
      stops: [],
      },
    reducers: {
      setStops: (state, action: PayloadAction<StopsFirebase>) => {
        state.stops = action.payload;
      }, 
    },
  });
  


  import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  name: string;
  email: string;
}

const initialState: UserState = {
  name: '',
  email: '',
};




// Actions
export const { increment, decrement, setCount } = counterSlice.actions;
export default counterSlice.reducer;
export const { setStops } = stopsSlice.actions;
export default stopsSlice.reducer;
export const { setPlaceid} = myFiltersSlice.actions;
export default myFiltersSlice.reducer;
