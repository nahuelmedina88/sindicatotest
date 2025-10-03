// components/redux/actions/EmployeeActions.js

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
  UPDATE_EMPLOYEES,
} from "../types";

import sweetAlert from "sweetalert2";

// Firestore (SDK modular)
import { db } from "../../../lib/firebaseClient";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  setDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";

// -----------------------------------------
// Helpers
// -----------------------------------------
const mapSnapToEmployees = (snap) =>
  snap.docs.map((d) => ({ id: d.id, ...d.data() }));

const sortByApellido = (arr) =>
  arr.sort((a, b) => (a.apellido > b.apellido ? 1 : b.apellido > a.apellido ? -1 : 0));

// -----------------------------------------
// Action Creators (CRUD)
// -----------------------------------------

export function addEmployeeAction(employee) {
  return async (dispatch) => {
    dispatch(addEmployee());
    try {
      await addDoc(collection(db, "empleados"), employee);
      // No disparamos addEmployeeSuccess para evitar doble render según tu comentario original
      sweetAlert.fire("Genial", "El empleado se agregó correctamente", "success");
    } catch (error) {
      console.log(error);
      dispatch(addEmployeeFailure(true));
      sweetAlert.fire({
        title: "Oh no!",
        text: "Algo fue mal, intenta nuevamente",
        icon: "error",
      });
    }
  };
}

export function getEmployeesAction() {
  return async (dispatch) => {
    dispatch(getEmployees());
    try {
      const snap = await getDocs(collection(db, "empleados"));
      let employees = mapSnapToEmployees(snap);
      employees = sortByApellido(employees);
      dispatch(getEmployeesSuccess(employees));
    } catch (error) {
      console.log(error);
      dispatch(getEmployeesFailure());
    }
  };
}

export function getEmployeesActiveActionServer() {
  return async (dispatch) => {
    dispatch(getEmployees());
    try {
      const q = query(collection(db, "empleados"), where("estado", "==", "Activo"));
      const snap = await getDocs(q);
      const employees = mapSnapToEmployees(snap);
      dispatch(getEmployeesSuccess(employees));
    } catch (error) {
      console.log(error);
      dispatch(getEmployeesFailure());
    }
  };
}

export function getEmployeesActiveAction() {
  return async (dispatch) => {
    dispatch(getEmployees());
    try {
      const q = query(collection(db, "empleados"), where("estado", "==", "Activo"));
      const snap = await getDocs(q);
      const employees = mapSnapToEmployees(snap);
      dispatch(getEmployeesSuccess(employees));
    } catch (error) {
      console.log(error);
      dispatch(getEmployeesFailure());
    }
  };
}

export function getEmployeesNoActiveAction() {
  return async (dispatch) => {
    dispatch(getEmployees());
    try {
      const q = query(collection(db, "empleados"), where("estado", "==", "Inactivo"));
      const snap = await getDocs(q);
      const employees = mapSnapToEmployees(snap);
      dispatch(getEmployeesSuccess(employees));
    } catch (error) {
      console.log(error);
      dispatch(getEmployeesFailure());
    }
  };
}

export function deleteEmployeeAction(id) {
  return async (dispatch) => {
    dispatch(getEmployeeDelete(id));
    try {
      await deleteDoc(doc(db, "empleados", id));
      dispatch(getEmployeeDeleteSuccess());
    } catch (error) {
      dispatch(getEmployeeDeleteFailure());
    }
  };
}

export function editEmployeeAction(employee) {
  return async (dispatch) => {
    dispatch(getEmployeeToEdit(employee));
    try {
      await setDoc(doc(db, "empleados", employee.id), employee);
      dispatch(editEmployeeSuccess(employee));
      sweetAlert.fire("Genial", "El empleado se editó correctamente", "success");
    } catch (error) {
      console.log(error);
      dispatch(editEmployeeFailure(employee));
      sweetAlert.fire({
        title: "Oh no!",
        text: "Algo fue mal, intenta nuevamente",
        icon: "error",
      });
    }
  };
}

