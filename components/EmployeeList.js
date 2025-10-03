import React, { useContext, useState, Fragment, memo, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { CircularProgress } from '@mui/material';

import Link from "next/link";

import { seeEmployeeAction, editEmployeeAction, editEmployeeAction2 } from "./redux/actions/EmployeeActions";
import { useDispatch } from "react-redux";
import swal from "sweetalert2";
//Firebase
import { FirebaseContext } from "../firebase";

//Formik
import { Formik, Field, Form } from "formik";
import { object, string } from "yup";

// import styles from "../pages/css/EmployeeList.module.scss";

const validation = (values) => {

    let errors = {};

    if (!values.fecha_baja) {
        errors.fecha_baja = 'Ingrese la Fecha de baja';
    }
}

const EmployeeList = memo(({ employee }) => {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const dispatch = useDispatch();

    const { firebase } = useContext(FirebaseContext);

    const { id, nroLegajo, apellido, nombre, dni } = employee;

    const redirectToEdit = (employee) => {
        dispatch(editEmployeeAction2(employee));
        // history.push(`/employees/edit/${employee.id}`);
    }
    const redirectToSee = (employee) => {
        dispatch(seeEmployeeAction(employee));
        // history.push(`/employees/edit/${employee.id}`);
    }

    useEffect(() => {
        console.log("employeesList render");
    }, [])

    return (
        <tr>
            <td>{nroLegajo}</td>
            <td>{apellido}</td>
            <td>{nombre}</td>
            <td>{dni}</td>
            <td>{employee.empresa.nombre}</td>
            <td>
                <Link
                    href="/employees/employee[id]"
                    as={`/employees/employee${id}`}
                >
                    <a className="btn btnPrimary btnTable"
                        onClick={() => redirectToSee(employee)}
                    >
                        Ver Ficha
                    </a>
                </Link>
            </td>
            <td>
                <Link
                    href="/employees/[id]"
                    as={`/employees/${id}`}
                >
                    <a className="btn btnPrimary btnTable"
                        onClick={() => redirectToEdit(employee)}
                    >
                        Editar
                    </a>
                </Link>
            </td>
            <td>

                <Fragment>
                    <Link href="">
                        <a className="btn btnDanger btnTable"
                            onClick={() => handleClickOpen(id)}
                        >Eliminar</a>
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
            </td>
        </tr >
    );
})

export default EmployeeList;