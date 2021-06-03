import React, { Fragment, useEffect, useContext, useState } from 'react';

import SelectFoundationWorkerListItem from "../components/SelectFoundationWorkerListItem";

import styles from "./css/generalWorkerList.module.scss";
import Layout from "../components/layout/Layout";
import Search from "../components/ui/Search";

//Redux
import { useDispatch, useSelector } from "react-redux";
import { getEmployeesAction } from "../components/redux/actions/EmployeeActions";

//Firebase
import { FirebaseContext } from "../firebase";

//Material UI
import { CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


const useStyles = makeStyles({
    table: {
        tableLayout: "fixed",
    },
});

const SelectWorkerForFoundationWorkerList = (props) => {
    const classes = useStyles(props);
    const [searchTextbox, setSearchTextBox] = useState("");

    let employeesSelector = useSelector(state => state.employees.employees);
    let employeesSearch = useSelector(state => state.employees.employeesSearch);
    const loading = useSelector(state => state.employees.loading);
    let employeesSorted = employeesSelector.sort((a, b) => (a.apellido > b.apellido) ? 1 : ((b.apellido > a.apellido) ? -1 : 0));
    const dispatch = useDispatch();
    const { firebase } = useContext(FirebaseContext);

    const loadEmployees = (firebase) => {
        dispatch(getEmployeesAction(firebase));
    }
    const getSearchTextBox = (value) => {
        setSearchTextBox(value);
    }

    useEffect(() => {
        loadEmployees(firebase);
    }, [dispatch]);

    useEffect(() => {
        if (!user) {
            window.location.href = "/login";
        }
    }, []);

    const { user } = useContext(FirebaseContext);
    return (
        <>
            <Layout>
                {loading ?
                    <CircularProgress />
                    :
                    <div className={styles.absCenterSelf}>
                        <div className={styles.searchExportParent}>
                            <Search
                                className={styles.searchBox}
                                employeesRedux={employeesSorted}
                                getSearchTextBox={getSearchTextBox}
                            ></Search>
                        </div>
                        <TableContainer component={Paper}>
                            <Table className={classes.table} aria-label="caption table">
                                {searchTextbox ?
                                    <Fragment>
                                        {employeesSearch.length > 0 ?
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
                                                    {employeesSearch.map(employee => (
                                                        <SelectFoundationWorkerListItem
                                                            key={employee.id}
                                                            employee={employee} />
                                                    ))}
                                                </TableBody>
                                            </Fragment>
                                            :
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
                                                    <TableRow><TableCell>No hay trabajadores</TableCell></TableRow>
                                                </TableBody>
                                            </Fragment>
                                        }
                                    </Fragment>
                                    :
                                    <Fragment>
                                        {employeesSorted.length > 0 ?
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
                                                    {employeesSorted.map(employee => (
                                                        <SelectFoundationWorkerListItem
                                                            key={employee.id}
                                                            employee={employee} />
                                                    ))}
                                                </TableBody>
                                            </Fragment>
                                            : <Fragment>
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
                                                    <TableRow><TableCell>No hay trabajadores</TableCell></TableRow>
                                                </TableBody>
                                            </Fragment>
                                        }
                                    </Fragment>
                                }
                            </Table>
                        </TableContainer>
                    </div>
                }
            </Layout>
        </>
    );
}

export default SelectWorkerForFoundationWorkerList;