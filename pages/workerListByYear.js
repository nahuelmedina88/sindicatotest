import React, { useState, useEffect, useContext, Fragment } from 'react';

//Context
import { SearchBoxContext } from "../components/context/SearchBoxContext";

//styles
import styles from "./css/workerListByYear.module.scss";

//Components
import ExportButton from '../components/ui/ExportButton';
import WorkerList from '../components/WorkerList';
import Frame from "../components/layout/Frame";
import Search from "../components/ui/Search";

//ReactSelect
import Select from 'react-select';

//Redux
import { useDispatch, useSelector } from "react-redux";
import { getEmployeesAction, getWorkerListByCompanyAction, getWorkerListByYearAction } from "../components/redux/actions/EmployeeActions";
import { getCompaniesAction } from "../components/redux/actions/CompanyActions";

//Firebase
import { FirebaseContext } from "../firebase";

//Material UI
import { CircularProgress } from '@mui/material';

const workerListByYear = () => {
    const [searchBoxValue, setSearchBoxValue] = useState("");
    const [companySelectValue, setCompanySelectValue] = useState("");
    const [chosenYearValue, setChosenYearValue] = useState("");

    const [years, setYears] = useState("");

    const loading = useSelector(state => state.employees.loading);
    let employeesSorted = useSelector(state => state.employees.employees);
    let employeesSearch = useSelector(state => state.employees.employeesSearch);

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

    const getArrayLast10Years = () => {
        const currentYear = new Date().getFullYear();
        const tenyearAgo = currentYear - 10;
        let yearsArray = [];
        for (let i = currentYear; i >= tenyearAgo; i--) {
            yearsArray.push({ label: i.toString(), value: i });
        }
        setYears(yearsArray);
    }

    useEffect(() => {
        loadEmployees(firebase);
        loadCompanies(firebase);
        getArrayLast10Years();
    }, []);

    const handleChangeCompany = (option) => {
        setCompanySelectValue(option.label);
        dispatch(getWorkerListByCompanyAction(employeesSorted, option.label, searchBoxValue, chosenYearValue));
    }

    const handleChangeAnio = (option) => {
        setChosenYearValue(option.value);
        dispatch(getWorkerListByYearAction(employeesSorted, option.value, searchBoxValue, companySelectValue));
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
                                    companySelectValue, setCompanySelectValue,
                                    chosenYearValue, setChosenYearValue,
                                }
                            }>
                                <div className={styles.searchExportParent}>
                                    <Search
                                        employeesRedux={employeesSorted}
                                    ></Search>
                                    <ExportButton
                                        employeesSearch={employeesSearch}
                                        employeesSorted={employeesSorted}
                                    />
                                </div>
                                <div className={styles.flexContainerForm}>
                                    <div className={styles.controlForm}>
                                        <Select
                                            className={`inputSecondary ` + styles.myselect}
                                            options={years}
                                            name="anio"
                                            placeholder={"Seleccione un año"}
                                            onChange={handleChangeAnio}
                                        ></Select>
                                    </div>
                                    <div className={styles.controlForm}>
                                        <Select
                                            className={`inputSecondary ` + styles.myselect}
                                            options={companiesSelect}
                                            name="empresa"
                                            defaultValue={{ label: "Padrón General", value: 0 }}
                                            placeholder={"Seleccione un frigorífico"}
                                            onChange={handleChangeCompany}
                                        ></Select>
                                    </div>
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

export default workerListByYear;