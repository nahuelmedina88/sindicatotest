import React, { useContext, useState, Fragment, memo, useEffect } from 'react';

//Material UI
import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import styles from "./css/WorkerListItemSchoolSupplies.module.scss";

import LinearProgress from '@material-ui/core/LinearProgress';
//Image Compression
import imageCompression from 'browser-image-compression';
//Redux
import { seeEmployeeAction, editEmployeeWithoutAlertAction, editEmployeeAction, editEmployeeAction2 } from "./redux/actions/EmployeeActions";
import { useDispatch } from "react-redux";

//Firebase
import { FirebaseContext } from "../firebase";

//Next
import Link from "next/link";

//Formik
import { Formik } from "formik";
import { object, string } from "yup";

const useStyles2 = makeStyles({
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
    buttonSuccess: {
        backgroundColor: "#00a441",
        color: "#fff",
        "&:hover": {
            backgroundColor: "#00a441b5",
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
    bgColorChecked: {
        backgroundColor: "#98b3e4b5",
    },
    bgColorNoChecked: {
        backgroundColor: "#f2747480",
    },
});


const WorkerListItemSchoolSupplies = ({ employee }) => {
    const [open, setOpen] = useState(false);
    const [dni_familiar, setDNIFamiliar] = useState("");
    const [documentacionURL, setDocumentacionURL] = useState("");
    const [progress, setProgress] = useState(0);
    const classes2 = useStyles2();
    const [selectedFile, setSelectedFile] = useState("");
    const getKitEscolares = (employee) => {
        let kitEscolares = [];
        employee && employee.familia.map(familiar => {
            familiar.kit_escolar && familiar.kit_escolar.map(kit => {
                kit.anio === new Date().getFullYear() ? kitEscolares.push(kit.tipo) : null;
            });
        });
        return kitEscolares;
    }
    const getSchoolClothes = (employee) => {
        let guardapolvos = [];
        employee && employee.familia.map(familiar => {
            familiar.talle && familiar.talle.map(guardapolvo => {
                guardapolvo.anio === new Date().getFullYear() ? guardapolvos.push(guardapolvo.numero) : null;
            });
        });
        return guardapolvos;
    }
    const kits = getKitEscolares(employee);
    const schoolClothes = getSchoolClothes(employee);

    const handleClickOpen = (dni) => {
        setDocumentacionURL("");
        setProgress(0);
        setSelectedFile("");
        setOpen(dni);
        setDNIFamiliar(dni);
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

    useEffect(() => {
        //console.log("employeesListItem render");
    }, [])

    const handleSubmit = () => {
        let currentYear = new Date().getFullYear();
        let tipoDoc = "Planilla Utiles";
        let newEmployee = Object.assign({}, employee);
        newEmployee.documentacion.push({ tipo: tipoDoc, anio: currentYear, url: documentacionURL });
        dispatch(editEmployeeAction(newEmployee, firebase));
        dispatch(seeEmployeeAction(newEmployee));
        handleClose();
    }


    const handleUpload = () => {
        const uploadTask = firebase.storage.ref(`images/${selectedFile.name}`).put(selectedFile);
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
                    .ref("images")
                    .child(selectedFile.name)
                    .getDownloadURL()
                    .then(url => {
                        console.log(url);
                        setDocumentacionURL(url);
                    })
            }

        )
    }

    const tienePlanillaCargada = (doc) => {
        let foundit = doc.find(item => item.anio === new Date().getFullYear() && item.tipo === "Planilla Utiles");
        return foundit;
    }

    const handleChangeUploadImage = async (event) => {

        const imageFile = event.target.files[0];
        console.log('originalFile instanceof Blob', imageFile instanceof Blob); // true
        console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);

        const options = {
            maxSizeMB: 0.5,
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

    // const handleChangeUploadImage = (e) => {
    //     if (e.target.files[0]) {
    //         setSelectedFile(e.target.files[0]);
    //     }
    // }


    const handleChangeCheckBox = (e) => {
        let dniChecked = parseInt(e.target.id);
        const newEmployee = Object.assign({}, employee);
        newEmployee.entregado = (employee.dni === dniChecked) && { checked: e.target.checked, anio: new Date().getFullYear() }
        let newFamiliares = employee.familia.map(familiar => {
            familiar.entregado = { checked: e.target.checked, anio: new Date().getFullYear() }
            return familiar;
        });
        newEmployee.familia = newFamiliares;
        dispatch(editEmployeeWithoutAlertAction(newEmployee, firebase));
        // dispatch(seeEmployeeAction(newEmployee));
    }

    return (<>
        <TableRow key={employee.dni} className={employee.entregado && employee.entregado.checked ? classes2.bgColorChecked : classes2.bgColorNoChecked}>
            <TableCell align="right">
                <Checkbox
                    id={employee.dni}
                    checked={employee.entregado ? employee.entregado.checked : false}
                    onChange={handleChangeCheckBox}
                    inputProps={{ 'aria-label': 'controlled' }}
                />
            </TableCell>
            <TableCell align="right">{employee.nroLegajo}</TableCell>
            {/* <TableCell component="th" scope="row">{employee.apellido}</TableCell> */}
            <TableCell align="right">{employee.apellido}</TableCell>
            <TableCell align="right">{employee.nombre}</TableCell>
            <TableCell align="right">{employee.dni}</TableCell>
            <TableCell align="right">{employee.empresa.nombre}</TableCell>
            <TableCell aling="right">
                {schoolClothes && schoolClothes.map((guardapolvo, idx) => {
                    if (idx === 0 && schoolClothes.length > 1) {
                        return <span>{`${schoolClothes.length} (${guardapolvo}`} </span>
                    } else if (idx === 0 && schoolClothes.length === 1) {
                        return <span>{`${schoolClothes.length} (${guardapolvo}`})</span>
                    } else if (idx === schoolClothes.length - 1) {
                        return <span>{`${guardapolvo})`}</span>
                    } else {
                        return <span>{`${guardapolvo}`} </span>
                    }
                })}
            </TableCell>
            <TableCell align="right">
                {kits && kits.map((kit, idx) => {
                    if (idx === 0 && kits.length > 1) {
                        return <span>{`${kits.length} (${kit}`} </span>
                    } else if (idx === 0 && kits.length === 1) {
                        return <span>{`${kits.length} (${kit}`})</span>
                    } else if (idx === kits.length - 1) {
                        return <span>{`${kit})`}</span>
                    } else {
                        return <span>{`${kit}`} </span>
                    }
                })}
            </TableCell>
            <TableCell align="right">
                <Link
                    href="/familyGroupList[id]"
                    as={`/familyGroupList${employee.id}`} passHref>
                    <Button
                        variant="contained" className={`${classes2.buttonPurple}`}
                        onClick={() => redirectToSee(employee)}
                    >Ver Hijos</Button>
                </Link>
            </TableCell>
            <TableCell align="right">
                {/* <Link
                    href="/employees/[id]"
                    as={`/employees/${employee.id}`}
                >
                    <a className={`${classes2.btn} ${classes2.buttonSuccess}`}
                        onClick={() => redirectToEdit(employee)}
                    >
                        Agregar familiar
                    </a>
                </Link> */}
                <Link
                    href="/employees/[id]"
                    as={`/employees/${employee.id}`} passHref>
                    <Button
                        variant="contained"
                        className={`${classes2.buttonSuccess}`}
                        onClick={() => redirectToEdit(employee)}>Agregar familiar</Button>
                </Link>
            </TableCell>
            <TableCell align="right">

                {employee.documentacion && tienePlanillaCargada(employee.documentacion) ?
                    null :
                    <Fragment>
                        <Link href="#">
                            <Button className={`${classes2.buttonBlue}`}
                                onClick={() => handleClickOpen(employee.dni)}
                            >Adjuntar Planilla</Button>
                        </Link>
                        <Dialog fullScreen open={open === employee.dni && true}
                            onClose={handleClose}
                            aria-labelledby="form-dialog-title">
                            <DialogTitle id="form-dialog-title">
                                {employee.apellido}, {employee.nombre}
                            </DialogTitle>
                            <form>
                                <DialogContent>
                                    <DialogContentText>
                                        Adjuntar planilla de útiles
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
                                                        className={`${classes2.btn} ${classes2.buttonSuccess}`}
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
                                            className={classes2.buttonClose}
                                            onClick={handleClose}
                                            disabled={documentacionURL ? true : false}
                                        >Cerrar
                                        </Button>
                                        <Button
                                            type="button"
                                            onClick={handleSubmit}
                                            // disabled={isSubmitting}
                                            variant="contained"
                                            className={classes2.buttonSave}
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

export default WorkerListItemSchoolSupplies;