import {
    ADD_COMPANY,
    ADD_COMPANY_FAILURE,
    ADD_COMPANY_SUCCESS,
    GET_COMPANIES,
    GET_COMPANIES_FAILURE,
    GET_COMPANIES_SUCCESS
} from "../types";
// import axiosClient from "../config/axios";


export function addCompanyAction(company, firebase) {
    return async (dispatch) => {

        dispatch(addCompany());
        try {
            // const response = await axiosClient.post("/api/empresas", company);
            // let ref = firebase.db.collection("empresas").doc();
            // company.id = ref.id;
            const response = await firebase.db.collection("empresas").add(company);
            dispatch(addCompanySuccess(company));
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
