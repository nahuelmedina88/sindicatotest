import React, { useContext, useState, Fragment } from 'react';

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

//Helpers
import { numberWithPoint } from "../components/helpers/formHelper";

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
    buttonYellow: {
        backgroundColor: "#879442",
        color: "#fff",
        "&:hover": {
            backgroundColor: "#879442b5",
        }
    },
    buttonSave: {
        backgroundColor: "rgb(7,138,7)",
        color: "#fff",
        "&:hover": {
            backgroundColor: "rgb(7,138,7, 0.7)",
        }
    },
    buttonBlue: {
        backgroundColor: "#3b5999;",
        color: "#fff",
        "&:hover": {
            backgroundColor: "#3b5999b5",
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

const WorkerNoActiveListItem = ({ employee }) => {
    const [open, setOpen] = useState(false);
    const classes = useStyles();
    const handleClickOpen = (dni) => {
        setOpen(dni);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const dispatch = useDispatch();

    const { firebase } = useContext(FirebaseContext);

    const redirectToSee = (employee) => {
        dispatch(seeEmployeeAction(employee));
        // history.push(`/employees/edit/${employee.id}`);
    }


    return (<>
        <TableRow key={employee.dni}>
            <TableCell align="right">{employee.nroLegajo}</TableCell>
            <TableCell align="right">{employee.apellido}</TableCell>
            <TableCell align="right">{employee.nombre}</TableCell>
            <TableCell align="right">{numberWithPoint(employee.dni)}</TableCell>
            <TableCell align="right">{employee.empresa.nombre}</TableCell>
            <TableCell align="right">
                <Link href="/employees/employee[id]"
                    as={`/employees/employee${employee.id}`} passHref>
                    <Button
                        variant="contained"
                        className={`${classes.buttonPurple}`}
                        onClick={() => redirectToSee(employee)}>Ver Ficha</Button>
                </Link>
            </TableCell>
            <TableCell align="right">
                <Fragment>
                    <Link href="#" passHref>
                        <Button
                            variant="contained"
                            className={`${classes.buttonSave}`}
                            onClick={() => handleClickOpen(employee.id)}>Dar de Alta</Button>
                    </Link>
                    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title">
                            Alta del Trabajador {employee.nombre} {employee.apellido}
                        </DialogTitle>
                        <DialogContent>
                            <Formik
                                initialValues={employee}
                                onSubmit={(values, { setSubmitting }) => {
                                    setSubmitting(true);
                                    setTimeout(() => {
                                        values.estado = "Activo";
                                        values.fecha_ingreso = values.fecha_alta;
                                        values && dispatch(editEmployeeAction(values, firebase));
                                        values && dispatch(deleteEmployeeActionNoImpactDatabase(values.id));
                                        setSubmitting(false);
                                        setOpen(false);
                                    }, 2000);
                                }}
                                // validation={validation}
                                validationSchema={object({
                                    fecha_alta: string().required("La fecha es requerida")
                                })}
                            >{({ values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit }) => (
                                <form onSubmit={handleSubmit}>
                                    <DialogContentText>
                                        Ingrese la fecha de alta
                                                           </DialogContentText>
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        type="date"
                                        name="fecha_alta"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        fullWidth
                                    ></TextField>
                                    {touched.fecha_alta && errors.fecha_alta && <span className="errorMessage">{errors.fecha_alta}</span>}
                                    <DialogActions>
                                        <Button onClick={handleClose} color="primary">Cancelar</Button>
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            variant="contained"
                                            color="primary"
                                            startIcon={isSubmitting ? <CircularProgress size="0.9rem" /> : undefined}
                                        >{isSubmitting ? "Dando de alta" : "Dar de alta"}
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

export default WorkerNoActiveListItem;