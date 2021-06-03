import React, { useState, Fragment, useContext } from 'react';
import styles from "../css/employee[id].module.scss";
import { useSelector } from "react-redux";
import { calcularEdad } from "../../components/helpers/validHelper";
import { numberWithPoint, formatToCUIT } from "../../components/helpers/formHelper";

import Layout2 from '../../components/layout/Layout2';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Link from "next/link";
import Image from "next/image";


import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
//Icon
import EditIcon from '@material-ui/icons/Edit';

import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { Grid } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';

import LinearProgress from '@material-ui/core/LinearProgress';
//Image Compression
import imageCompression from 'browser-image-compression';
//Firebase
import { FirebaseContext } from "../../firebase";
//Redux
import { useDispatch } from "react-redux";
import { seeEmployeeAction, editEmployeeAction, editEmployeeAction2 } from "../../components/redux/actions/EmployeeActions";
//Icons
import PhoneAndroidRoundedIcon from '@material-ui/icons/PhoneAndroidRounded';
import MailOutlineRoundedIcon from '@material-ui/icons/MailOutlineRounded';
import ContactsRoundedIcon from '@material-ui/icons/ContactsRounded';
import BusinessRoundedIcon from '@material-ui/icons/BusinessRounded';
import EventRoundedIcon from '@material-ui/icons/EventRounded';
import LocationOnRoundedIcon from '@material-ui/icons/LocationOnRounded';
import PermContactCalendarRoundedIcon from '@material-ui/icons/PermContactCalendarRounded';
import CakeRoundedIcon from '@material-ui/icons/CakeRounded';
import HourglassEmptyRoundedIcon from '@material-ui/icons/HourglassEmptyRounded';

const useStyles2 = makeStyles({
    table: {
        minWidth: 650,
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
    buttonPurple: {
        backgroundColor: "rgb(86, 7, 138)",
        color: "#fff",
        "&:hover": {
            backgroundColor: "rgb(86, 7, 138,0.7)",
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
});


function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
}));



