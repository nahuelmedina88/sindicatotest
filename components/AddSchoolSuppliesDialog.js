import React, { useState, Fragment, useContext } from 'react'
//Material UI
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
//React-Select
import Select from 'react-select';
//Next
import Link from "next/link";
//Firebase
import { FirebaseContext } from "../firebase";
//Redux
import { editEmployeeAction, seeEmployeeAction } from "./redux/actions/EmployeeActions";
import { useSelector, useDispatch } from "react-redux";

const AddSchoolSuppliesDialog = ({ row }) => {
    const [open, setOpen] = useState("");
    const [talle, setTalle] = useState("");
    const [documentacionURL, setDocumentacionURL] = useState("");
    const [talle_anio, setTalleAnio] = useState(new Date().getFullYear());
    const [kit_escolar, setKitEscolar] = useState("");
    const [kit_escolar_anio, setKitEscolarAnio] = useState(new Date().getFullYear());
    const [selectedFile, setSelectedFile] = useState(null);
    const [dni_familiar, setDNIFamiliar] = useState("");
    const [worker, setWorker] = useState("");

    const schoolSuppliesSelect = [
        {
            "id": "1",
            "value": "PrimarioUno",
            "label": "Primario 1ro 3ro",
            "name": "kit_escolar"
        },
        {
            "id": "2",
            "value": "PrimarioDos",
            "label": "Primario 4to 6to",
            "name": "kit_escolar"
        },
        {
            "id": "3",
            "value": "secundario",
            "label": "Secundario",
            "name": "kit_escolar"
        },
        {
            "id": "4",
            "value": "especial",
            "label": "Especial",
            "name": "kit_escolar"
        }
    ];

    //Firebase instance
    const { firebase } = useContext(FirebaseContext);
    //Redux instances
    const dispatch = useDispatch();
    const employeeToSee = useSelector(state => state.employees.employeeToSee);

    const handleClickOpen = (dni) => {
        setOpen(dni);
        setDNIFamiliar(dni);
    };

    const handleClose = () => {
        setOpen("");
    };

    const handleChangeUploadImage = (e) => {
        if (e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    }

    const handleUpload = () => {
        const uploadTask = firebase.storage.ref(`images/${selectedFile.name}`).put(selectedFile);
        uploadTask.on(
            "state_changed",
            snapshot => { },
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

    const handleSubmit = () => {
        let fecha = new Date();
        let currentYear = fecha.getFullYear();
        let tipoDoc = "Constancia Alumno Regular";
        const nuevoEmpleado = employeeToSee;
        nuevoEmpleado.familia.map((familiar) => {
            if (dni_familiar === familiar.dni_familia) {
                let foundit = familiar.talle.filter(item => (item.anio === talle_anio));
                if (foundit.length > 0 && talle) {
                    familiar.talle.map((item, idx) => {
                        <         if (item.anio === talle_anio) {
                            item.numero = talle;
                            item.anio = talle_anio;
                        }
                    })
                } else { talle && familiar.talle.push({ numero: talle, anio: talle_anio }); }

                let foundit2 = familiar.kit_escolar.filter(item => (item.anio === kit_escolar_anio));
                if (foundit2.length > 0 && kit_escolar) {
                    familiar.kit_escolar.map((item) => {
                        if (item.anio === kit_escolar_anio) {
                            item.tipo = kit_escolar;
                            item.anio = kit_escolar_anio;
                        }
                    })
                } else { kit_escolar && familiar.kit_escolar.push({ tipo: kit_escolar, anio: kit_escolar_anio }); }

                let foundit3 = familiar.documentacion.filter(item => (item.anio === currentYear));
                if (foundit3.length > 0 && documentacionURL) {
                    familiar.documentacion.map((item) => {
                        if (item.anio === currentYear) {
                            setErrorMessage(true);
                        }
                    })
                } else { documentacionURL && familiar.documentacion.push({ url: documentacionURL, anio: currentYear, tipo: tipoDoc }); }
            }
        });
        dispatch(editEmployeeAction(nuevoEmpleado, firebase));
        dispatch(seeEmployeeAction(nuevoEmpleado));
        handleClose();
    }


    return (<Fragment>
        <Link href="#">
            <a className="btn btnDanger btnTable"
                onClick={() => handleClickOpen(row.dni_familia)}
            >Agregar Útiles</a>
        </Link>
        <Dialog fullWidth open={open === row.dni_familia && true}
            onClose={handleClose}
            aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">
                {row.apellido_familia}, {row.nombre_familia}
            </DialogTitle>
            <form>
                <DialogContent>
                    <DialogContentText>
                        Cargar info útiles
                </DialogContentText>

                    <TextField
                        autoFocus
                        margin="dense"
                        type="text"
                        name="talle"
                        onChange={(e) => setTalle(e.target.value)}
                        fullWidth
                        label="Talle"
                        variant="outlined"
                    ></TextField>
                    {/* <Select
                        className={`inputSecondary `}
                        name="talle_anio"
                        options={ultimosveinteanios}
                        placeholder={"Año"}
                        onChange={option => setTalleAnio(option.label)}
                    ></Select> */}
                    <Select
                        className={`inputSecondary `}
                        name="kit_escolar"
                        options={schoolSuppliesSelect}
                        placeholder={"Kit Escolar"}
                        onChange={option => setKitEscolar(option.label)}
                    ></Select>
                    {/* <Select
                        className={`inputSecondary `}
                        name={`kit_escolar_anio`}
                        options={ultimosveinteanios}
                        placeholder={"Año"}
                        onChange={option => setKitEscolarAnio(option.label)}
                    ></Select> */}
                    {row.documentacion.length === 0 ||
                        row.documentacion[row.documentacion.length - 1].anio !== new Date().getFullYear() ?
                        <Fragment>

                            <div>
                                <input
                                    type="file"
                                    name="selectedFile"
                                    onChange={handleChangeUploadImage}
                                    className={styles.customFileInput}
                                />
                            </div>
                            <div>
                                <Button
                                    variant="contained"
                                    component="label"
                                    onClick={handleUpload}
                                >
                                    Subir Archivo
                                </Button>
                            </div>
                        </Fragment> : null
                    }
                    <DialogActions>
                        <Button
                            type="button"
                            onClick={handleSubmit}
                            // disabled={isSubmitting}
                            variant="contained"
                            size="small"
                            color="secondary"
                        // className={`btn btnDanger`}
                        // startIcon={isSubmitting ? <CircularProgress size="0.9rem" /> : undefined}
                        >Guardar
                    {/* {isSubmitting ? <DoneAllIcon fontSize="small" /> : <CheckIcon fontSize="small" />} */}
                        </Button>
                    </DialogActions>
                </DialogContent>
            </form>
        </Dialog>
    </Fragment>);
}

export default AddSchoolSuppliesDialog;