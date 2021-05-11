import React, { useContext, useState, Fragment, memo, useEffect } from 'react';

//Material UI
import LinearProgress from '@material-ui/core/LinearProgress';
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
import styles from "./css/EmployeeListItem.module.scss";

//Image Compression
import imageCompression from 'browser-image-compression';

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
import { TramRounded } from '@material-ui/icons';


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
    buttonSuccess: {
        backgroundColor: "#00a441",
        color: "#fff",
        "&:hover": {
            backgroundColor: "#00a441b5",
        }
    },
});

const EmployeeListItem = ({ employee }) => {
    const [open, setOpen] = useState(false);
    const [openFicha, setOpenFicha] = useState(false);
    const classes = useStyles();

    const [dni_familiar, setDNIFamiliar] = useState("");
    const [selectedFile, setSelectedFile] = useState("");
    const [documentacionURL, setDocumentacionURL] = useState("");
    const [progress, setProgress] = useState(0);
    const handleClickOpen = (dni) => {
        setOpen(dni);
    };

    const handleClickOpenFicha = (dni) => {
        setDocumentacionURL("");
        setProgress(0);
        setSelectedFile("");
        setOpenFicha(dni);
        setDNIFamiliar(dni);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleCloseFicha = () => {
        setOpenFicha(false);
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


    const handleSubmitFicha = () => {
        let currentYear = new Date().getFullYear();
        let tipoDoc = "Ficha Trabajador";
        let newEmployee = Object.assign({}, employee);
        newEmployee.documentacion.push({ tipo: tipoDoc, anio: currentYear, url: documentacionURL });
        dispatch(editEmployeeAction(newEmployee, firebase));
        dispatch(seeEmployeeAction(newEmployee));
        handleCloseFicha();
    }

    const handleUpload = () => {
        // const uploadTask = firebase.storage.ref(`images/${selectedFile.name}`).put(selectedFile);
        const uploadTask = firebase.storage.ref(`ficha_trabajador/ficha_afiliado_${new Date().getFullYear().toString()}_${employee.dni}`).put(selectedFile);
        uploadTask.on(
            "state_changed",
            snapshot => {
                const thisprogress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(thisprogress);
            },
            error => {
                console.log(error);
            },
            () => {
                firebase.storage
                    .ref("ficha_trabajador")
                    // .child(selectedFile.name)
                    .child(`ficha_afiliado_${new Date().getFullYear().toString()}_${employee.dni}`)
                    .getDownloadURL()
                    .then(url => {
                        console.log(url);
                        setDocumentacionURL(url);
                    })
            }

        )
    }

    const handleChangeUploadImage = async (event) => {
        const imageFile = event.target.files[0];
        console.log('originalFile instanceof Blob', imageFile instanceof Blob); // true
        console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);
        const options = {
            maxSizeMB: 0.4,
            maxWidthOrHeight: 1920,
            useWebWorker: true
        }
        try {
            const compressedFile = await imageCompression(imageFile, options);
            console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
            console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB
            // await uploadToServer(compressedFile); // write your own logic
            setSelectedFile(compressedFile);
        } catch (error) {
            console.log(error);
        }
    }

    const tieneFichaCargada = (doc) => {
        let foundit = doc.find(item => item.anio === new Date().getFullYear() && item.tipo === "Ficha Trabajador");
        return foundit;
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
            <TableCell align="right">
                {employee.documentacion && tieneFichaCargada(employee.documentacion) ?
                    null :
                    <Fragment>
                        <Link href="#">
                            <Button className={`${classes.buttonBlue}`}
                                onClick={() => handleClickOpenFicha(employee.dni)}
                            >Adjuntar Ficha</Button>
                        </Link>
                        <Dialog fullScreen open={openFicha === employee.dni && true}
                            onClose={handleCloseFicha}
                            aria-labelledby="form-dialog-title">
                            <DialogTitle id="form-dialog-title">
                                {employee.apellido}, {employee.nombre}
                            </DialogTitle>
                            <form>
                                <DialogContent>
                                    <DialogContentText>
                                        Adjuntar Ficha de trabajador
                                </DialogContentText>
                                    <Fragment>
                                        <input
                                            type="file"
                                            name="selectedFile"
                                            onChange={handleChangeUploadImage}
                                            className={`${styles.customFileInput}`}
                                        />
                                        {
                                            selectedFile.name ?
                                                <Fragment>
                                                    <LinearProgress variant="determinate" value={progress} />
                                                    <Button
                                                        variant="contained"
                                                        component="label"
                                                        onClick={handleUpload}
                                                        className={`${classes.btn} ${classes.buttonSuccess}`}
                                                        disabled={documentacionURL ? true : false}
                                                    >
                                                        Subir Archivo
                                            </Button>
                                                </Fragment>
                                                : null
                                        }
                                    </Fragment>
                                    <DialogActions>
                                        <Button
                                            variant="contained"
                                            className={classes.buttonClose}
                                            onClick={handleCloseFicha}
                                            disabled={documentacionURL ? true : false}
                                        >Cerrar
                                        </Button>
                                        <Button
                                            type="button"
                                            onClick={handleSubmitFicha}
                                            // disabled={isSubmitting}
                                            disabled={documentacionURL ? false : true}
                                            variant="contained"
                                            className={classes.buttonSave}
                                        // className={`btn btnDanger`}
                                        // startIcon={isSubmitting ? <CircularProgress size="0.9rem" /> : undefined}
                                        >Guardar
                                    {/* {isSubmitting ? <DoneAllIcon fontSize="small" /> : <CheckIcon fontSize="small" />} */}
                                        </Button>
                                    </DialogActions>
                                </DialogContent>
                            </form>
                        </Dialog>
                    </Fragment>
                }
            </TableCell>
        </TableRow>
    </>);
}

export default EmployeeListItem;