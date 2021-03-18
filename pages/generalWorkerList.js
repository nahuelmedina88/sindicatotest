import React, { useEffect, useContext } from 'react';

import EmployeeListItem from "../components/EmployeeListItem";

import styles from "./css/generalWorkerList.module.scss";
import Layout from "../components/layout/Layout";
import Search from "../components/ui/Search";

//Redux
import { useDispatch, useSelector } from "react-redux";
import { getEmployeesAction } from "../components/redux/actions/EmployeeActions";

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


const generalWorkerLists = (props) => {
    const classes = useStyles(props);

    let employeesSelector = useSelector(state => state.employees.employees);
    let employeesSearch = useSelector(state => state.employees.employeesSearch);
    let employeesSorted = employeesSelector.sort((a, b) => (a.apellido > b.apellido) ? 1 : ((b.apellido > a.apellido) ? -1 : 0));
    //Empleados Activos
    employeesSorted = employeesSorted.filter(employee => employee.estado === "Activo");
    const dispatch = useDispatch();
    const { firebase } = useContext(FirebaseContext);

    const loadEmployees = (firebase) => {
        dispatch(getEmployeesAction(firebase));
    }

    useEffect(() => {
        loadEmployees(firebase);
    }, []);

    return (
        <>
            <Layout>
                <div className={styles.absCenterSelf}>
                    <Search employeesRedux={employeesSorted}></Search>
                    <TableContainer component={Paper}>
                        <Table className={classes.root} aria-label="caption table">
                            {/* <caption>A basic table example with a caption</caption> */}
                            <TableHead>
                                <TableRow>
                                    <TableCell aria-sort="descending" align="right">Nro Legajo</TableCell>
                                    <TableCell align="right">Apellido</TableCell>
                                    <TableCell align="right">Nombre</TableCell>
                                    <TableCell align="right">DNI</TableCell>
                                    <TableCell align="right">Empresa</TableCell>
                                </TableRow>
                            </TableHead>
                            {employeesSearch.length > 0 ?
                                <TableBody>
                                    {employeesSearch.map(employee => (
                                        <EmployeeListItem
                                            key={employee.id}
                                            employee={employee} />
                                    ))}
                                </TableBody>
                                :
                                <TableBody>
                                    {employeesSorted.map(employee => (
                                        <EmployeeListItem
                                            key={employee.id}
                                            employee={employee} />
                                    ))}
                                </TableBody>}
                        </Table>
                    </TableContainer>
                </div>
            </Layout>
        </>
    );
}

export default generalWorkerLists;