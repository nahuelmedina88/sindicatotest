import { UPDATE_BUTTON_STATE, UPDATE_PATHNAME } from "../types";

const initialState = {
    pathname: "",
    buttonPressed: true
};

const GeneralReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_PATHNAME:
            return {
                ...state,
                pathname: action.payload
            }
        case UPDATE_BUTTON_STATE:
            return {
                ...state,
                buttonPressed: action.payload
            }
        default:
            return state;
    }

}

export default GeneralReducer;