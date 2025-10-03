import React, { useState, useEffect, useContext, Fragment } from 'react';

import Select from 'react-select';
import styles from "./css/workerListByCompany.module.scss";
import Frame from "../components/layout/Frame";
import Search from "../components/ui/Search";
import WorkerList from "../components/WorkerList";
import { SearchBoxContext } from "../components/context/SearchBoxContext";

//Redux
import { useDispatch, useSelector } from "react-redux";
import { getEmployeesAction, getWorkerListByCompanyAction } from "../components/redux/actions/EmployeeActions";
import { getCompaniesAction } from "../components/redux/actions/CompanyActions";

//Firebase
import { FirebaseContext } from "../firebase";

//Material UI
import { CircularProgress } from '@mui/material';

import ExportButton from '../components/ui/ExportButton';

const workerListByCompany = () => {
    //Local States
    const [searchBoxValue, setSearchBoxValue] = useState("");
    const [companySelectValue, setCompanySelectValue] = useState("");

    const loading = useSelector(state => state.employees.loading);
    let employeesSelector = useSelector(state => state.employees.employees);
    let employeesSearch = useSelector(state => state.employees.employeesSearch);
    let employeesSorted = employeesSelector.sort((a, b) => (a.apellido > b.apellido) ? 1 : ((b.apellido > a.apellido) ? -1 : 0));
    employeesSorted = employeesSorted.filter(employee => employee.estado === "Activo");
    const dispatch = useDispatch();
    const { firebase, user } = useContext(FirebaseContext);
    const companiesSelector = useSelector(state => state.companies.companies);
    const companiesSelect = companiesSelector.map(company => ({
        id: company.id,
        value: company.id,
        label: company.nombre,
        ciudad: company.ciudad,
        domicilio: company.domicilio
    }));
    companiesSelect.push({
        id: 0,
        value: "Padron General",
        label: "Padrón General",
    });
    const loadEmployees = (firebase) => {
        dispatch(getEmployeesAction(firebase));
    }
    const loadCompanies = (firebase) => {
        dispatch(getCompaniesAction(firebase))
    }

    useEffect(() => {
        loadEmployees(firebase);
        loadCompanies(firebase);
    }, []);

    const handleChangeCompany = (option) => {
        setCompanySelectValue(option.label);
        dispatch(getWorkerListByCompanyAction(employeesSorted, option.label, searchBoxValue));
    }

    useEffect(() => {
        if (!user) {
            window.location.href = "/login";
        }
    }, []);

    return (
        <>
            <Frame>
                {loading ?
                    <div className={styles.content}>
                        <CircularProgress />
                    </div>
                    :
                    <Fragment>
                        <div className={styles.absCenterSelf}>
                            <SearchBoxContext.Provider value={
                                {
                                    searchBoxValue, setSearchBoxValue,
                                    companySelectValue, setCompanySelectValue
                                }
                            }>
                                <div className={styles.searchExportParent}>
                                    <Search
                                        employeesRedux={employeesSorted}
                                    />
                                    <ExportButton
                                        employeesSearch={employeesSearch}
                                        employeesSorted={employeesSorted}
                                    />
                                </div>
                                <div>
                                    <Select
                                        className={`inputSecondary ` + styles.myselect}
                                        options={companiesSelect}
                                        name="empresa"
                                        defaultValue={{ label: "Padrón General", value: 0 }}
                                        placeholder={"Seleccione un frigorífico"}
                                        onChange={handleChangeCompany}
                                    ></Select>
                                </div>
                                <WorkerList
                                    employeesSearch={employeesSearch}
                                    employeesSorted={employeesSorted}
                                />
                            </SearchBoxContext.Provider>
                        </div>
                    </Fragment>
                }
            </Frame>
        </>);
}

export default workerListByCompany;