export function editEmployeeWithoutAlertAction(employee) {
  return async (dispatch) => {
    dispatch(getEmployeeToEdit(employee));
    try {
      await setDoc(doc(db, "empleados", employee.id), employee);
      dispatch(editEmployeeSuccess(employee));
    } catch (error) {
      dispatch(editEmployeeFailure(employee));
    }
  };
}

// Mantengo esta firma por compatibilidad, pero no hace nada (se usaba como placeholder)
export function editEmployeeAction2(employee) {
  return async (dispatch) => {
    dispatch(getEmployeeToEdit(employee));
  };
}

export function seeEmployeeAction(employee) {
  return (dispatch) => {
    dispatch(getEmployeeToSee(employee));
  };
}

export function updateEmployeesAction(employees) {
  return (dispatch) => {
    dispatch(updateEmployees(employees));
  };
}

// -----------------------------------------
// Búsquedas / filtros
// -----------------------------------------

export function getEmployeesByDateAction(values) {
  // values: { fecha_desde, fecha_hasta, empresa? }
  return async (dispatch) => {
    try {
      const base = query(
        collection(db, "empleados"),
        where("fecha_ingreso", ">", values.fecha_desde),
        where("fecha_ingreso", "<", values.fecha_hasta)
      );

      const q =
        values.empresa === "Padrón General" || !values.empresa
          ? base
          : query(base, where("empresa.nombre", "==", values.empresa));

      const snap = await getDocs(q);
      const employees = mapSnapToEmployees(snap);
      dispatch(getEmployeesSuccess(employees));
    } catch (error) {
      console.log(error);
      dispatch(getEmployeesFailure());
    }
  };
}

export function getfoundationalWorkerListAction() {
  return async (dispatch) => {
    dispatch(getEmployees());
    try {
      const q = query(collection(db, "empleados"), where("padron_fundacional", "==", true));
      const snap = await getDocs(q);
      const employees = mapSnapToEmployees(snap);
      dispatch(getEmployeesSuccess(employees));
    } catch (error) {
      console.log(error);
      dispatch(getEmployeesFailure());
    }
  };
}

// Si realmente necesitás búsqueda por texto compuesto, armemos otra action separada
// por ahora dejamos este placeholder para no romper importadores existentes.
export function searchEmployeeAction() {
  return async () => {
    // TODO: implementar si la app lo usa (no había lógica válida en el original)
    return;
  };
}

// -----------------------------------------
// Action creators “puros”
// -----------------------------------------

const getEmployeeDelete = (id) => ({
  type: GET_EMPLOYEE_DELETE,
  payload: id,
});

const getEmployeeDeleteSuccess = (employees) => ({
  type: EMPLOYEE_DELETE_SUCCESS,
  payload: employees,
});

const getEmployeeDeleteFailure = () => ({
  type: EMPLOYEE_DELETE_FAILURE,
  payload: true,
});

const getEmployeesFailure = () => ({
  type: GET_EMPLOYEES_FAILURE,
  payload: true,
});

const getEmployeesSuccess = (employees) => ({
  type: GET_EMPLOYEES_SUCCESS,
  payload: employees,
});

const getEmployees = () => ({
  type: GET_EMPLOYEES,
  payload: true,
});

const addEmployee = () => ({
  type: ADD_EMPLOYEE,
  payload: true,
});

const addEmployeeSuccess = (employee) => ({
  type: ADD_EMPLOYEE_SUCCESS,
  payload: employee,
});

const addEmployeeFailure = (state) => ({
  type: ADD_EMPLOYEE_FAILURE,
  payload: state,
});

const getEmployeeToEdit = (employee) => ({
  type: EDIT_EMPLOYEE,
  payload: employee,
});

const getEmployeeToSee = (employee) => ({
  type: SEE_EMPLOYEE,
  payload: employee,
});

const editEmployeeSuccess = (employee) => ({
  type: EDIT_EMPLOYEE_SUCCESS,
  payload: employee,
});

const editEmployeeFailure = () => ({
  type: EDIT_EMPLOYEE_FAILURE,
});

const updateEmployees = (employees) => ({
  type: UPDATE_EMPLOYEES,
  payload: employees,
});