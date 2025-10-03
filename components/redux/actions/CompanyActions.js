// components/redux/actions/CompanyActions.js
import {
  ADD_COMPANY,
  ADD_COMPANY_FAILURE,
  ADD_COMPANY_SUCCESS,
  GET_COMPANIES,
  GET_COMPANIES_FAILURE,
  GET_COMPANIES_SUCCESS,
  EDIT_COMPANY,
  EDIT_COMPANY_SUCCESS,
  EDIT_COMPANY_FAILURE,
  SEE_COMPANY,
} from "../types";

import sweetAlert from "sweetalert2";

// Firestore SDK modular
import { db } from "../../../lib/firebaseClient";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  setDoc,
} from "firebase/firestore";

// Normalizador para Timestamps / refs
import { normalizeFirestore } from "../utils/normalizeFirestore";

// -------------------------
// ACTION CREATORS PRIMITIVOS
const addCompany = () => ({ type: ADD_COMPANY });
const addCompanySuccess = (company) => ({ type: ADD_COMPANY_SUCCESS, payload: company });
const addCompanyFailure = () => ({ type: ADD_COMPANY_FAILURE });

const getCompanies = () => ({ type: GET_COMPANIES });
const getCompaniesSuccess = (companies) => ({ type: GET_COMPANIES_SUCCESS, payload: companies });
const getCompaniesFailure = () => ({ type: GET_COMPANIES_FAILURE });

const getCompanyToEdit = (company) => ({ type: EDIT_COMPANY, payload: company });
const editCompanySuccess = (company) => ({ type: EDIT_COMPANY_SUCCESS, payload: company });
const editCompanyFailure = () => ({ type: EDIT_COMPANY_FAILURE });

const getCompanyToSee = (company) => ({ type: SEE_COMPANY, payload: company });

// -------------------------
// THUNKS

export function addCompanyAction(company) {
  return async (dispatch) => {
    dispatch(addCompany());
    try {
      // default estado si viene vacío
      const payload = { estado: "Activo", ...company };
      const colRef = collection(db, "empresas");
      const newDoc = await addDoc(colRef, payload);
      dispatch(addCompanySuccess({ id: newDoc.id, ...payload }));
      sweetAlert.fire("Genial", "La empresa se agregó correctamente", "success");
    } catch (error) {
      console.error(error);
      dispatch(addCompanyFailure());
      sweetAlert.fire({ title: "Oh no!", text: "Algo fue mal, intenta nuevamente", icon: "error" });
    }
  };
}

export function getCompaniesAction() {
  return async (dispatch) => {
    dispatch(getCompanies());
    try {
      const colRef = collection(db, "empresas");
      const snap = await getDocs(colRef);

      let companies = [];
      snap.forEach((d) => {
        // normalizamos y seteamos defaults
        const data = normalizeFirestore(d.data());
        companies.push({
          id: d.id,
          estado: data?.estado ?? "Activo", // <-- default si falta
          ...data,
        });
      });

      // orden simple por nombre para que la UI salga consistente
      companies.sort((a, b) =>
        a?.nombre?.localeCompare?.(b?.nombre || "", "es", { sensitivity: "base" }) || 0
      );

      dispatch(getCompaniesSuccess(companies));
    } catch (error) {
      console.error(error);
      dispatch(getCompaniesFailure());
    }
  };
}

export function editCompanyAction(company) {
  return async (dispatch) => {
    dispatch(getCompanyToEdit(company));
    try {
      const { id, ...rest } = company;
      const ref = doc(db, "empresas", id);
      await setDoc(ref, rest, { merge: true });
      dispatch(editCompanySuccess(company));
      sweetAlert.fire("Genial", "La empresa se editó correctamente", "success");
    } catch (error) {
      console.error(error);
      dispatch(editCompanyFailure());
      sweetAlert.fire({ title: "Oh no!", text: "Algo fue mal, intenta nuevamente", icon: "error" });
    }
  };
}

export function editCompanyAction2(company) {
  return async (dispatch) => {
    dispatch(getCompanyToEdit(company));
  };
}

export function seeCompanyAction(company) {
  return (dispatch) => {
    dispatch(getCompanyToSee(company));
  };
}
