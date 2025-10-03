import React, { useContext, useState, Fragment } from 'react';

// MUI
import LinearProgress from '@mui/material/LinearProgress';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

// Estilos locales
import styles from "./css/EmployeeListItem.module.scss";

// Helpers
import { numberWithPoint } from "../components/helpers/formHelper";

// Image Compression
import imageCompression from 'browser-image-compression';

// Redux
import {
  seeEmployeeAction,
  editEmployeeAction,
  editEmployeeAction2,
  deleteEmployeeActionNoImpactDatabase
} from "./redux/actions/EmployeeActions";
import { useDispatch } from "react-redux";

// Firebase
import FirebaseContext from "../firebase/context";

// Next
import Link from "next/link";

// --- estilos con sx (reemplazo de makeStyles) ---
const baseBtnSx = {
  p: '0.4rem',
  borderRadius: '5px',
  textDecoration: 'none',
  borderWidth: '1px',
  borderColor: '#fff',
  fontSize: '1rem',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
};

const sxPurple  = { ...baseBtnSx, bgcolor: 'rgb(86, 7, 138)', color: '#fff', '&:hover': { bgcolor: 'rgba(86, 7, 138, 0.7)' } };
const sxClose   = { ...baseBtnSx, bgcolor: 'rgb(138, 7, 7)',  color: '#fff', '&:hover': { bgcolor: 'rgba(138, 7, 7, 0.7)' } };
const sxYellow  = { ...baseBtnSx, bgcolor: '#879442',         color: '#fff', '&:hover': { bgcolor: '#879442b5' } };
const sxSave    = { ...baseBtnSx, bgcolor: 'rgb(7, 138, 7)',  color: '#fff', '&:hover': { bgcolor: 'rgba(7, 138, 7, 0.7)' } };
const sxBlue    = { ...baseBtnSx, bgcolor: '#3b5999',         color: '#fff', '&:hover': { bgcolor: '#3b5999b5' } };
const sxSuccess = { ...baseBtnSx, bgcolor: '#00a441',         color: '#fff', '&:hover': { bgcolor: '#00a441b5' } };

