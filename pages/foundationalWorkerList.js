import React, { useState, useEffect, useContext, Fragment } from 'react';
import Select from "react-select"
import EmployeeListItem from "../components/EmployeeListItem";

import styles from "./css/foundationalWorkerList.module.scss";
import Layout from "../components/layout/Layout";
import Search from "../components/ui/Search";

//Redux
import { useDispatch, useSelector } from "react-redux";
import { getfoundationalWorkerListAction, getfoundationalWorkerListByCompanyAction } from "../components/redux/actions/EmployeeActions";
import { getCompaniesAction } from "../components/redux/actions/CompanyActions";

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

import ExportButton from '../components/ui/ExportButton';

const useStyles = makeStyles({
    table: {
        tableLayout: "fixed",
    },
});


const foundationalWorkerList = () => {
    const classes = useStyles();
    const [company, setCompany] = useState("");
    const [searchTextbox, setSearchTextBox] = useState("");

    const loading = useSelector(state => state.employees.loading);
    let employeesSelector = useSelector(state => state.employees.employees);
    let employeesSearch = useSelector(state => state.employees.employeesSearch);
    let employeesSorted = employeesSelector.sort((a, b) => (a.apellido > b.apellido) ? 1 : ((b.apellido > a.apellido) ? -1 : 0));

    const companiesSelector = useSelector(state => state.companies.companies);
    const companiesSelect = companiesSelector.map(company => ({
        id: company.id,
        value: company.id,
        label: company.nombre,
        nombre: company.nombre,
        ciudad: company.ciudad,
        domicilio: company.domicilio
    }));
    companiesSelect.push({
        id: 0,
        value: "Padron General",
        label: "Padrón General",
    });
    const dispatch = useDispatch();
    const { firebase } = useContext(FirebaseContext);

    const loadEmployees = (firebase) => {
        dispatch(getfoundationalWorkerListAction(firebase));
    }

    useEffect(() => {
        loadEmployees(firebase);
        const loadCompanies = (firebase) => { dispatch(getCompaniesAction(firebase)) }
        loadCompanies(firebase);
    }, []);

    const handleChangeCompany = (option) => {
        setCompany(option.label);
        dispatch(getfoundationalWorkerListByCompanyAction(employeesSelector, option.label))
    }
    const getSearchTextBox = (value) => {
        setSearchTextBox(value);
    }

    return (<>
        <Layout>
            {loading ?
                <div>
                    <CircularProgress />
                </div>
                :
                <Fragment>
                    <div className={styles.absCenterSelf}>
                        <div className={styles.searchExportParent}>
                            <Search
                                employeesRedux={employeesSorted}
                                getSearchTextBox={getSearchTextBox}
                                company={company}>
                            </Search>
                            <div>
                                <ExportButton
                                    employeesSearch={employeesSearch}
                                    employeesSorted={employeesSorted}
                                />
                            </div>
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
                        <TableContainer component={Paper}>
                            <Table
                                className={classes.table}
                                aria-label="caption table"
                            >
                                <Fragment>
                                    {!company && !searchTextbox ?
                                        <Fragment>
                                            {
                                                employeesSorted.length > 0 ?
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
                                                            {
                                                                employeesSorted.map(employee => (
                                                                    <EmployeeListItem
                                                                        key={employee.id}
                                                                        employee={employee} />
                                                                ))
                                                            }
                                                        </TableBody>
                                                    </Fragment>
                                                    : <div className={styles.span}>No existen trabajadores</div>
                                            }
                                        </Fragment>
                                        :
                                        <Fragment>
                                            {
                                                employeesSearch.length > 0 ?
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
                                                            {employeesSearch.map(employee => (
                                                                <EmployeeListItem
                                                                    key={employee.id}
                                                                    employee={employee} />
                                                            ))}
                                                        </TableBody>
                                                    </Fragment>
                                                    : <div className={styles.span}>No existen trabajadores</div>
                                            }
                                        </Fragment>
                                    }
                                </Fragment>
                            </Table>
                        </TableContainer>
                    </div>
                </Fragment>
            }
        </Layout>
    </>);
}

export default foundationalWorkerList;