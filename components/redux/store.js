import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import reducer from "./reducers";
import { useMemo } from "react";

//Lo comentado era como funcionaba anteriormente Redux
// const store = createStore(
//     reducer,
//     compose(applyMiddleware(thunk),
//         typeof window === "object" &&
//             typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== "undefined" ?
//             window.__REDUX_DEVTOOLS_EXTENSION__() : f => f
//     )
// );
// export default store;
//Todo lo que se encuentra despues fue agregado posteriormente para trabajar con
//ServerSideRendering

let store

// function initStore(preloadedState = initialState) {
function initStore(preloadedState) {
    return createStore(
        reducer,
        preloadedState,
        compose(applyMiddleware(thunk),
            typeof window === "object" &&
                typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== "undefined" ?
                window.__REDUX_DEVTOOLS_EXTENSION__() : f => f
        )
    )
}

export const initializeStore = (preloadedState) => {
    let _store = store ?? initStore(preloadedState)

    // After navigating to a page with an initial Redux state, merge that state
    // with the current state in the store, and create a new store
    if (preloadedState && store) {
        _store = initStore({
            ...store.getState(),
            ...preloadedState,
        })
        // Reset the current store
        store = undefined
    }

    // For SSG and SSR always create a new store
    if (typeof window === 'undefined') return _store
    // Create the store once in the client
    if (!store) store = _store

    return _store
}

export function useStore(initialState) {
    const store = useMemo(() => initializeStore(initialState), [initialState])
    return store
}
