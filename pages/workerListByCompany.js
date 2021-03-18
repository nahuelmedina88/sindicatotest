import React, { useState, useEffect, useContext } from 'react';

import EmployeeListItem from "../components/EmployeeListItem";
import Select from 'react-select';
import styles from "./css/workerListByCompany.module.scss";
import Layout3 from "../components/layout/Layout3";
import Search from "../components/ui/Search";

//Redux
import { useDispatch, useSelector } from "react-redux";
import { getEmployeesAction } from "../components/redux/actions/EmployeeActions";
import { getCompaniesAction } from "../components/redux/actions/CompanyActions";

//Firebase
import { FirebaseContext } from "../firebase";

//Material UI
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
    root: {
        // backgroundColor: 'blue',
        color: props => props.color,
    },
});

const workerListByCompany = (props) => {
    const [companyComboBox, setCompanyComboBox] = useState("");
    const [employeesByCompany, setEmployeesByCompany] = useState([]);
    const [searchTextbox, setSearchTextBox] = useState("");
    const classes = useStyles(props);

    let employeesSelector = useSelector(state => state.employees.employees);
    let employeesSearch = useSelector(state => state.employees.employeesSearch);
    let employeesSorted = employeesSelector.sort((a, b) => (a.apellido > b.apellido) ? 1 : ((b.apellido > a.apellido) ? -1 : 0));
    employeesSorted = employeesSorted.filter(employee => employee.estado === "Activo");
    const dispatch = useDispatch();
    const { firebase } = useContext(FirebaseContext);


    const companiesSelector = useSelector(state => state.companies.companies);
    const companiesSelect = companiesSelector.map(company => ({
        id: company.id,
        value: company.id,
        label: company.nombre,
        ciudad: company.ciudad,
        domicilio: company.domicilio
    }));

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

    const handleCompany = (e) => {
        let employees = employeesSorted.filter(employee => employee.empresa.nombre === e.label);
        setEmployeesByCompany(employees);
        setCompanyComboBox(e.label);
    }

    const getSearchTextBox = (value) => {
        setSearchTextBox(value);
    }

    return (
        <>
            <Layout3>
                <div className={styles.absCenterSelf}>
                    <div >
                        <label>Empresa</label>
                        <Select
                            className={`inputSecondary ` + styles.myselect}
                            options={companiesSelect}
                            onChange={handleCompany}
                            placeholder={"Seleccione un frigorífico"}
                        ></Select>
                    </div>
                    <Search employeesRedux={companyComboBox ? employeesByCompany : employeesSorted} getSearchTextBox={getSearchTextBox}></Search>
                    <TableContainer component={Paper}>
                        <Table className={classes.root} aria-label="caption table">

                            <TableHead>
                                <TableRow>
                                    <TableCell align="right">Nro Legajo</TableCell>
                                    <TableCell align="right">Apellido</TableCell>
                                    <TableCell align="right">Nombre</TableCell>
                                    <TableCell align="right">DNI</TableCell>
                                    <TableCell align="right">Empresa</TableCell>
                                </TableRow>
                            </TableHead>
                            {companyComboBox ?
                                <TableBody>
                                    {
                                        searchTextbox ?
                                            employeesSearch.map(employee => (
                                                <EmployeeListItem
                                                    key={employee.id}
                                                    employee={employee} />
                                            )) :
                                            employeesByCompany.map(employee => (
                                                <EmployeeListItem
                                                    key={employee.id}
                                                    employee={employee} />
                                            ))
                                    }
                                </TableBody>
                                :
                                <TableBody>
                                    {
                                        searchTextbox ?
                                            employeesSearch.map(employee => (
                                                <EmployeeListItem
                                                    key={employee.id}
                                                    employee={employee} />
                                            )) :
                                            employeesSorted.map(employee => (
                                                <EmployeeListItem
                                                    key={employee.id}
                                                    employee={employee} />
                                            ))
                                    }
                                </TableBody>}
                        </Table>
                    </TableContainer>
                </div>
            </Layout3>
        </>);
}

export default workerListByCompany;