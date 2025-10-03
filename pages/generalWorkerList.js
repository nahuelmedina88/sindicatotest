// pages/generalWorkerList.js
import React, { useEffect, useContext, useState } from 'react';

// Components
import { SearchBoxContext } from "../components/context/SearchBoxContext";
import WorkerList from "../components/WorkerList";
import Layout from "../components/layout/Layout";
import Search from "../components/ui/Search";

// Styles
import styles from "./css/generalWorkerList.module.scss";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { getEmployeesActiveAction } from "../components/redux/actions/EmployeeActions";

// Firebase Context
import FirebaseContext from "../firebase/context";

// MUI
import { CircularProgress } from '@mui/material';
import ExportButton from '../components/ui/ExportButton';

const GeneralWorkerList = () => {
  const [searchBoxValue, setSearchBoxValue] = useState("");

  // Evitar crash si el slice todavía no está poblado
  const employeesSelector =
    useSelector((state) => state.employees?.employees) || [];
  const employeesSearch =
    useSelector((state) => state.employees?.employeesSearch) || [];
  const loading = useSelector((state) => state.employees?.loading);

  // Ordenar derivado (no muta el store)
  const employeesSorted = [...employeesSelector].sort((a, b) =>
    a.apellido > b.apellido ? 1 : b.apellido > a.apellido ? -1 : 0
  );

  const dispatch = useDispatch();
  const { user } = useContext(FirebaseContext);

  // Cargar empleados SOLO cuando hay usuario (si las reglas exigen auth)
  useEffect(() => {
    if (user) {
      dispatch(getEmployeesActiveAction());
    }
  }, [user, dispatch]);

  // Si no hay user, redirigir a login (cuando se confirme que es null)
  useEffect(() => {
    if (user === null) {
      window.location.href = "/login";
    }
  }, [user]);

  return (
    <Layout>
      {loading ? (
        <CircularProgress />
      ) : (
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
      )}
    </Layout>
  );
};

export default GeneralWorkerList;