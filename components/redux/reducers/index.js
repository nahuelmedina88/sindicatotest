import { combineReducers } from "redux";
import generalReducer from "./GeneralReducer";
import employeesReducer from "./employeesReducer";
import companiesReducer from "./companiesReducer";

export default combineReducers({
    employees: employeesReducer,
    companies: companiesReducer,
    general: generalReducer
})