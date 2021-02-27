import { combineReducers } from "redux";
import generalReducer from "./GeneralReducer";
import employeesReducer from "./employeesReducer";
import companiesReducer from "./companiesReducer";
import sectionsReducer from "./sectionsReducer";

export default combineReducers({
    employees: employeesReducer,
    companies: companiesReducer,
    general: generalReducer,
    sections: sectionsReducer
})