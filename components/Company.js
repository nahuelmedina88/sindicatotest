import React, { useContext, useState, Fragment, memo, useEffect } from 'react';

import styles from "./css/Company.module.scss";
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
import LinearProgress from '@material-ui/core/LinearProgress';


import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';

//Redux
import { editCompanyAction, seeCompanyAction, editCompanyAction2 } from "./redux/actions/CompanyActions";
import { useDispatch } from "react-redux";

//Firebase
import { FirebaseContext } from "../firebase";

//Next
import Link from "next/link";

//Formik
import { Formik } from "formik";
import { object, string } from "yup";

//Image Compression
import imageCompression from 'browser-image-compression';
//Data
import documentationTypeData from "../components/data/documentationType.json";

const useStyles = makeStyles((theme) => ({

    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: "100%",
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
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
        alignItems: "center"
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
    buttonBlue: {
        backgroundColor: "#3b5999;",
        color: "#fff",
        "&:hover": {
            backgroundColor: "#3b5999b5",
        }
    },
}));

const Company = ({ company }) => {
    const [open, setOpen] = useState(false);
    const [openFicha, setOpenFicha] = useState(false);
    const [selectedFile, setSelectedFile] = useState("");
    const [documentacionURL, setDocumentacionURL] = useState("");
    const [progress, setProgress] = useState(0);

    const [documentationType, setDocumentationType] = useState("");
    const [documentationDate, setDocumentationDate] = useState("");

    const classes = useStyles();
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const dispatch = useDispatch();

    const { firebase } = useContext(FirebaseContext);

    const redirectToEdit = (company) => {
        dispatch(editCompanyAction2(company));
    }
    const redirectToSee = (company) => {
        dispatch(seeCompanyAction(company));
    }
    const handleClickOpenFicha = (dni) => {
        setDocumentacionURL("");
        setProgress(0);
        setSelectedFile("");
        setOpenFicha(dni);
        setDocumentationType("");
        setDocumentationDate("");
    };
    const handleCloseFicha = () => {
        setOpenFicha(false);
    };

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
            setSelectedFile(compressedFile);
        } catch (error) {
            console.log(error);
        }
    }

    const handleSubmitFicha = () => {
        let newCompany = Object.assign({}, company);
        newCompany.documentacion.push({ tipo: documentationType, fecha: documentationDate, url: documentacionURL });
        dispatch(editCompanyAction(newCompany, firebase));
        dispatch(seeCompanyAction(newCompany));
        handleCloseFicha();
    }

    const handleUpload = () => {
        // const uploadTask = firebase.storage.ref(`images/${selectedFile.name}`).put(selectedFile);
        const uploadTask = firebase.storage.ref(`documentacion/${documentationType}_${documentationDate}_${company.cuit}`).put(selectedFile);
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
                    .ref("documentacion")
                    // .child(selectedFile.name)
                    .child(`${documentationType}_${documentationDate}_${company.cuit}`)
                    .getDownloadURL()
                    .then(url => {
                        console.log(url);
                        setDocumentacionURL(url);
                    })
            }
        )
    }

    return (<>
        <TableRow key={company.dni}>
            <TableCell align="right">{company.nombre}</TableCell>
            {/* <TableCell component="th" scope="row">{employee.apellido}</TableCell> */}
            <TableCell align="right">{company.ciudad}</TableCell>
            <TableCell align="right">
                {company.domicilio ? company.domicilio : `${company.calle} ${company.numero_calle}`}
            </TableCell>
            <TableCell align="right">{company.cuit}</TableCell>
            <TableCell align="right">{company.razonSocial}</TableCell>
            <TableCell align="right">
                <Link href="/companies/SeeCompany[id]"
                    as={`/companies/SeeCompany${company.id}`}>
                    <Button
                        className={`${classes.buttonInfo}`}
                        onClick={() => redirectToSee(company)}>Ver</Button>
                </Link>
            </TableCell>
            <TableCell align="right">
                {/* <Link
                    href="/companies/[id]"
                    as={`/companies/${company.id}`}
                >
                    <a className={`${classes.btn} ${classes.buttonPurple}`}
                        onClick={() => redirectToEdit(company)}
                    >
                        Editar
                    </a>
                </Link> */}
                <Link
                    href="/companies/[id]"
                    as={`/companies/${company.id}`} passHref>
                    <Button
                        variant="contained"
                        className={`${classes.buttonPurple}`}
                        onClick={() => redirectToEdit(company)}>Editar</Button>
                </Link>
            </TableCell>
            <TableCell align="right">
                <Fragment>
                    <Link href="#">
                        <Button
                            className={`${classes.buttonBlue}`}
                            onClick={() => handleClickOpenFicha(company.cuit)}
                        >Agregar Documento</Button>
                    </Link>
                    <Dialog fullScreen open={openFicha === company.cuit && true}
                        onClose={handleCloseFicha}
                        aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title">
                            {company.nombre}
                        </DialogTitle>
                        <form>
                            <DialogContent>
                                <DialogContentText>
                                    Agregar Documento a la Carpeta
                                </DialogContentText>
                                <Fragment>
                                    <FormControl className={classes.formControl}>
                                        <InputLabel id="demo-controlled-open-select-label">Tipo de Documentación</InputLabel>
                                        <Select
                                            labelId="demo-controlled-open-select-label"
                                            id="demo-controlled-open-select"
                                            name="documentacion"
                                            placeholder="Tipo de Documentación"
                                            onChange={option => setDocumentationType(option.target.value)}
                                            value={documentationType}
                                        >{documentationTypeData.map(obj =>
                                            <MenuItem value={obj.label}>{obj.label}</MenuItem>
                                        )}
                                        </Select>
                                    </FormControl>
                                    <FormControl className={classes.formControl}>
                                        <TextField
                                            id="date"
                                            label="Fecha Documentación"
                                            type="date"
                                            name="fecha_documentacion"
                                            value={documentationDate}
                                            onChange={option => setDocumentationDate(option.target.value)}
                                            className={classes.textField}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                    </FormControl>
                                    {documentationDate && documentationType ?
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
                                        : null
                                    }

                                    {/* <div>
                                        <label>Estado Civil</label>
                                        <Select
                                            className={`inputSecondary ` + styles.myselect}
                                            name="documentacion"
                                            options={documentationType}
                                            placeholder={"Tipo de documentación"}
                                            onChange={option => setFieldValue("documentacion", option.label)}
                                            onBlur={option => setFieldTouched("documentacion", option.label)}
                                        ></Select>
                                         {touched.documentacion && errors.documentacion && <span className="errorMessage">{errors.documentacion}</span>} 
                                    </div> */}
                                </Fragment>
                                <DialogActions>
                                    <Button
                                        variant="contained"
                                        className={classes.buttonClose}
                                        onClick={handleCloseFicha}
                                        disabled={documentacionURL && documentationType && documentationDate ? true : false}
                                    >Cerrar
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={handleSubmitFicha}
                                        // disabled={isSubmitting}
                                        disabled={documentacionURL && documentationType && documentationDate ? false : true}
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
            </TableCell>
            <TableCell align="right">
                <Fragment>
                    <Link href="#">
                        <a className={`${classes.btn} ${classes.buttonClose}`}
                            onClick={() => handleClickOpen(company.id)}
                        >Eliminar</a>
                    </Link>
                    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title">
                            Baja del frigorífico {company.razonSocial}
                        </DialogTitle>
                        <DialogContent>
                            <Formik
                                initialValues={company}
                                onSubmit={(values, { setSubmitting }) => {
                                    setSubmitting(true);
                                    setTimeout(() => {
                                        values.estado = "Inactivo";
                                        values && dispatch(editCompanyAction(values, firebase));
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

export default Company;