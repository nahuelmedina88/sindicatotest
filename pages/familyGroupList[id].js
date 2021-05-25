import React, { useState, useContext, Fragment } from 'react';
import styles from "./css/familyGroupList[id].module.scss";
// import Select from 'react-select';
import Select from '@material-ui/core/Select';

import HistorialDialog from "../components/HistorialDialog";
import SeeDocumentation from "../components/SeeDocumentation";
import Layout2 from '../components/layout/Layout2';
//Redux
import { editEmployeeWithoutAlertAction, editEmployeeAction, seeEmployeeAction } from "../components/redux/actions/EmployeeActions";
import { useSelector, useDispatch } from "react-redux";
//Material UI
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
// import FormControl from '@material-ui/core/FormControl';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Checkbox from '@material-ui/core/Checkbox';

import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';

// import { CircularProgress } from '@material-ui/core';
// import CheckIcon from '@material-ui/icons/Check';
// import AddIcon from '@material-ui/icons/Add';
// import DoneAllIcon from '@material-ui/icons/DoneAll';

//Firebase
import { FirebaseContext } from "../firebase";

//Next
import Link from "next/link";

const useStyles2 = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    table: {
        minWidth: 650,
    },
    buttonAdd: {
        margin: 4,
        padding: 0,
    },
    buttonPrimary: {
        backgroundColor: "#0084ff",
        color: "#fff",
        "&:hover": {
            backgroundColor: "#0084ffb5",
        }
    },
    buttonInfo: {
        backgroundColor: "#00a2ba",
        color: "#fff",
        "&:hover": {
            backgroundColor: "#00a2bab5",
        }
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
    buttonSuccess: {
        backgroundColor: "#00a441",
        color: "#fff",
        "&:hover": {
            backgroundColor: "#00a441b5",
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
    buttonPurple: {
        backgroundColor: "rgb(86, 7, 138)",
        color: "#fff",
        "&:hover": {
            backgroundColor: "rgb(86, 7, 138,0.7)",
        }
    },
    bgColorChecked: {
        backgroundColor: "#98b3e4b5",
    },
    bgColorNoChecked: {
        backgroundColor: "#f2747480",
    },
}));

