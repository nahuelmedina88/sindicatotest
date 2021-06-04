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
// import axiosClient from "../config/axios";
import sweetAlert from "sweetalert2";


export function addCompanyAction(company, firebase) {
    return async (dispatch) => {

        dispatch(addCompany());
        try {
            // const response = await axiosClient.post("/api/empresas", company);
            // let ref = firebase.db.collection("empresas").doc();
            // company.id = ref.id;
            const response = await firebase.db.collection("empresas").add(company);
            //dispatch(addCompanySuccess(company));
        } catch (error) {
            console.log(error);
            dispatch(addCompanyFailure());
        }
    }
}

export function getCompaniesAction(firebase) {
    return async (dispatch) => {
        dispatch(getCompanies());
        try {
            // const response = await axiosClient.get("/api/empresas/");
            const response = firebase.db.collection("empresas");
            let empresas = await response.get();
            let companies = [];
            let i = 0;
            for (const empresa of empresas.docs) {
                companies.push(empresa.data());
                companies[i].id = empresa.id;
                i++;
            }
            dispatch(getCompaniesSuccess(companies));

        } catch (error) {
            console.log(error);
            dispatch(getCompaniesFailure());
        }
    }
}

export function editCompanyAction2(company) {
    return async (dispatch) => {
        dispatch(getCompanyToEdit(company));
    }
}

const getCompanyToEdit = (company) => ({
    type: EDIT_COMPANY,
    payload: company
});

export function editCompanyAction(company, firebase) {
    return async (dispatch) => {
        dispatch(getCompanyToEdit(company));
        console.log(JSON.stringify(company));
        try {
            // const response = await axiosClient.put(`/api/empleados/${employee._id}`, employee);
            console.log(JSON.stringify(company));
            const response = await firebase.db.collection("empresas").doc(company.id).set(company);
            console.log(response);
            dispatch(editCompanySuccess(company));
            sweetAlert.fire("Genial", "La empresa se editó correctamente", "success");
        } catch (error) {
            console.log(error);
            dispatch(editCompanyFailure(company));
            sweetAlert.fire({ title: "Oh no!", text: "Algo fue mal, intenta nuevamente", icon: "error" });
        }
    }
}

export function seeCompanyAction(company) {
    return (dispatch) => {
        dispatch(getCompanyToSee(company));
    }
}

const addCompany = () => ({
    type: ADD_COMPANY
});

const addCompanySuccess = (company) => ({
    type: ADD_COMPANY_SUCCESS,
    payload: company
});

const addCompanyFailure = () => ({
    type: ADD_COMPANY_FAILURE
});

const getCompanies = () => ({
    type: GET_COMPANIES
});

const getCompaniesSuccess = (companies) => ({
    type: GET_COMPANIES_SUCCESS,
    payload: companies
});

const getCompaniesFailure = () => ({
    type: GET_COMPANIES_FAILURE
});

const editCompanySuccess = (company) => ({
    type: EDIT_COMPANY_SUCCESS,
    payload: company
});

const editCompanyFailure = () => ({
    type: EDIT_COMPANY_FAILURE
});

const getCompanyToSee = (company) => ({
    type: SEE_COMPANY,
    payload: company
});