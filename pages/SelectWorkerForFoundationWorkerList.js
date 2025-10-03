import React, { Fragment, useEffect, useContext, useState } from 'react';

import SelectFoundationWorkerListItem from "../components/SelectFoundationWorkerListItem";

import styles from "./css/generalWorkerList.module.scss";
import Layout from "../components/layout/Layout";
import Search from "../components/ui/Search";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { getEmployeesAction } from "../components/redux/actions/EmployeeActions";

// Firebase
import { FirebaseContext } from "../firebase";

// MUI (sin @mui/styles)
import { CircularProgress } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const SelectWorkerForFoundationWorkerList = () => {
  const [searchTextbox, setSearchTextBox] = useState("");

  const employeesSelector = useSelector(state => state.employees.employees);
  const employeesSearch = useSelector(state => state.employees.employeesSearch);
  const loading = useSelector(state => state.employees.loading);

  const employeesSorted = [...employeesSelector].sort((a, b) =>
    a.apellido > b.apellido ? 1 : b.apellido > a.apellido ? -1 : 0
  );

  const dispatch = useDispatch();
  const { firebase, user } = useContext(FirebaseContext);

  const loadEmployees = (fb) => {
    dispatch(getEmployeesAction(fb));
  };

  const getSearchTextBox = (value) => setSearchTextBox(value);

  useEffect(() => {
    loadEmployees(firebase);
  }, [dispatch, firebase]);

  useEffect(() => {
    if (!user) {
      window.location.href = "/login";
    }
  }, [user]);

  return (
    <Layout>
      {loading ? (
        <CircularProgress />
      ) : (
        <div className={styles.absCenterSelf}>
          <div className={styles.searchExportParent}>
            <Search
              className={styles.searchBox}
              employeesRedux={employeesSorted}
              getSearchTextBox={getSearchTextBox}
            />
          </div>

          <TableContainer component={Paper}>
            <Table sx={{ tableLayout: "fixed" }} aria-label="caption table">
              {searchTextbox ? (
                <Fragment>
                  {employeesSearch.length > 0 ? (
                    <Fragment>
                      <TableHead>
                        <TableRow>
                          <TableCell align="right">Nro Legajo</TableCell>
                          <TableCell align="right">Apellido</TableCell>
                          <TableCell align="right">Nombre</TableCell>
                          <TableCell align="right">DNI</TableCell>
                          <TableCell align="right">Empresa</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {employeesSearch.map((employee) => (
                          <SelectFoundationWorkerListItem
                            key={employee.id}
                            employee={employee}
                          />
                        ))}
                      </TableBody>
                    </Fragment>
                  ) : (
                    <Fragment>
                      <TableHead>
                        <TableRow>
                          <TableCell align="right">Nro Legajo</TableCell>
                          <TableCell align="right">Apellido</TableCell>
                          <TableCell align="right">Nombre</TableCell>
                          <TableCell align="right">DNI</TableCell>
                          <TableCell align="right">Empresa</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>No hay trabajadores</TableCell>
                        </TableRow>
                      </TableBody>
                    </Fragment>
                  )}
                </Fragment>
              ) : (
                <Fragment>
                  {employeesSorted.length > 0 ? (
                    <Fragment>
                      <TableHead>
                        <TableRow>
                          <TableCell aria-sort="descending" align="right">
                            Nro Legajo
                          </TableCell>
                          <TableCell align="right">Apellido</TableCell>
                          <TableCell align="right">Nombre</TableCell>
                          <TableCell align="right">DNI</TableCell>
                          <TableCell align="right">Empresa</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {employeesSorted.map((employee) => (
                          <SelectFoundationWorkerListItem
                            key={employee.id}
                            employee={employee}
                          />
                        ))}
                      </TableBody>
                    </Fragment>
                  ) : (
                    <Fragment>
                      <TableHead>
                        <TableRow>
                          <TableCell align="right">Nro Legajo</TableCell>
                          <TableCell align="right">Apellido</TableCell>
                          <TableCell align="right">Nombre</TableCell>
                          <TableCell align="right">DNI</TableCell>
                          <TableCell align="right">Empresa</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>No hay trabajadores</TableCell>
                        </TableRow>
                      </TableBody>
                    </Fragment>
                  )}
                </Fragment>
              )}
            </Table>
          </TableContainer>
        </div>
      )}
    </Layout>
  );
};

export default SelectWorkerForFoundationWorkerList;