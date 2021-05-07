import React, { useContext, useState, Fragment, memo, useEffect } from 'react';

//Material UI
import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { CircularProgress } from '@material-ui/core';

//Redux
import {
    seeEmployeeAction,
    editEmployeeAction,
    editEmployeeAction2,
    deleteEmployeeActionNoImpactDatabase
} from "./redux/actions/EmployeeActions";
import { useDispatch } from "react-redux";

//Firebase
import { FirebaseContext } from "../firebase";

//Next
import Link from "next/link";

//Formik
import { Formik } from "formik";
import { object, string } from "yup";


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
    buttonInfo: {
        backgroundColor: "#00a2ba",
        color: "#fff",
        "&:hover": {
            backgroundColor: "#00a2bab5",
        }
    },
});

const EmployeeListItem = ({ employee }) => {
    const [open, setOpen] = useState(false);
    const classes = useStyles();
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const dispatch = useDispatch();

    const { firebase } = useContext(FirebaseContext);

    const redirectToEdit = (employee) => {
        dispatch(editEmployeeAction2(employee));
        // history.push(`/employees/edit/${employee.id}`);
    }
    const redirectToSee = (employee) => {
        dispatch(seeEmployeeAction(employee));
        // history.push(`/employees/edit/${employee.id}`);
    }

    // useEffect(() => {
    //     console.log("employeesListItem render");
    // }, [])

    return (<>
        <TableRow key={employee.dni}>
            <TableCell align="right">{employee.nroLegajo}</TableCell>
            {/* <TableCell component="th" scope="row">{employee.apellido}</TableCell> */}
            <TableCell align="right">{employee.apellido}</TableCell>
            <TableCell align="right">{employee.nombre}</TableCell>
            <TableCell align="right">{employee.dni}</TableCell>
            <TableCell align="right">{employee.empresa.nombre}</TableCell>
            <TableCell align="right">
                {/* <Link
                    href="/employees/employee[id]"
                    as={`/employees/employee${employee.id}`}
                >
                    <a className={`${classes.btn} ${classes.buttonPurple}`}
                        onClick={() => redirectToSee(employee)}
                    >Ver Ficha</a>
                </Link> */}
                <Link href="/employees/employee[id]"
                    as={`/employees/employee${employee.id}`} passHref>
                    <Button
                        variant="contained"
                        className={`${classes.buttonPurple}`}
                        onClick={() => redirectToSee(employee)}>Ver Ficha</Button>
                </Link>
            </TableCell>
            <TableCell align="right">
                {/* <Link
                    href="/employees/[id]"
                    as={`/employees/${employee.id}`}
                >
                    <a className={`${classes.btn} ${classes.buttonInfo}`}
                        onClick={() => redirectToEdit(employee)}
                    >
                        Editar
                    </a>
                </Link> */}
                <Link href="/employees/[id]"
                    as={`/employees/${employee.id}`} passHref>
                    <Button
                        variant="contained"
                        className={`${classes.buttonInfo}`}
                        onClick={() => redirectToEdit(employee)}>Editar</Button>
                </Link>
            </TableCell>
            <TableCell align="right">
                <Fragment>
                    {/* <Link href="#">
                        <a className={`${classes.btn} ${classes.buttonClose}`}
                            onClick={() => handleClickOpen(employee.id)}
                        >Eliminar</a>
                    </Link> */}
                    <Link href="#" passHref>
                        <Button
                            variant="contained"
                            className={`${classes.buttonClose}`}
                            onClick={() => handleClickOpen(employee.id)}>Eliminar</Button>
                    </Link>
                    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title">
                            Baja del Trabajador {employee.nombre} {employee.apellido}
                        </DialogTitle>
                        <DialogContent>
                            <Formik
                                initialValues={employee}
                                onSubmit={(values, { setSubmitting }) => {
                                    setSubmitting(true);
                                    setTimeout(() => {
                                        values.estado = "Inactivo";
                                        values && dispatch(editEmployeeAction(values, firebase));
                                        values && dispatch(deleteEmployeeActionNoImpactDatabase(values.id, firebase));
                                        setSubmitting(false);
                                        setOpen(false);
                                    }, 2000);
                                }}
                                // validation={validation}
                                validationSchema={object({
                                    fecha_baja: string().required("La fecha es requerida")
                                })}
                            >{({ values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit }) => (
                                <form onSubmit={handleSubmit}>
                                    <DialogContentText>
                                        Ingrese la fecha de baja
                                                           </DialogContentText>
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        type="date"
                                        name="fecha_baja"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        fullWidth
                                    ></TextField>
                                    {touched.fecha_baja && errors.fecha_baja && <span className="errorMessage">{errors.fecha_baja}</span>}
                                    <DialogActions>
                                        <Button onClick={handleClose} color="primary">
                                            Cancelar
                                                                </Button>
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            variant="contained"
                                            color="primary"
                                            // className={`btn btnDanger`}
                                            startIcon={isSubmitting ? <CircularProgress size="0.9rem" /> : undefined}
                                        >{isSubmitting ? "Dando de baja" : "Dar de baja"}
                                        </Button>
                                    </DialogActions>
                                </form>
                            )}
                            </Formik>
                        </DialogContent>
                    </Dialog>
                </Fragment>
            </TableCell>
        </TableRow>
    </>);
}

export default EmployeeListItem;