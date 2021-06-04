import {
    ADD_COMPANY,
    ADD_COMPANY_FAILURE,
    ADD_COMPANY_SUCCESS,
    EDIT_COMPANY,
    EDIT_COMPANY_SUCCESS,
    EDIT_COMPANY_FAILURE,
    GET_COMPANIES,
    GET_COMPANIES_FAILURE,
    GET_COMPANIES_SUCCESS,
    SEE_COMPANY,
} from "../types";

const initialState = {
    error: null,
    companies: [],
    loading: false,
    companyToEdit: null,
    companyToSee: null,
}

const companiesReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_COMPANY:
            return {
                ...state,
                loading: true
            }
        case ADD_COMPANY_SUCCESS:
            return {
                ...state,
                companies: [...state.companies, action.payload],
                loading: false
            }
        case ADD_COMPANY_FAILURE:
            return {
                ...state,
                loading: false
            }
        case GET_COMPANIES:
            return {
                ...state,
                loading: true
            }
        case GET_COMPANIES_SUCCESS:
            return {
                ...state,
                loading: false,
                companies: action.payload
            }
        case GET_COMPANIES_FAILURE:
            return {
                ...state,
                loading: false
            }
        case EDIT_COMPANY:
            return {
                ...state,
                companyToEdit: action.payload
            }
        case EDIT_COMPANY_SUCCESS:
            return {
                ...state,
                companies: state.companies.map(emp =>
                    emp.id === action.payload.id ? emp = action.payload : emp)
            }
        case EDIT_COMPANY_FAILURE:
            return {
                ...state,
                error: true
            }
        case SEE_COMPANY:
            return {
                ...state,
                companyToSee: action.payload
            }
        default:
            return state;
    }
}

export default companiesReducer;

