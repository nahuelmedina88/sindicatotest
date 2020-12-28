import { UPDATE_PATHNAME, UPDATE_BUTTON_STATE } from "../types";

export function updatePathnameAction(pathname) {
    return (dispatch) => {
        dispatch(updatePathname(pathname));
    }
}
export function updateButtonStateAction(newState) {
    return (dispatch) => {
        dispatch(updateButtonState(newState));
    }
}

const updatePathname = (pathname) => ({
    type: UPDATE_PATHNAME,
    payload: pathname
});

const updateButtonState = (newState) => ({
    type: UPDATE_BUTTON_STATE,
    payload: newState
});