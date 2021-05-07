import React, { useState, useEffect, useContext } from 'react';
import Select from "react-select"
import WorkerListItemSchoolSupplies from "../components/WorkerListItemSchoolSupplies";

import styles from "./css/schoolSuppliesWorkerList.module.scss";
import Layout from "../components/layout/Layout";
import Search from "../components/ui/Search";

//Redux
import { useDispatch, useSelector } from "react-redux";
import { getEmployeesActiveAction, getWorkerListByCompanyAction } from "../components/redux/actions/EmployeeActions";
import { getCompaniesAction } from "../components/redux/actions/CompanyActions";

//Firebase
import { FirebaseContext } from "../firebase";

//Material UI
import { CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import Button from '@material-ui/core/Button';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Fragment } from 'react';

//Custom Components
import { DocxCreateSchoolSuppliesList } from "../components/helpers/DocxCreateSchoolSuppliesList";

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
        alignItems: "center",
        textAlign: "center",
    },
    buttonOrange: {
        backgroundColor: "rgb(195 76 7)",
        color: "#fff",
        "&:hover": {
            backgroundColor: "rgb(195, 76, 7, 0.7)",
        }
    },
});


const SchoolSuppliesWorkerList = () => {
    const classes = useStyles();
    const [company, setCompany] = useState("");
    const [employeesSorted, setEmployeesSorted] = useState("");
    let employeesSelector = useSelector(state => state.employees.employees);
    let employeesSearch = useSelector(state => state.employees.employeesSearch);

    const [searchTextbox, setSearchTextBox] = useState("");
    const loading = useSelector(state => state.employees.loading);

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
        dispatch(getEmployeesActiveAction(firebase));
    }

    useEffect(() => {
        loadEmployees(firebase);
        const loadCompanies = (firebase) => { dispatch(getCompaniesAction(firebase)) }
        loadCompanies(firebase);
    }, []);


    const getEmployeesWithChildren = () => {
        let empArray = [];
        employeesSelector && employeesSelector.map(emp => {
            emp.familia && emp.familia.map(familiar => {
                return (familiar && familiar.parentesco === "Hija" || familiar.parentesco === "Hijo" ?
                    empArray.push(emp) : null);
            });
        });
        const deleteDuplicate = (array) => {
            let emp = array.reduce((acc, item) => {
                if (!acc.includes(item)) {
                    acc.push(item);
                }
                return acc;
            }, []);
            return emp;
        }
        setEmployeesSorted(deleteDuplicate(empArray).sort((a, b) => (a.apellido > b.apellido) ? 1 : ((b.apellido > a.apellido) ? -1 : 0)));
    }

    useEffect(() => {
        getEmployeesWithChildren();
    }, [employeesSelector])

    const handleChangeCompany = (option) => {
        setCompany(option.label);
        dispatch(getWorkerListByCompanyAction(employeesSorted, option.label, searchTextbox))
    }
    const getSearchTextBox = (value) => {
        setSearchTextBox(value);
    }

    const generate = (e) => {
        e.preventDefault();
        employeesSearch.length > 0 ?
            DocxCreateSchoolSuppliesList(employeesSearch, e.target.id) :
            DocxCreateSchoolSuppliesList(employeesSelector, e.target.id);
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
                            <Button
                                onClick={generate}
                                className={`${classes.btn} ${classes.buttonOrange} ${styles.buttonExport}`}
                            >Exportar</Button>
                        </div>
                        <div>
                            <label>Empresa</label>
                            <Select
                                className={`inputSecondary ` + styles.myselect}
                                options={companiesSelect}
                                name="empresa"
                                defaultValue={{ label: "Padrón General", value: 0 }}
                                placeholder={"Seleccione un frigorífico"}
                                // onChange={option => dispatch(getfoundationalWorkerListByCompanyAction(employeesSelector, option.label))}
                                onChange={handleChangeCompany}
                            ></Select>
                        </div>

                        <TableContainer component={Paper}>
                            <Table
                                className={classes.table}
                                aria-label="caption table"
                            >
                                {/* <caption>A basic table example with a caption</caption> */}
                                <Fragment>
                                    {!company && !searchTextbox ?
                                        <Fragment>
                                            {
                                                employeesSorted.length > 0 ?
                                                    <Fragment>
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell align="right">Entregado</TableCell>
                                                                <TableCell aria-sort="descending" align="right">Nro Legajo</TableCell>
                                                                <TableCell align="right">Apellido</TableCell>
                                                                <TableCell align="right">Nombre</TableCell>
                                                                <TableCell align="right">DNI</TableCell>
                                                                <TableCell align="right">Empresa</TableCell>
                                                                <TableCell align="right">Guardapolvos</TableCell>
                                                                <TableCell align="right">Kit Escolares</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {
                                                                employeesSorted.map(employee => (
                                                                    <WorkerListItemSchoolSupplies
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
                                                                <TableCell align="right">Entregado</TableCell>
                                                                <TableCell align="right">Nro Legajo</TableCell>
                                                                <TableCell align="right">Apellido</TableCell>
                                                                <TableCell align="right">Nombre</TableCell>
                                                                <TableCell align="right">DNI</TableCell>
                                                                <TableCell align="right">Empresa</TableCell>
                                                                <TableCell align="right">Guardapolvos</TableCell>
                                                                <TableCell align="right">Kit Escolares</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {employeesSearch.map(employee => (
                                                                <WorkerListItemSchoolSupplies
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

export default SchoolSuppliesWorkerList;