
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {stopsSlice} from "./stopsSlice";





const rootReducer = combineReducers({
  stops: stopsSlice.reducer, // included properly now
});


// Store
export const makeStore = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
  devTools: process.env.NODE_ENV !== 'production',
});


// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];