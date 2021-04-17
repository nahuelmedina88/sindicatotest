import React, { useEffect, useContext, useState } from 'react';
import Layout from "../components/layout/Layout";
import styles from "./css/Homepage.module.scss";

import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { CircularProgress } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';


import PeopleIcon from '@material-ui/icons/People';
import { makeStyles } from '@material-ui/core/styles';

//Redux
import { useDispatch, useSelector } from "react-redux";
import { getEmployeesAction } from "../components/redux/actions/EmployeeActions";

//Firebase
import { FirebaseContext } from "../firebase";

import Link from "next/link"

import { AutoSizer } from 'react-virtualized';
import 'react-virtualized/styles.css'; // only needs to be imported once

import '../node_modules/react-vis/dist/style.css';
import {
    FlexibleXYPlot,
    XYPlot,
    LineSeries,
    VerticalGridLines,
    HorizontalGridLines,
    VerticalBarSeries,
    XAxis,
    YAxis
} from 'react-vis';
import { TableFooter } from '@material-ui/core';
import { Fragment } from 'react';


const columns = [
    { id: 'nroLegajo', label: 'Nro Legajo', minWidth: 170 },
    { id: 'apellido', label: 'Apellido', minWidth: 100 },
    {
        id: 'nombre',
        label: 'Nombre',
        minWidth: 170,
        align: 'right'
    },
    {
        id: 'dni',
        label: 'DNI',
        minWidth: 170,
        align: 'right'
    },
    {
        id: 'empresa',
        label: 'Empresa',
        minWidth: 170,
        align: 'right'
    },
];

function createData(name, code, population, size) {
    const density = population / size;
    return { name, code, population, size, density };
}

const rows = [
    createData('India', 'IN', 1324171354, 3287263),
    createData('China', 'CN', 1403500365, 9596961),
    createData('Italy', 'IT', 60483973, 301340),
    createData('United States', 'US', 327167434, 9833520),
    createData('Canada', 'CA', 37602103, 9984670),
    createData('Australia', 'AU', 25475400, 7692024),
    createData('Germany', 'DE', 83019200, 357578),
    createData('Ireland', 'IE', 4857000, 70273),
    createData('Mexico', 'MX', 126577691, 1972550),
    createData('Japan', 'JP', 126317000, 377973),
    createData('France', 'FR', 67022000, 640679),
    createData('United Kingdom', 'GB', 67545757, 242495),
    createData('Russia', 'RU', 146793744, 17098246),
    createData('Nigeria', 'NG', 200962417, 923768),
    createData('Brazil', 'BR', 210147125, 8515767),
];

// const data = [
//     { x: 'winter', y: 10 },
//     { x: 'spring', y: 100 },
//     { x: 'summer', y: 100 },
//     { x: 'fall', y: 10 }];

