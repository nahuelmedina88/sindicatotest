import React, { useState, Fragment, useContext } from 'react';
import styles from "../css/employee[id].module.scss";
import { useSelector } from "react-redux";
import { calcularEdad } from "../../components/helpers/validHelper";
import { numberWithPoint, formatToCUIT } from "../../components/helpers/formHelper";

import Layout2 from '../../components/layout/Layout2';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Link from "next/link";
import Image from "next/image";

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
//Icon
import EditIcon from '@mui/icons-material/Edit';

import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Grid } from '@mui/material';
import Divider from '@mui/material/Divider';

import LinearProgress from '@mui/material/LinearProgress';
//Image Compression
import imageCompression from 'browser-image-compression';
//Firebase
import { FirebaseContext } from "../../firebase";
//Redux
import { useDispatch } from "react-redux";
import { seeEmployeeAction, editEmployeeAction } from "../../components/redux/actions/EmployeeActions";
//Icons
import PhoneAndroidRoundedIcon from '@mui/icons-material/PhoneAndroidRounded';
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';
import ContactsRoundedIcon from '@mui/icons-material/ContactsRounded';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import EventRoundedIcon from '@mui/icons-material/EventRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import PermContactCalendarRoundedIcon from '@mui/icons-material/PermContactCalendarRounded';
import CakeRoundedIcon from '@mui/icons-material/CakeRounded';
import HourglassEmptyRoundedIcon from '@mui/icons-material/HourglassEmptyRounded';

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

const SeeEmployee = () => {
  const employeeToSee = useSelector(state => state.employees.employeeToSee);
  const [value, setValue] = useState(0);
  const [open, setOpen] = useState(false);
  const [dni_familiar, setDNIFamiliar] = useState("");
  const [documentacionURL, setDocumentacionURL] = useState("");
  const [selectedFile, setSelectedFile] = useState("");
  const [progress, setProgress] = useState(0);

  const { firebase } = useContext(FirebaseContext); // ⚠️ si migraste a SDK modular, actualizá este uso más adelante
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

  // ⚠️ Este bloque usa el SDK no modular (firebase.storage). Mantengo la lógica tal cual,
  // solo cambié los estilos. Más adelante podemos migrarlo a `getStorage` (modular).
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
    const options = {
      maxSizeMB: 0.1, //128KB
      maxWidthOrHeight: 1920,
      useWebWorker: true
    }
    try {
      const compressedFile = await imageCompression(imageFile, options);
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
                  />
                  :
                  <svg className={styles.icon}>
                    <use href="/img/sprite.svg#icon-user" />
                  </svg>}

                <Fragment>
                  <Button
                    onClick={() => handleClickOpen(employeeToSee.dni)}
                    variant="contained"
                    sx={{ minWidth: 40, p: 1, ml: 1 }}
                    title="Editar imagen"
                  >
                    <EditIcon />
                  </Button>

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
                            className={styles.customFileInput}
                          />
                          {selectedFile && selectedFile.name ? (
                            <Fragment>
                              <LinearProgress variant="determinate" value={progress} sx={{ my: 2 }} />
                              <Button
                                variant="contained"
                                onClick={handleUpload}
                                disabled={!!documentacionURL}
                                sx={{
                                  px: '0.8rem',
                                  borderRadius: '5px',
                                  bgcolor: '#00a441',
                                  color: '#fff',
                                  '&:hover': { bgcolor: '#00a441b5' }
                                }}
                              >
                                Subir Archivo
                              </Button>
                            </Fragment>
                          ) : null}
                        </Fragment>
                        <DialogActions>
                          <Button
                            variant="outlined"
                            onClick={handleClose}
                          >
                            Cerrar
                          </Button>
                          <Button
                            type="button"
                            onClick={handleSubmit}
                            variant="contained"
                            sx={{
                              px: '0.8rem',
                              borderRadius: '5px',
                              bgcolor: 'rgb(7,138,7)',
                              color: '#fff',
                              '&:hover': { bgcolor: 'rgba(7,138,7,0.7)' }
                            }}
                          >
                            Guardar
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
                  <span className={styles.spanLabel}>{employeeToSee.seccion.label}</span>
                </div>
                <div className={styles.rowSidebar}>
                  <h4 className={styles.title}>Categoría</h4>
                  <span className={styles.spanLabel}>{employeeToSee.categoria.label}</span>
                </div>
              </div>
            </div>

            <div className={styles.tabsContainer}>
              <div className={styles.headerName}>
                <span className={styles.workerName}>{employeeToSee.nombre + " " + employeeToSee.apellido}</span>
              </div>
              <div>
                <AppBar position="static">
                  <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
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
                    <Table aria-label="caption table">
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
                    <Table aria-label="caption table">
                      <TableHead>
                        <TableRow>
                          <TableCell align="left">Tipo</TableCell>
                          <TableCell align="left">Año</TableCell>
                          <TableCell align="left">Enlace</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {employeeToSee.documentacion.map((row, idx) => (
                          <TableRow key={idx}>
                            <TableCell align="left">{row.tipo}</TableCell>
                            <TableCell align="left">
                              {row.tipo === "Ficha Trabajador"
                                ? row && getDateDDMMAAAA(getDateAAAAMMDDFromFicha(row))
                                : row.anio}
                            </TableCell>
                            <TableCell align="left">
                              <Button
                                variant="contained"
                                component="a"
                                href={row.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                  px: '0.6rem',
                                  borderRadius: '5px',
                                  bgcolor: 'rgb(86, 7, 138)',
                                  color: '#fff',
                                  '&:hover': { bgcolor: 'rgba(86,7,138,0.7)' }
                                }}
                              >
                                Ver Documento
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </TabPanel>
              </div>

              <Link href={"/generalWorkerList"} passHref>
                <Button
                  component="a"
                  variant="contained"
                  sx={{
                    mt: 2,
                    px: '0.8rem',
                    borderRadius: '5px',
                    bgcolor: 'rgb(7,138,7)',
                    color: '#fff',
                    '&:hover': { bgcolor: 'rgba(7,138,7,0.7)' }
                  }}
                >
                  Volver al Padrón
                </Button>
              </Link>
            </div>
          </Grid>
        </Layout2>
      </div>
      : null}
  </>);
}

export default SeeEmployee;