import {
    ADD_EMPLOYEE,
    ADD_EMPLOYEE_SUCCESS,
    ADD_EMPLOYEE_FAILURE,
    GET_EMPLOYEES,
    GET_EMPLOYEES_SUCCESS,
    GET_EMPLOYEES_FAILURE,
    GET_EMPLOYEE_DELETE,
    EMPLOYEE_DELETE_SUCCESS,
    EMPLOYEE_DELETE_FAILURE,
    EDIT_EMPLOYEE,
    EDIT_EMPLOYEE_SUCCESS,
    EDIT_EMPLOYEE_FAILURE,
    UPDATE_EMPLOYEES
} from "../types";

const initialState = {
    employees: [],
    employeesSearch: [],
    error: false,
    loading: false,
    success: false,
    employeeToDelete: null,
    employeeToEdit: null
}


const employeesReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_EMPLOYEE:
            return {
                ...state,
                loading: action.payload
            }
        case ADD_EMPLOYEE_SUCCESS:
            return {
                ...state,
                loading: false,
                employees: [...state.employees, action.payload],
                error: false,
                success: true
            }
        case ADD_EMPLOYEE_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
                success: false
            }
        case GET_EMPLOYEES:
            return {
                ...state,
                loading: action.payload
            }
        case GET_EMPLOYEES_SUCCESS:
            return {
                ...state,
                loading: false,
                error: false,
                employees: action.payload
            }
        case GET_EMPLOYEES_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case GET_EMPLOYEE_DELETE:
            return {
                ...state,
                employeeToDelete: action.payload
            }
        case EMPLOYEE_DELETE_SUCCESS:
            return {
                ...state,
                employees: state.employees.filter(employee => employee.id !== state.employeeToDelete)
            }
        case EMPLOYEE_DELETE_FAILURE:
            return {
                ...state,
                error: true
            }
        case EDIT_EMPLOYEE:
            return {
                ...state,
                employeeToEdit: action.payload
            }
        case EDIT_EMPLOYEE_SUCCESS:
            return {
                ...state,
                employees: state.employees.map(emp =>
                    emp.id === action.payload.id ? emp = action.payload : emp)
            }
        case EDIT_EMPLOYEE_FAILURE:
            return {
                ...state,
                error: true
            }
        case UPDATE_EMPLOYEES:
            return {
                ...state,
                employeesSearch: action.payload
            }
        default:
            return state;
    }
}

export default employeesReducer;