const useStyles = makeStyles({
    icon: {
        fontSize: "20vh",
        borderStyle: "solid",
        borderRadius: "50px",
    },
    root: {
        width: '100%',
        opacity: 0.8,
    },
    container: {
        maxHeight: 200,
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
});


const Homepage = () => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(3);
    const [lastWorker, setLastWorker] = React.useState("");
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const classes = useStyles();
    const [data, setData] = useState("");
    const dispatch = useDispatch();
    const { firebase } = useContext(FirebaseContext);
    const loading = useSelector(state => state.employees.loading);
    let employeesSelector = useSelector(state => state.employees.employees);
    let inactiveEmployees = employeesSelector.filter(item => item.estado === "Inactivo");
    let activeEmployees = employeesSelector.filter(item => item.estado === "Activo");

    console.log("LastWorker " + lastWorker);
    let employeesSorted = activeEmployees.sort((a, b) => (a.apellido > b.apellido) ? 1 : ((b.apellido > a.apellido) ? -1 : 0));

    const loadEmployees = (firebase) => {
        dispatch(getEmployeesAction(firebase));
    }

    const getPorcentageAfiliados = () => {
        let current = activeEmployees.length;
        let counter = 0;
        let lastYear = new Date().getFullYear();
        lastYear = (lastYear - 1).toString();
        let date = lastYear + "-12-31"; //"2020-12-31"
        let dateObject = new Date(date);
        activeEmployees.map(employee => {
            let mydate = new Date(employee.fecha_ingreso);
            if (mydate >= dateObject) { //"2021-03-29" <= "2020-12-31"
                counter = counter + 1;
            }
        });

        let ultimoAnio = current - counter;
        let esteAnio = counter;
        let porcentage = 0;
        if (esteAnio > 0) {
            porcentage = (counter * 100) / current;
            porcentage = "+" + porcentage.toFixed(1).toString();
        } else if (esteAnio < 0) {
            porcentage = (counter * 100) / current;
            porcentage = "-" + porcentage.toFixed(1).toString();
        } else if (esteAnio === 0) {
            porcentage = porcentage.toFixed(2).toString();
        }
        return porcentage;
    }

    const getLastWorker = () => {
        let empleadoPrevio = "";
        let empleadoMaximo = "";
        activeEmployees.map(empleado => {
            let empleadoActual = empleado;
            if (!empleadoPrevio) {
                empleadoMaximo = empleadoActual;
            } else if (empleadoActual.nroLegajo > empleadoPrevio.nroLegajo) {
                empleadoMaximo = empleadoActual;
            } else {
                empleadoMaximo = empleadoPrevio;
            }
            empleadoPrevio = empleadoActual;
        });

        setLastWorker(empleadoMaximo);
    }

    const getPorcentageDesafiliados = () => {
        let current = inactiveEmployees.length;
        let counter = 0;
        let lastYear = new Date().getFullYear();
        lastYear = (lastYear - 1).toString();
        let date = lastYear + "-12-31"; //"2020-12-31"
        let dateObject = new Date(date);
        inactiveEmployees.map(employee => {
            let mydate = new Date(employee.fecha_baja);
            if (mydate >= dateObject) { //"2021-03-29" <= "2020-12-31"
                counter = counter + 1;
            }
        });
        let ultimoAnio = current - counter;
        let esteAnio = counter;
        let porcentage = 0;
        if (esteAnio > 0) {
            porcentage = (counter * 100) / current;
            porcentage = "+" + porcentage.toFixed(1).toString();
        } else if (esteAnio < 0) {
            porcentage = (counter * 100) / current;
            porcentage = "-" + porcentage.toFixed(1).toString();
        } else if (esteAnio === 0) {
            porcentage = porcentage.toFixed(2).toString();
        }
        return porcentage;
    }

    const getData = () => {
        let cantidadEmpresas = activeEmployees.reduce((contarEmpresas, empleado) => {
            let emp = empleado.empresa.nombre;
            contarEmpresas[emp] = (contarEmpresas[emp] || 0) + 1;
            return contarEmpresas;
        }, {});

        let empresas = Object.keys(cantidadEmpresas);
        let cantidad = Object.values(cantidadEmpresas);
        console.log(empresas);
        console.log(cantidad);
        let newData = [];
        empresas.map((item, idx) => {
            newData.push({ x: item, y: cantidad[idx] })
        });
        setData(newData);
    }
    useEffect(() => {
        loadEmployees(firebase);
    }, []);

    useEffect(() => {
        getData();
        getLastWorker();
    }, [employeesSelector]);

    return (<Layout homepage={true}>
        <div className={styles.firstRow}>
            <div className={`${styles.amountWorker} ${styles.bgColorAf}`}>
                {/* Cantidad de Afiliados {employeesSelector.length} */}
                {/* <PeopleIcon className={classes.icon} /> */}
                <div className={styles.textSpan}>Afiliados</div>
                <div className={styles.numberSpan}>
                    {loading ? <CircularProgress /> : activeEmployees.length}
                    <Tooltip title="Incremento Anual(%)" aria-label="increaseAnually">
                        <span className={styles.porcentageAf}
                        >{getPorcentageAfiliados()}%</span>
                    </Tooltip>
                </div>

            </div>
            <div className={`${styles.amountWorker} ${styles.bgColorDes}`}>
                {/* Cantidad de Afiliados {employeesSelector.length} */}
                {/* <PeopleIcon className={classes.icon} /> */}
                <div className={styles.textSpan}>Desafiliados</div>
                <div className={styles.numberSpan}>
                    {loading ? <CircularProgress /> : inactiveEmployees.length}
                    <Tooltip title="Incremento Anual(%)" aria-label="increaseAnually">
                        <span className={styles.porcentageDes}>{getPorcentageDesafiliados()}%</span>
                    </Tooltip>
                </div>
            </div>
            <div className={styles.lastWorker}>
                <div className={styles.iconImage}>
                    <svg className={styles.icon}>
                        <use xlinkHref="/img/sprite.svg#icon-user"></use>
                    </svg>
                </div>
                <div className={styles.column}>
                    <div className={styles.title}>Último afiliado</div>
                    {loading ? <CircularProgress /> :
                        <Fragment>
                            <div>{lastWorker.apellido + ", " + lastWorker.nombre}</div>
                            <div>Afiliado Nro {lastWorker.nroLegajo}</div>
                        </Fragment>
                    }
                    {/* <div>Frigorífico {lastWorker.nroLegajo}</div> */}
                </div>
            </div>
        </div>
        <div className={styles.secondRow}>
            <h3>Afiliados por empresa</h3>
            <div style={{ height: '100%', width: '100%' }} className={"mb-4"}>

                <AutoSizer>
                    {({ height, width }) => (
                        <XYPlot height={height} width={width}
                            xType="ordinal">
                            <VerticalBarSeries data={data} color="rgb(5, 9, 126)" />
                            <XAxis />
                            <YAxis />
                        </XYPlot>
                    )}
                </AutoSizer>
            </div>
        </div >
        <div className={styles.thirdRow}>
            <h3>Padrón General</h3>
            <Paper className={classes.root}>
                <TableContainer className={classes.container}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {employeesSorted.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                        {columns.map((column) => {
                                            let value = "";
                                            if (column.id === "empresa") {
                                                value = row[column.id].nombre;
                                            } else {
                                                value = row[column.id];
                                            }
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    {value}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[3, 5, 10, 25, 100]}
                            component="div"
                            count={rows.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onChangePage={handleChangePage}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                            labelRowsPerPage={"Afiliados por página"}
                            nextIconButtonText={"Próxima página"}
                        />
                        <TableCell>
                            <Link href="/generalWorkerList">
                                <a className={`${classes.btn} ${classes.buttonPurple}`}
                                >Ver Afiliados en detalle</a>
                            </Link>
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Paper>
        </div>
    </Layout >);
}

export default Homepage;