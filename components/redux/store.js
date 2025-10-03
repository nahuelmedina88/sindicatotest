// components/redux/store.js
import { useMemo } from "react";
import { configureStore } from "@reduxjs/toolkit";
import reducer from "./reducers";

let store;

function initStore(preloadedState) {
  return configureStore({
    reducer,
    preloadedState,
    // thunk ya viene habilitado; devTools enciende solo en dev
    devTools: process.env.NODE_ENV !== "production",
  });
}

export const initializeStore = (preloadedState) => {
  let _store = store ?? initStore(preloadedState);
  if (preloadedState && store) {
    _store = initStore({ ...store.getState(), ...preloadedState });
    store = undefined;
  }
  if (typeof window === "undefined") return _store;
  if (!store) store = _store;
  return _store;
};

export function useStore(initialState) {
  return useMemo(() => initializeStore(initialState), [initialState]);
}