const familyGroupList = () => {
    const [talle, setTalle] = useState("");
    // const [documentacionURL, setDocumentacionURL] = useState("");
    const [talle_anio, setTalleAnio] = useState(new Date().getFullYear());
    const [kit_escolar, setKitEscolar] = useState("");
    const [kit_escolar_anio, setKitEscolarAnio] = useState(new Date().getFullYear());
    const [selectedFile, setSelectedFile] = useState(null);
    const [dni_familiar, setDNIFamiliar] = useState("");

    const classes2 = useStyles2();
    const employeeToSee = useSelector(state => state.employees.employeeToSee);
    const [open, setOpen] = useState("");

    //Firebase
    const { firebase } = useContext(FirebaseContext);
    const dispatch = useDispatch();

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

    const handleClickOpen = (dni) => {
        setOpen(dni);
        setDNIFamiliar(dni);
    };

    const handleClose = () => {
        setOpen("");
    };

    // const handleChangeUploadImage = (e) => {
    //     if (e.target.files[0]) {
    //         setSelectedFile(e.target.files[0]);
    //     }
    // }

    const isAllChecked = (employee) => {
        let arr = employee.familia.map(familiar => {
            return !familiar.entregado.checked ? false : true;
        });
        console.log(arr);
        const found = arr.find(element => element === false);
        return found === false ? false : true;
    }

    const getDateDDMMAAAA = (mydate) => {
        let date = new Date(mydate)
        let day = date.getDate() + 1
        let month = date.getMonth() + 1
        let year = date.getFullYear()
        let newdate = "";
        if (month < 10) {
            newdate = `${day}-0${month}-${year}`;
        } else {
            newdate = `${day}-${month}-${year}`;
        }
        return newdate;
    }

    const handleChangeCheckBox = (e) => {
        let dniChecked = parseInt(e.target.id);
        const newEmployee = Object.assign({}, employeeToSee);
        let newFamiliares = employeeToSee.familia.map(familiar => {
            if (familiar.dni_familia === dniChecked) {
                familiar.entregado = { checked: e.target.checked, anio: new Date().getFullYear() }
            }
            return familiar;
        });
        newEmployee.familia = newFamiliares;
        newEmployee.entregado = isAllChecked(newEmployee) ? { checked: true, anio: new Date().getFullYear() } : { checked: false, anio: new Date().getFullYear() }
        // console.log(newEmployee);
        dispatch(editEmployeeWithoutAlertAction(newEmployee, firebase));
        dispatch(seeEmployeeAction(newEmployee));
    }

    const redirectToEdit = (employee) => {
        dispatch(editEmployeeAction2(employee));
        // history.push(`/employees/edit/${employee.id}`);
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
        // let fecha = new Date();
        // let currentYear = fecha.getFullYear();
        // let tipoDoc = "Constancia Alumno Regular";
        employeeToSee.familia.map((familiar) => {
            if (dni_familiar === familiar.dni_familia) {
                let foundit = familiar.talle.filter(item => (item.anio === talle_anio));
                if (foundit.length > 0 && talle) {
                    familiar.talle.map((item, idx) => {
                        if (item.anio === talle_anio) {
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

                // let foundit3 = familiar.documentacion.filter(item => (item.anio === currentYear));
                // if (foundit3.length > 0 && documentacionURL) {
                //     familiar.documentacion.map((item) => {
                //         if (item.anio === currentYear) {
                //             setErrorMessage(true);
                //         }
                //     })
                // } else { documentacionURL && familiar.documentacion.push({ url: documentacionURL, anio: currentYear, tipo: tipoDoc }); }
            }
        });
        let newEmployee = employeeToSee;
        dispatch(editEmployeeAction(newEmployee, firebase));
        dispatch(seeEmployeeAction(newEmployee));
        handleClose();
    }

    return (<>
        <Layout2>
            {employeeToSee ?
                <Fragment>
                    <TableContainer component={Paper}>
                        <Table className={classes2.table} aria-label="caption table">
                            {/* <caption>A basic table example with a caption</caption> */}
                            <TableHead>
                                <TableRow>

                                    <TableCell align="right">Entregado</TableCell>
                                    <TableCell align="right">Apellido y Nombre</TableCell>
                                    <TableCell align="right">DNI</TableCell>
                                    <TableCell align="right">Fecha Nacimiento</TableCell>
                                    <TableCell align="right">Parentesco</TableCell>
                                    <TableCell align="right">Sexo</TableCell>
                                    <TableCell align="right">Talle</TableCell>
                                    <TableCell align="right">Tipo Kit Escolar</TableCell>
                                    {/* <TableCell align="right">Documentación</TableCell> */}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {employeeToSee.familia.map((row, idx) => (
                                    <TableRow key={row.dni_familia} className={row.entregado && row.entregado.checked ? classes2.bgColorChecked : classes2.bgColorNoChecked}>
                                        <TableCell>
                                            <Checkbox
                                                id={row.dni_familia}
                                                checked={row.entregado ? row.entregado.checked : false}
                                                onChange={handleChangeCheckBox}
                                                inputProps={{ 'aria-label': 'controlled' }}
                                            />
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            {row.apellido_familia}, {row.nombre_familia}
                                        </TableCell>
                                        <TableCell align="right">{row.dni_familia}</TableCell>
                                        <TableCell align="right">{getDateDDMMAAAA(row.fecha_nacimiento_familia)}</TableCell>
                                        <TableCell align="right">{row.parentesco}</TableCell>
                                        <TableCell align="right">{row.sexo}</TableCell>
                                        <TableCell align="right">{row.talle[0] ?
                                            <Fragment>
                                                {
                                                    row.talle[row.talle.length - 1].anio === new Date().getFullYear() ?
                                                        row.talle[row.talle.length - 1].numero : null
                                                }
                                            </Fragment>
                                            : null}
                                        </TableCell>
                                        <TableCell align="right">{row.kit_escolar[0] ?
                                            <Fragment>
                                                {row.kit_escolar[row.kit_escolar.length - 1].anio === new Date().getFullYear() ?
                                                    row.kit_escolar[row.kit_escolar.length - 1].tipo : null}
                                            </Fragment>
                                            : null}
                                        </TableCell>
                                        {/* <TableCell align="right">
                                            {row.documentacion[0] && row.documentacion[row.documentacion.length - 1].anio === new Date().getFullYear() ?
                                                <SeeDocumentation row={row} />
                                                : <span>Sin documentación {new Date().getFullYear()}</span>
                                            }
                                        </TableCell> */}
                                        <TableCell>
                                            <Fragment>
                                                <Link href="#">
                                                    <a className={`${classes2.btn} ${classes2.buttonSuccess}`}
                                                        onClick={() => handleClickOpen(row.dni_familia)}
                                                    >Agregar Útiles</a>
                                                </Link>
                                                <Dialog open={open === row.dni_familia && row.dni_familia ? true : false}
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
                                                                name="kit_escolar"
                                                                options={schoolSuppliesSelect}
                                                                placeholder={"Kit Escolar"}
                                                                onChange={option => setKitEscolar(option.label)}
                                                            ></Select> */}
                                                            <FormControl className={classes2.formControl}>
                                                                <InputLabel id="demo-controlled-open-select-label">Kit Escolar</InputLabel>
                                                                <Select
                                                                    labelId="demo-controlled-open-select-label"
                                                                    id="demo-controlled-open-select"
                                                                    name="kit_escolar"
                                                                    placeholder="Kit Escolar"
                                                                    onChange={option => setKitEscolar(option.target.value)}
                                                                    value={kit_escolar}
                                                                >
                                                                    {schoolSuppliesSelect.map(obj =>
                                                                        <MenuItem value={obj.label}>{obj.label}</MenuItem>
                                                                    )}
                                                                </Select>
                                                            </FormControl>
                                                            {/* {row.documentacion.length === 0 ||
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
                                                            } */}
                                                            <DialogActions>
                                                                <Button
                                                                    variant="contained"
                                                                    className={classes2.buttonClose}
                                                                    onClick={handleClose}>
                                                                    Cerrar
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
                                        </TableCell>
                                        <TableCell align="right">
                                            <HistorialDialog row={row} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <Link href={"/schoolSuppliesWorkerList"}>
                            <a className={`${classes2.btn} ${classes2.buttonPurple}`}

                            >Ir a la Lista</a>
                        </Link>
                    </TableContainer>
                </Fragment>
                : null}
        </Layout2>
    </>);
}

export default familyGroupList;