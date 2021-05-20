import React, { Fragment, useEffect, useContext, useState } from 'react';

import Link from "next/link";

import EmployeeListItem from "../components/EmployeeListItem";

import styles from "./css/generalWorkerList.module.scss";
import Layout from "../components/layout/Layout";
import Search from "../components/ui/Search";

//Redux
import { useDispatch, useSelector } from "react-redux";
import { getEmployeesActiveAction } from "../components/redux/actions/EmployeeActions";

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
import Button from '@material-ui/core/Button';
import ExportButton from '../components/ui/ExportButton';

const useStyles = makeStyles({
    table: {
        tableLayout: "fixed",
    },
    btn: {
        padding: "0.4rem",
        borderRadius: "5px",
        textDecoration: "none",
        borderWidth: "1px",
        borderColor: "#fff",
        fontSize: "1rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    buttonPurple: {
        backgroundColor: "rgb(86, 7, 138)",
        color: "#fff",
        "&:hover": {
            backgroundColor: "rgb(86, 7, 138,0.7)",
        }
    },
    buttonClose: {
        backgroundColor: "rgb(138,7,7)",
        color: "#fff",
        "&:hover": {
            backgroundColor: "rgb(138,7,7, 0.7)",
        }
    },
    buttonSave: {
        backgroundColor: "rgb(7,138,7)",
        color: "#fff",
        "&:hover": {
            backgroundColor: "rgb(7,138,7, 0.7)",
        }
    },
    buttonExport: {
        backgroundColor: "#FF5733",
        color: "#fff",
        "&:hover": {
            backgroundColor: "#FF5733b5",
        }
    },
});

const GeneralWorkerList = (props) => {
    const classes = useStyles(props);
    const [searchTextbox, setSearchTextBox] = useState("");

    let employeesSelector = useSelector(state => state.employees.employees);
    let employeesSearch = useSelector(state => state.employees.employeesSearch);
    const loading = useSelector(state => state.employees.loading);
    let employeesSorted = employeesSelector.sort((a, b) => (a.apellido > b.apellido) ? 1 : ((b.apellido > a.apellido) ? -1 : 0));
    const dispatch = useDispatch();
    const { firebase } = useContext(FirebaseContext);

    const loadEmployees = (firebase) => {
        dispatch(getEmployeesActiveAction(firebase));
    }
    const getSearchTextBox = (value) => {
        setSearchTextBox(value);
    }

    useEffect(() => {
        loadEmployees(firebase);
    }, []);

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
                            <div>
                                <ExportButton
                                    employeesSearch={employeesSearch}
                                    employeesSorted={employeesSorted}
                                />
                            </div>
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
                                                        <TableCell align="right">
                                                            <Link href="/AddEmployee">
                                                                <a className={`${classes.btn} ${classes.buttonSave}`}>
                                                                    Agregar
                                                                </a>
                                                            </Link>
                                                        </TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {employeesSearch.map(employee => (
                                                        <EmployeeListItem
                                                            key={employee.id}
                                                            employee={employee} />
                                                    ))}
                                                </TableBody>
                                            </Fragment>
                                            : <div className={styles.span}>No hay trabajadores</div>
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
                                                        <TableCell align="right">
                                                            {/* <Link href="/AddEmployee">
                                                                <a className={`${classes.btn} ${classes.buttonSave}`}>
                                                                    Agregar
                                                                </a>
                                                            </Link> */}
                                                            <Link href="/AddEmployee">
                                                                <Button
                                                                    variant="contained"
                                                                    className={`${classes.buttonSave}`}>
                                                                    Agregar</Button>
                                                            </Link>
                                                        </TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {employeesSorted.map(employee => (
                                                        <EmployeeListItem
                                                            key={employee.id}
                                                            employee={employee} />
                                                    ))}
                                                </TableBody>
                                            </Fragment>
                                            : <span className={styles.span}>No hay trabajadores</span>
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

export default GeneralWorkerList;