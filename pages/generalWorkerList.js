import React, { useEffect, useContext, useState } from 'react';

//Components
import { SearchBoxContext } from "../components/context/SearchBoxContext";
import WorkerList from "../components/WorkerList"
import Layout from "../components/layout/Layout";
import Search from "../components/ui/Search";

//Styles
import styles from "./css/generalWorkerList.module.scss";

//Redux
import { useDispatch, useSelector } from "react-redux";
import { getEmployeesActiveAction }
    from "../components/redux/actions/EmployeeActions";

//Firebase
import { FirebaseContext } from "../firebase";

//Material UI
import { CircularProgress } from '@material-ui/core';
import ExportButton from '../components/ui/ExportButton';

const GeneralWorkerList = (props) => {
    const [searchBoxValue, setSearchBoxValue] = useState("");

    let employeesSelector = useSelector(state => state.employees.employees);
    let employeesSearch = useSelector(state => state.employees.employeesSearch);
    const loading = useSelector(state => state.employees.loading);
    let employeesSorted = employeesSelector.sort((a, b) => (a.apellido > b.apellido) ? 1 : ((b.apellido > a.apellido) ? -1 : 0));
    const dispatch = useDispatch();
    const { firebase, user } = useContext(FirebaseContext);

    const loadEmployees = (firebase) => {
        dispatch(getEmployeesActiveAction(firebase));
    }

    useEffect(() => {
        loadEmployees(firebase);
    }, [dispatch]);


    useEffect(() => {
        if (!user) {
            window.location.href = "/login";
        }
    }, []);

    return (
        <>
            <Layout>
                {loading ?
                    <CircularProgress />
                    :
                    <div className={styles.absCenterSelf}>
                        <SearchBoxContext.Provider value={{ searchBoxValue, setSearchBoxValue }}>
                            <div className={styles.searchExportParent}>
                                <Search
                                    className={styles.searchBox}
                                    employeesRedux={employeesSorted}
                                />
                                <ExportButton
                                    employeesSearch={employeesSearch}
                                    employeesSorted={employeesSorted}
                                />
                            </div>
                            <WorkerList
                                employeesSearch={employeesSearch}
                                employeesSorted={employeesSorted}
                            />
                        </SearchBoxContext.Provider>
                    </div>
                }
            </Layout >
        </>
    );
}

export default GeneralWorkerList;
