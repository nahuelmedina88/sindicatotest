// pages/foundationalWorkerList.js
import React, { useState, useEffect, useContext, Fragment } from 'react';
import Select from "react-select";

import FoundationWorkerListItem from "../components/FoundationWorkerListItem";
import styles from "./css/foundationalWorkerList.module.scss";
import Layout from "../components/layout/Layout";
import Search from "../components/ui/Search";
import ExportButton from '../components/ui/ExportButton';

// Redux
import { useDispatch, useSelector } from "react-redux";
import {
  getfoundationalWorkerListAction,
  getfoundationalWorkerListByCompanyAction
} from "../components/redux/actions/EmployeeActions";
import { getCompaniesAction } from "../components/redux/actions/CompanyActions";

// Firebase
import { FirebaseContext } from "../firebase";

// MUI
import { CircularProgress } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const FoundationalWorkerList = () => {
  const [company, setCompany] = useState("");
  const [searchTextbox, setSearchTextBox] = useState("");

  const loading = useSelector(state => state.employees.loading);
  const employeesSelector = useSelector(state => state.employees.employees);
  const employeesSearch = useSelector(state => state.employees.employeesSearch);
  const employeesSorted = [...employeesSelector].sort((a, b) =>
    a.apellido > b.apellido ? 1 : b.apellido > a.apellido ? -1 : 0
  );

  const companiesSelector = useSelector(state => state.companies.companies);
  const companiesSelect = companiesSelector.map(c => ({
    id: c.id,
    value: c.id,
    label: c.nombre,
    nombre: c.nombre,
    ciudad: c.ciudad,
    domicilio: c.domicilio
  }));
  companiesSelect.push({
    id: 0,
    value: "Padron General",
    label: "Padrón General",
  });

  const dispatch = useDispatch();
  const { firebase, user } = useContext(FirebaseContext);

  const loadEmployees = (fb) => {
    dispatch(getfoundationalWorkerListAction(fb));
  };

  useEffect(() => {
    loadEmployees(firebase);
    dispatch(getCompaniesAction(firebase));
  }, [dispatch, firebase]);

  const handleChangeCompany = (option) => {
    setCompany(option.label);
    dispatch(getfoundationalWorkerListByCompanyAction(employeesSelector, option.label));
  };

  const getSearchTextBox = (value) => setSearchTextBox(value);

  useEffect(() => {
    if (!user) window.location.href = "/login";
  }, [user]);

  return (
    <Layout>
      {loading ? (
        <div><CircularProgress /></div>
      ) : (
        <Fragment>
          <div className={styles.absCenterSelf}>
            <div className={styles.searchExportParent}>
              <Search
                employeesRedux={employeesSorted}
                getSearchTextBox={getSearchTextBox}
                company={company}
              />
              <div>
                <ExportButton
                  employeesSearch={employeesSearch}
                  employeesSorted={employeesSorted}
                />
              </div>
            </div>

            <div>
              <Select
                className={`inputSecondary ${styles.myselect}`}
                options={companiesSelect}
                name="empresa"
                defaultValue={{ label: "Padrón General", value: 0 }}
                placeholder={"Seleccione un frigorífico"}
                onChange={handleChangeCompany}
              />
            </div>

            <TableContainer component={Paper}>
              <Table
                aria-label="caption table"
                sx={{ tableLayout: 'fixed' }}   // <- reemplaza makeStyles
              >
                <Fragment>
                  {!company && !searchTextbox ? (
                    <Fragment>
                      {employeesSorted.length > 0 ? (
                        <Fragment>
                          <TableHead>
                            <TableRow>
                              <TableCell aria-sort="descending" align="right">Nro Legajo</TableCell>
                              <TableCell align="right">Apellido</TableCell>
                              <TableCell align="right">Nombre</TableCell>
                              <TableCell align="right">DNI</TableCell>
                              <TableCell align="right">Empresa</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {employeesSorted.map((employee) => (
                              <FoundationWorkerListItem key={employee.id} employee={employee} />
                            ))}
                          </TableBody>
                        </Fragment>
                      ) : (
                        <div className={styles.span}>No existen trabajadores</div>
                      )}
                    </Fragment>
                  ) : (
                    <Fragment>
                      {employeesSearch.length > 0 ? (
                        <Fragment>
                          <TableHead>
                            <TableRow>
                              <TableCell aria-sort="descending" align="right">Nro Legajo</TableCell>
                              <TableCell align="right">Apellido</TableCell>
                              <TableCell align="right">Nombre</TableCell>
                              <TableCell align="right">DNI</TableCell>
                              <TableCell align="right">Empresa</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {employeesSearch.map((employee) => (
                              <FoundationWorkerListItem key={employee.id} employee={employee} />
                            ))}
                          </TableBody>
                        </Fragment>
                      ) : (
                        <div className={styles.span}>No existen trabajadores</div>
                      )}
                    </Fragment>
                  )}
                </Fragment>
              </Table>
            </TableContainer>
          </div>
        </Fragment>
      )}
    </Layout>
  );
};

export default FoundationalWorkerList;