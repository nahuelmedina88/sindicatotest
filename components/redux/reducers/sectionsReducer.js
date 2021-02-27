import { GET_SECTIONS, GET_SECTIONS_FAILURE, GET_CATEGORIES } from "../types";

const initialState = {
    sections: [],
    error: false,
    categories: []
};

const sectionsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_SECTIONS:
            return {
                ...state,
                sections: action.payload
            }
        case GET_CATEGORIES:
            return {
                ...state,
                categories: action.payload
            }
        case GET_SECTIONS_FAILURE:
            return {
                ...state,
                error: action.payload
            }
        default:
            return state;
    }

}

export default sectionsReducer;