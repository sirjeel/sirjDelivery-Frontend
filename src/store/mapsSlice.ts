import { createSlice, PayloadAction } from "@reduxjs/toolkit";


  

export const mapsSlice = createSlice({
    name: "maps",
    initialState: { 
      userPosition: null, 
      center: null,
      },
    reducers: {
      setPosition: (state, action) => {
        state.userPosition = action.payload;
      }, 
      setCenter: (state, action) => {
        state.center = action.payload;
      },
    },
  });
  

  export const { setPosition, setCenter } = mapsSlice.actions;
  export default mapsSlice.reducer;