const FoundationWorkerListItem = ({ employee }) => {
  const [open, setOpen] = useState(false);
  const [openFicha, setOpenFicha] = useState(false);

  const [dni_familiar, setDNIFamiliar] = useState(""); // mantiene tu lógica original
  const [selectedFile, setSelectedFile] = useState("");
  const [documentacionURL, setDocumentacionURL] = useState("");
  const [progress, setProgress] = useState(0);

  const dispatch = useDispatch();
  const { firebase } = useContext(FirebaseContext);

  const handleClickOpen = (dni) => setOpen(dni);
  const handleClose = () => setOpen(false);

  const handleClickOpenFicha = (dni) => {
    setDocumentacionURL("");
    setProgress(0);
    setSelectedFile("");
    setOpenFicha(dni);
    setDNIFamiliar(dni);
  };
  const handleCloseFicha = () => setOpenFicha(false);

  const redirectToEdit = (emp) => dispatch(editEmployeeAction2(emp));
  const redirectToSee  = (emp) => dispatch(seeEmployeeAction(emp));

  const handleSubmitFicha = () => {
    const currentYear = new Date().getFullYear();
    const tipoDoc = "Ficha Trabajador";
    const newEmployee = { ...employee };
    newEmployee.documentacion.push({ tipo: tipoDoc, anio: currentYear, url: documentacionURL });
    dispatch(editEmployeeAction(newEmployee, firebase));
    dispatch(seeEmployeeAction(newEmployee));
    handleCloseFicha();
  };

  const handleSubmitEditFicha = () => {
    const currentYear = new Date().getFullYear();
    const tipoDoc = "Ficha Trabajador";
    const newEmployee = { ...employee };
    const docs = newEmployee.documentacion.filter(
      (doc) => !(doc.url.indexOf(newEmployee.fecha_ingreso) !== -1 && doc.tipo === "Ficha Trabajador")
    );
    newEmployee.documentacion = docs;
    newEmployee.documentacion.push({ tipo: tipoDoc, anio: currentYear, url: documentacionURL });
    dispatch(editEmployeeAction(newEmployee, firebase));
    dispatch(seeEmployeeAction(newEmployee));
    handleCloseFicha();
  };

  const handleUpload = () => {
    const uploadTask = firebase.storage
      .ref(`ficha_trabajador/ficha_afiliado_${employee.fecha_ingreso}_${employee.dni}`)
      .put(selectedFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const thisprogress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgress(thisprogress);
      },
      (error) => console.log(error),
      () => {
        firebase.storage
          .ref("ficha_trabajador")
          .child(`ficha_afiliado_${employee.fecha_ingreso}_${employee.dni}`)
          .getDownloadURL()
          .then((url) => setDocumentacionURL(url));
      }
    );
  };

  const handleChangeUploadImage = async (event) => {
    const imageFile = event.target.files[0];
    const options = { maxSizeMB: 0.15, maxWidthOrHeight: 1920, useWebWorker: true };
    try {
      const compressedFile = await imageCompression(imageFile, options);
      setSelectedFile(compressedFile);
    } catch (error) {
      console.log(error);
    }
  };

  const tieneFichaCargada = (emp) => {
    let position = -1;
    emp.documentacion.forEach((doc) => {
      position = doc.url.indexOf(emp.fecha_ingreso);
    });
    return position !== -1;
  };

  return (
    <>
      <TableRow key={employee.dni}>
        <TableCell align="right">{employee.nroLegajo}</TableCell>
        <TableCell align="right">{employee.apellido}</TableCell>
        <TableCell align="right">{employee.nombre}</TableCell>
        <TableCell align="right">{numberWithPoint(employee.dni)}</TableCell>
        <TableCell align="right">{employee.empresa.nombre}</TableCell>

        {/* Ver Ficha */}
        <TableCell align="right">
          <Link href="/employees/employee[id]" as={`/employees/employee${employee.id}`}>
            <Button sx={sxPurple} onClick={() => redirectToSee(employee)}>
              Ver Ficha
            </Button>
          </Link>
        </TableCell>

        {/* Editar */}
        <TableCell align="right">
          <Link href="/employees/[id]" as={`/employees/${employee.id}`}>
            <Button sx={sxBlue} onClick={() => redirectToEdit(employee)}>
              Editar
            </Button>
          </Link>
        </TableCell>

        {/* Ficha (adjuntar/editar) */}
        <TableCell align="right">
          {employee.documentacion && tieneFichaCargada(employee) ? (
            <Fragment>
              <Button sx={sxYellow} onClick={() => handleClickOpenFicha(employee.dni)}>
                Editar Ficha
              </Button>
              <Dialog
                fullScreen
                open={openFicha === employee.dni}
                onClose={handleCloseFicha}
                aria-labelledby="form-dialog-title"
              >
                <DialogTitle id="form-dialog-title">
                  {employee.apellido}, {employee.nombre}
                </DialogTitle>
                <form>
                  <DialogContent>
                    <DialogContentText>Adjuntar Ficha de trabajador</DialogContentText>
                    <Fragment>
                      <input
                        type="file"
                        name="selectedFile"
                        onChange={handleChangeUploadImage}
                        className={styles.customFileInput}
                      />
                      {selectedFile?.name ? (
                        <Fragment>
                          <LinearProgress variant="determinate" value={progress} />
                          <Button
                            variant="contained"
                            onClick={handleUpload}
                            sx={sxSuccess}
                            disabled={!!documentacionURL}
                          >
                            Subir Archivo
                          </Button>
                        </Fragment>
                      ) : null}
                    </Fragment>
                    <DialogActions>
                      <Button variant="contained" sx={sxClose} onClick={handleCloseFicha} disabled={!!documentacionURL}>
                        Cerrar
                      </Button>
                      <Button
                        type="button"
                        onClick={handleSubmitEditFicha}
                        disabled={!documentacionURL}
                        variant="contained"
                        sx={sxSave}
                      >
                        Guardar
                      </Button>
                    </DialogActions>
                  </DialogContent>
                </form>
              </Dialog>
            </Fragment>
          ) : (
            <Fragment>
              <Button sx={sxBlue} onClick={() => handleClickOpenFicha(employee.dni)}>
                Adjuntar Ficha
              </Button>
              <Dialog
                fullScreen
                open={openFicha === employee.dni}
                onClose={handleCloseFicha}
                aria-labelledby="form-dialog-title"
              >
                <DialogTitle id="form-dialog-title">
                  {employee.apellido}, {employee.nombre}
                </DialogTitle>
                <form>
                  <DialogContent>
                    <DialogContentText>Adjuntar Ficha de trabajador</DialogContentText>
                    <Fragment>
                      <input
                        type="file"
                        name="selectedFile"
                        onChange={handleChangeUploadImage}
                        className={styles.customFileInput}
                      />
                      {selectedFile?.name ? (
                        <Fragment>
                          <LinearProgress variant="determinate" value={progress} />
                          <Button
                            variant="contained"
                            onClick={handleUpload}
                            sx={sxSuccess}
                            disabled={!!documentacionURL}
                          >
                            Subir Archivo
                          </Button>
                        </Fragment>
                      ) : null}
                    </Fragment>
                    <DialogActions>
                      <Button variant="contained" sx={sxClose} onClick={handleCloseFicha} disabled={!!documentacionURL}>
                        Cerrar
                      </Button>
                      <Button
                        type="button"
                        onClick={handleSubmitFicha}
                        disabled={!documentacionURL}
                        variant="contained"
                        sx={sxSave}
                      >
                        Guardar
                      </Button>
                    </DialogActions>
                  </DialogContent>
                </form>
              </Dialog>
            </Fragment>
          )}
        </TableCell>
      </TableRow>
    </>
  );
};

export default FoundationWorkerListItem;