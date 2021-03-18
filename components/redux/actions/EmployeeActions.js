// import AddEmployee from "../components/NewEmployee";
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
    SEE_EMPLOYEE,
    EDIT_EMPLOYEE,
    EDIT_EMPLOYEE_SUCCESS,
    EDIT_EMPLOYEE_FAILURE,
    UPDATE_EMPLOYEES
} from "../types";
// import axiosClient from "../config/axios";
import sweetAlert from "sweetalert2";
//create new employees

export function addEmployeeAction(employee, firebase) {
    return async (dispatch) => {
        console.log(employee);
        dispatch(addEmployee());
        try {
            // await axiosClient.post("/api/empleados/", employee);
            await firebase.db.collection("empleados").add(employee);
            dispatch(addEmployeeSuccess(employee));
            sweetAlert.fire("Genial", "El empleado se agregó correctamente", "success");
        } catch (error) {
            console.log(error);
            dispatch(addEmployeeFailure(true));
            sweetAlert.fire({ title: "Oh no!", text: "Algo fue mal, intenta nuevamente", icon: "error" });
        }
    }
}

export function getEmployeesAction(firebase) {
    return async (dispatch) => {
        dispatch(getEmployees());

        try {
            // const response = await axiosClient.get("/api/empleados/");
            const response = firebase.db.collection("empleados");
            let empleados = await response.get();
            let employees = [];
            let i = 0;
            for (const emp of empleados.docs) {
                employees.push(emp.data());
                employees[i].id = emp.id;
                i++;
            }
            dispatch(getEmployeesSuccess(employees));
            // sweetAlert.fire("Genial", "El empleado se agregó correctamente", "success");
        } catch (error) {
            console.log(error);
            dispatch(getEmployeesFailure());
            // sweetAlert.fire({ title: "Oh no!", text: "Algo fue mal, intenta nuevamente", icon: "error" });
        }
    }
}

export function deleteEmployeeAction(id, firebase) {
    return async (dispatch) => {
        dispatch(getEmployeeDelete(id));
        try {
            // const response = await axiosClient.delete(`/api/empleados/${id}`);

            firebase.db.collection("empleados").doc(id).delete();
            dispatch(getEmployeeDeleteSuccess());
        } catch (error) {
            dispatch(getEmployeeDeleteFailure())
        }
    }
}

export function editEmployeeAction(employee, firebase) {
    return async (dispatch) => {
        dispatch(getEmployeeToEdit(employee));
        try {
            // const response = await axiosClient.put(`/api/empleados/${employee._id}`, employee);
            const response = await firebase.db.collection("empleados").doc(employee.id).set(employee);
            dispatch(editEmployeeSuccess(employee));
            sweetAlert.fire("Genial", "El empleado se editó correctamente", "success");
        } catch (error) {
            console.log(error);
            dispatch(editEmployeeFailure(employee));
            sweetAlert.fire({ title: "Oh no!", text: "Algo fue mal, intenta nuevamente", icon: "error" });
        }
    }
}

export function editEmployeeAction2(employee, firebase) {
    return async (dispatch) => {
        dispatch(getEmployeeToEdit(employee));
    }
}

export function seeEmployeeAction(employee) {
    return async (dispatch) => {
        dispatch(getEmployeeToSee(employee));
    }
}


export function updateEmployeesAction(employees) {
    return (dispatch) => {
        dispatch(updateEmployees(employees));
    }
}

export function searchEmployeeAction(valores, firebase) {
    return async (dispatch) => {
        dispatch(getEmployeeToEdit(employee));
        try {
            // const response = await axiosClient.put(`/api/empleados/${employee._id}`, employee);
            const response = await firebase.db.collection("empleados").doc(employee.id).set(employee);
            dispatch(editEmployeeSuccess(employee));
            // sweetAlert.fire("Genial", "El empleado se editó correctamente", "success");
        } catch (error) {
            console.log(error);
            dispatch(editEmployeeFailure(employee));
            // sweetAlert.fire({ title: "Oh no!", text: "Algo fue mal, intenta nuevamente", icon: "error" });
        }
    }
}

export function getEmployeesByDateAction(values, firebase) {
    return async (dispatch) => {
        // dispatch(getEmployeeToEdit(employee));
        try {
            // const response = await axiosClient.put(`/api/empleados/${employee._id}`, employee);
            console.log("values: " + values);
            console.log("JsON: " + JSON.stringify(values));
            let employeesRef = firebase.db.collection("empleados");
            let response = "";
            if (values.empresa === "Padrón General" || values.empresa === "") {
                response = await employeesRef
                    .where("fecha_ingreso", ">", values.fecha_desde)
                    .where("fecha_ingreso", "<", values.fecha_hasta);
            } else {
                response = await employeesRef
                    .where("fecha_ingreso", ">", values.fecha_desde)
                    .where("fecha_ingreso", "<", values.fecha_hasta)
                    .where("empresa.nombre", "==", values.empresa);
            }
            let empleados = await response.get();
            let employees = [];
            let i = 0;
            for (const emp of empleados.docs) {
                employees.push(emp.data());
                employees[i].id = emp.id;
                i++;
            }
            // dispatch(updateEmployees(employees));
            dispatch(getEmployeesSuccess(employees));
            // sweetAlert.fire("Genial", "El empleado se editó correctamente", "success");
        } catch (error) {
            console.log(error);
            dispatch(getEmployeesFailure(employees));
            // sweetAlert.fire({ title: "Oh no!", text: "Algo fue mal, intenta nuevamente", icon: "error" });
        }
    }
}


const getEmployeeDelete = (id) => ({
    type: GET_EMPLOYEE_DELETE,
    payload: id
});

const getEmployeeDeleteSuccess = (employees) => ({
    type: EMPLOYEE_DELETE_SUCCESS,
    payload: employees
});

const getEmployeeDeleteFailure = () => ({
    type: EMPLOYEE_DELETE_FAILURE,
    payload: true
});

const getEmployeesFailure = () => ({
    type: GET_EMPLOYEES_FAILURE,
    payload: true
});

const getEmployeesSuccess = (employees) => ({
    type: GET_EMPLOYEES_SUCCESS,
    payload: employees
});

const getEmployees = () => ({
    type: GET_EMPLOYEES,
    payload: true
});

const addEmployee = () => ({
    type: ADD_EMPLOYEE,
    payload: true
});

const addEmployeeSuccess = employee => ({
    type: ADD_EMPLOYEE_SUCCESS,
    payload: employee
});

const addEmployeeFailure = state => ({
    type: ADD_EMPLOYEE_FAILURE,
    payload: state
});



const getEmployeeToEdit = (employee) => ({
    type: EDIT_EMPLOYEE,
    payload: employee
});
const getEmployeeToSee = (employee) => ({
    type: SEE_EMPLOYEE,
    payload: employee
});

const editEmployeeSuccess = (employee) => ({
    type: EDIT_EMPLOYEE_SUCCESS,
    payload: employee
});

const editEmployeeFailure = () => ({
    type: EDIT_EMPLOYEE_FAILURE
});


const updateEmployees = (employees) => ({
    type: UPDATE_EMPLOYEES,
    payload: employees
});