const SeeEmployee = () => {
    const classes2 = useStyles2();
    const employeeToSee = useSelector(state => state.employees.employeeToSee);
    const classes = useStyles();
    const [value, setValue] = useState(0);
    const [open, setOpen] = useState(false);
    const [dni_familiar, setDNIFamiliar] = useState("");
    const [documentacionURL, setDocumentacionURL] = useState("");
    const [selectedFile, setSelectedFile] = useState("");
    const [progress, setProgress] = useState(0);

    const { firebase } = useContext(FirebaseContext);
    const dispatch = useDispatch();
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const getDateDDMMAAAA = (mydate) => {
        let date = new Date(mydate);
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        let newdate = "";
        if (month < 10) {
            newdate = `${day}-0${month}-${year}`;
        } else {
            newdate = `${day}-${month}-${year}`;
        }
        return newdate;
    }

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

    const handleSubmit = () => {
        let newEmployee = Object.assign({}, employeeToSee);
        newEmployee.imagen_perfil_url = documentacionURL;
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

    const getDateAAAAMMDDFromFicha = (doc) => {
        let position = doc.url.indexOf("ficha_afiliado_");
        position = position + 15;
        let date = doc.url.substr(position, 10);
        return date;
    }

    const handleChangeUploadImage = async (event) => {
        const imageFile = event.target.files[0];
        console.log('originalFile instanceof Blob', imageFile instanceof Blob); // true
        console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);

        const options = {
            maxSizeMB: 0.1, //128KB
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

    return (<>
        {employeeToSee ?
            <div>
                <Layout2>
                    <Grid container >
                        <div className={styles.imageContainer}>
                            <div className={styles.containerImage}>
                                {employeeToSee.imagen_perfil_url ?

                                    <Image
                                        src={employeeToSee.imagen_perfil_url}
                                        alt="Trabajador Perfil"
                                        width={150}
                                        height={110}
                                        className={styles.img}
                                    ></Image>
                                    :
                                    <svg className={styles.icon}>
                                        <use xlinkHref="/img/sprite.svg#icon-user">
                                        </use>
                                    </svg>}
                                {/* <button className={styles.btn}>Button</button> */}
                                <Fragment>
                                    <Link href="#">
                                        <a className={`${styles.btn}`}
                                            onClick={() => handleClickOpen(employeeToSee.dni)}
                                        ><EditIcon className={styles.editIcon} /></a>
                                    </Link>
                                    <Dialog fullScreen open={open === employeeToSee.dni && true}
                                        onClose={handleClose}
                                        aria-labelledby="form-dialog-title">
                                        <DialogTitle id="form-dialog-title">
                                            {employeeToSee.apellido}, {employeeToSee.nombre}
                                        </DialogTitle>
                                        <form>
                                            <DialogContent>
                                                <DialogContentText>
                                                    Imagen de Perfil del Afiliado
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
                                                                >Subir Archivo
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
                                                    // disabled={documentacionURL ? true : false}
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

                            </div>


                            <div className={styles.sidebarInfoContainer}>
                                <div className={styles.rowSidebar}>
                                    <h4 className={styles.title}>Edad</h4>
                                    <span className={styles.spanIcon}><CakeRoundedIcon /></span>
                                    <span className={styles.spanLabel}>
                                        {employeeToSee.fecha_nacimiento && calcularEdad(employeeToSee.fecha_nacimiento)}
                                    </span>
                                </div>
                                <Divider variant="middle" />
                                <div className={styles.rowSidebar}>
                                    <h4 className={styles.title}>Nro Afiliado</h4>
                                    <span className={styles.spanIcon}><ContactsRoundedIcon /></span>
                                    <span className={styles.spanLabel}>{employeeToSee.nroLegajo}</span>
                                </div>

                                <div className={styles.rowSidebar}>
                                    <span className={styles.spanIcon}><BusinessRoundedIcon /></span>
                                    <span className={styles.spanLabel}>{employeeToSee.empresa.nombre}</span>
                                </div>
                                <div className={styles.rowSidebar}>
                                    <h4 className={styles.title}>Fecha de Afiliación</h4>
                                    <span className={styles.spanIcon}><EventRoundedIcon /></span>
                                    <span className={styles.spanLabel}>{employeeToSee.fecha_ingreso && getDateDDMMAAAA(employeeToSee.fecha_ingreso)}</span>
                                </div>
                                <div className={styles.rowSidebar}>
                                    <h4 className={styles.title}>Antigüedad</h4>
                                    <span className={styles.spanIcon}><HourglassEmptyRoundedIcon /></span>
                                    <span className={styles.spanLabel}>{employeeToSee.fecha_ingreso && calcularEdad(employeeToSee.fecha_ingreso)}</span>
                                </div>
                                <div className={styles.rowSidebar}>
                                    <h4 className={styles.title}>Sección</h4>
                                    {/* <span className={styles.spanIcon}><EventRoundedIcon /></span> */}
                                    <span className={styles.spanLabel}>{employeeToSee.seccion.label}</span>
                                </div>
                                <div className={styles.rowSidebar}>
                                    <h4 className={styles.title}>Categoría</h4>
                                    {/* <span className={styles.spanIcon}><EventRoundedIcon /></span> */}
                                    <span className={styles.spanLabel}>{employeeToSee.categoria.label}</span>
                                </div>
                            </div>

                        </div>
                        <div className={styles.tabsContainer}>
                            <div className={styles.headerName}>
                                <span className={styles.workerName}>{employeeToSee.nombre + " " + employeeToSee.apellido}</span>
                                {/* <span className={styles.companyName}>{employeeToSee.empresa.nombre}</span> */}
                            </div>
                            <div className={classes.root}>
                                <AppBar position="static">
                                    <Tabs value={value} onChange={handleChange}
                                        aria-label="simple tabs example">
                                        <Tab label="Información Básica" {...a11yProps(0)} />
                                        <Tab label="Grupo Familiar" {...a11yProps(1)} />
                                        <Tab label="Documentos" {...a11yProps(2)} />
                                    </Tabs>
                                </AppBar>
                                <TabPanel value={value} index={0}>
                                    <div className={styles.bodyContainer}>
                                        <div className={styles.rowBodyContainer}>
                                            <div className={styles.rowBody}>
                                                <span className={styles.spanIcon}><LocationOnRoundedIcon /></span>
                                                <h4 className={styles.title}>Lugar de Residencia</h4>
                                                <Divider className={styles.divider} />
                                                <div className={styles.itemRow}>
                                                    <span className={styles.title}>Domicilio</span>
                                                    <span className={styles.spanLabel}>
                                                        {employeeToSee.domicilio ? employeeToSee.domicilio : employeeToSee.calle + " " + employeeToSee.numero_calle.toString()},
                                                        {employeeToSee.ciudad}
                                                    </span>
                                                </div>
                                                <div className={styles.itemRow}>
                                                    <span className={styles.title}>Código Postal</span>
                                                    <span className={styles.spanLabel}>{employeeToSee.codigo_postal}</span>
                                                </div>
                                            </div>
                                            <div className={styles.rowBody}>
                                                <span className={styles.spanIcon}><PermContactCalendarRoundedIcon /></span>
                                                <h4 className={styles.title}>Mas datos personales</h4>
                                                <Divider className={styles.divider} />
                                                <div className={styles.itemRow}>
                                                    <span className={styles.title}>DNI</span>
                                                    <span className={styles.spanLabel}>{employeeToSee.dni && numberWithPoint(employeeToSee.dni)}</span>
                                                </div>
                                                <div className={styles.itemRow}>
                                                    <span className={styles.title}>CUIT</span>
                                                    <span className={styles.spanLabel}>{employeeToSee.cuil && formatToCUIT(employeeToSee.cuil)}</span>
                                                </div>
                                                <div className={styles.itemRow}>
                                                    <span className={styles.title}>Fecha de Nacimiento</span>
                                                    <span className={styles.spanLabel}>{employeeToSee.fecha_nacimiento && getDateDDMMAAAA(employeeToSee.fecha_nacimiento)}</span>
                                                </div>
                                                <div className={styles.itemRow}>
                                                    <span className={styles.title}>Estado Civil</span>
                                                    <span className={styles.spanLabel}>{employeeToSee.estado_civil}</span>
                                                </div>
                                                <div className={styles.itemRow}>
                                                    <span className={styles.title}>Nacionalidad</span>
                                                    <span className={styles.spanLabel}>{employeeToSee.nacionalidad}</span>
                                                </div>
                                            </div>
                                            <div className={styles.rowBody}>
                                                <span className={styles.spanIcon}><PhoneAndroidRoundedIcon /> <MailOutlineRoundedIcon /></span>
                                                <h4 className={styles.title}>Contacto</h4>
                                                <Divider className={styles.divider} />
                                                <div className={styles.itemRow}>
                                                    <span className={styles.title}>Teléfono</span>
                                                    <span className={styles.spanLabel}>{employeeToSee.telefono}</span>
                                                </div>
                                                <div className={styles.itemRow}>
                                                    <span className={styles.title}>Correo Electrónico</span>
                                                    <span className={styles.spanLabel}>{employeeToSee.email}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </TabPanel>
                                <TabPanel value={value} index={1}>
                                    <TableContainer component={Paper}>
                                        <Table className={classes2.table} aria-label="caption table">
                                            {/* <caption>A basic table example with a caption</caption> */}
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Apellido y Nombre</TableCell>
                                                    <TableCell align="right">DNI</TableCell>
                                                    <TableCell align="right">Fecha Nacimiento</TableCell>
                                                    <TableCell align="right">Parentesco</TableCell>
                                                    <TableCell align="right">Sexo</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {employeeToSee.familia.map((row) => (
                                                    <TableRow key={row.dni_familia}>
                                                        <TableCell component="th" scope="row">
                                                            {row.apellido_familia}, {row.nombre_familia}
                                                        </TableCell>
                                                        <TableCell align="right">{row.dni_familia && numberWithPoint(row.dni_familia)}</TableCell>
                                                        <TableCell align="right">{row.fecha_nacimiento_familia && getDateDDMMAAAA(row.fecha_nacimiento_familia)}</TableCell>
                                                        <TableCell align="right">{row.parentesco}</TableCell>
                                                        <TableCell align="right">{row.sexo}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </TabPanel>
                                <TabPanel value={value} index={2}>
                                    <TableContainer component={Paper}>
                                        <Table className={classes2.table} aria-label="caption table">
                                            {/* <caption>A basic table example with a caption</caption> */}
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell align="left">Tipo</TableCell>
                                                    <TableCell align="left">Año</TableCell>
                                                    <TableCell align="left">Enlace</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {employeeToSee.documentacion.map((row) => (
                                                    <TableRow>
                                                        <TableCell align="left">{row.tipo}</TableCell>
                                                        <TableCell align="leftt">   {row.tipo === "Ficha Trabajador" ?
                                                            row && getDateDDMMAAAA(getDateAAAAMMDDFromFicha(row)) :
                                                            row.anio}
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            {/* <Link href={row.url}>
                                                                Ver Documento
                                                            </Link> */}
                                                            <a className={`${classes2.btn} ${classes2.buttonPurple}`}
                                                                target="_blank"
                                                                href={row.url}
                                                                rel="noopener noreferrer">
                                                                Ver Documento
                                                            </a>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </TabPanel>
                            </div>
                            <Link href={"/generalWorkerList"}>
                                <a className={`${classes2.btn} ${classes2.buttonSave}`}
                                >Volver al Padrón</a>
                            </Link>
                        </div>
                    </Grid>
                </Layout2>
            </div >
            : null}
    </>);
}

export default SeeEmployee;