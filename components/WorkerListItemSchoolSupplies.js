import React, { useContext, useState, Fragment, useEffect } from 'react';

// Material UI
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import LinearProgress from '@mui/material/LinearProgress';

// Estilos locales
import styles from "./css/WorkerListItemSchoolSupplies.module.scss";

// Image Compression
import imageCompression from 'browser-image-compression';

// Redux
import {
  seeEmployeeAction,
  editEmployeeWithoutAlertAction,
  editEmployeeAction,
  editEmployeeAction2
} from "./redux/actions/EmployeeActions";
import { useDispatch } from "react-redux";

// Firebase
import { FirebaseContext } from "../firebase";

// Next
import Link from "next/link";

// Formik / Yup
import { Formik } from "formik";
import { object, string } from "yup";

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
const sxSuccess = { ...baseBtnSx, bgcolor: '#00a441',        color: '#fff', '&:hover': { bgcolor: '#00a441b5' } };
const sxSave    = { ...baseBtnSx, bgcolor: 'rgb(7,138,7)',    color: '#fff', '&:hover': { bgcolor: 'rgba(7,138,7,0.7)' } };
const sxBlue    = { ...baseBtnSx, bgcolor: '#3b5999',         color: '#fff', '&:hover': { bgcolor: '#3b5999b5' } };
const sxClose   = { ...baseBtnSx, bgcolor: 'rgb(138,7,7)',    color: '#fff', '&:hover': { bgcolor: 'rgba(138,7,7,0.7)' } };

const rowCheckedSx   = { backgroundColor: '#98b3e4b5' };
const rowNoCheckedSx = { backgroundColor: '#f2747480' };

const WorkerListItemSchoolSupplies = ({ employee }) => {
  const [open, setOpen] = useState(false);
  const [dni_familiar, setDNIFamiliar] = useState("");
  const [documentacionURL, setDocumentacionURL] = useState("");
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState("");

  const dispatch = useDispatch();
  const { firebase } = useContext(FirebaseContext);

  const getKitEscolares = (employee) => {
    const kitEscolares = [];
    employee?.familia?.forEach((familiar) => {
      familiar?.kit_escolar?.forEach((kit) => {
        if (kit.anio === new Date().getFullYear()) kitEscolares.push(kit.tipo);
      });
    });
    return kitEscolares;
  };

  const getSchoolClothes = (employee) => {
    const guardapolvos = [];
    employee?.familia?.forEach((familiar) => {
      familiar?.talle?.forEach((g) => {
        if (g.anio === new Date().getFullYear()) guardapolvos.push(g.numero);
      });
    });
    return guardapolvos;
  };

  const kits = getKitEscolares(employee);
  const schoolClothes = getSchoolClothes(employee);

  const handleClickOpen = (dni) => {
    setDocumentacionURL("");
    setProgress(0);
    setSelectedFile("");
    setOpen(dni);
    setDNIFamiliar(dni);
  };

  const handleClose = () => setOpen(false);

  const redirectToEdit = (emp) => dispatch(editEmployeeAction2(emp));
  const redirectToSee  = (emp) => dispatch(seeEmployeeAction(emp));

  useEffect(() => {
    // console.log("WorkerListItemSchoolSupplies mounted");
  }, []);

  const handleSubmit = () => {
    const currentYear = new Date().getFullYear();
    const tipoDoc = "Planilla Utiles";
    const newEmployee = { ...employee };
    newEmployee.documentacion = Array.isArray(newEmployee.documentacion) ? newEmployee.documentacion : [];
    newEmployee.documentacion.push({ tipo: tipoDoc, anio: currentYear, url: documentacionURL });
    dispatch(editEmployeeAction(newEmployee, firebase));
    dispatch(seeEmployeeAction(newEmployee));
    handleClose();
  };

  const handleUpload = () => {
    const uploadTask = firebase.storage.ref(`images/${selectedFile.name}`).put(selectedFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const thisprogress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgress(thisprogress);
      },
      (error) => console.log(error),
      () => {
        firebase.storage
          .ref("images")
          .child(selectedFile.name)
          .getDownloadURL()
          .then((url) => setDocumentacionURL(url));
      }
    );
  };

  const tienePlanillaCargada = (doc) =>
    Array.isArray(doc) && doc.find((item) => item.anio === new Date().getFullYear() && item.tipo === "Planilla Utiles");

  const handleChangeUploadImage = async (event) => {
    const imageFile = event.target.files?.[0];
    if (!imageFile) return;
    const options = { maxSizeMB: 0.5, maxWidthOrHeight: 1920, useWebWorker: true };
    try {
      const compressedFile = await imageCompression(imageFile, options);
      setSelectedFile(compressedFile);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeCheckBox = (e) => {
    const dniChecked = parseInt(e.target.id, 10);
    const newEmployee = { ...employee };
    newEmployee.entregado = (employee.dni === dniChecked) && { checked: e.target.checked, anio: new Date().getFullYear() };
    newEmployee.familia = (employee.familia || []).map((f) => ({
      ...f,
      entregado: { checked: e.target.checked, anio: new Date().getFullYear() },
    }));
    dispatch(editEmployeeWithoutAlertAction(newEmployee, firebase));
  };

  const rowSx = employee?.entregado?.checked ? rowCheckedSx : rowNoCheckedSx;

  return (
    <>
      <TableRow key={employee.dni} sx={rowSx}>
        <TableCell align="right">
          <Checkbox
            id={employee.dni}
            checked={employee.entregado ? employee.entregado.checked : false}
            onChange={handleChangeCheckBox}
            inputProps={{ 'aria-label': 'controlled' }}
          />
        </TableCell>
        <TableCell align="right">{employee.nroLegajo}</TableCell>
        <TableCell align="right">{employee.apellido}</TableCell>
        <TableCell align="right">{employee.nombre}</TableCell>
        <TableCell align="right">{employee.dni}</TableCell>
        <TableCell align="right">{employee.empresa.nombre}</TableCell>

        <TableCell align="right">
          {schoolClothes && schoolClothes.map((g, idx) => {
            if (idx === 0 && schoolClothes.length > 1) return <span key={idx}>{`${schoolClothes.length} (${g}`} </span>;
            if (idx === 0 && schoolClothes.length === 1) return <span key={idx}>{`${schoolClothes.length} (${g})`}</span>;
            if (idx === schoolClothes.length - 1) return <span key={idx}>{`${g})`}</span>;
            return <span key={idx}>{`${g} `}</span>;
          })}
        </TableCell>

        <TableCell align="right">
          {kits && kits.map((kit, idx) => {
            if (idx === 0 && kits.length > 1) return <span key={idx}>{`${kits.length} (${kit}`} </span>;
            if (idx === 0 && kits.length === 1) return <span key={idx}>{`${kits.length} (${kit})`}</span>;
            if (idx === kits.length - 1) return <span key={idx}>{`${kit})`}</span>;
            return <span key={idx}>{`${kit} `}</span>;
          })}
        </TableCell>

        <TableCell align="right">
          <Link href="/familyGroupList[id]" as={`/familyGroupList${employee.id}`}>
            <Button variant="contained" sx={sxPurple} onClick={() => redirectToSee(employee)}>
              Ver Hijos
            </Button>
          </Link>
        </TableCell>

        <TableCell align="right">
          <Link href="/employees/[id]" as={`/employees/${employee.id}`}>
            <Button variant="contained" sx={sxSuccess} onClick={() => redirectToEdit(employee)}>
              Agregar familiar
            </Button>
          </Link>
        </TableCell>

        <TableCell align="right">
          {employee.documentacion && tienePlanillaCargada(employee.documentacion) ? null : (
            <Fragment>
              <Button sx={sxBlue} onClick={() => handleClickOpen(employee.dni)}>
                Adjuntar Planilla
              </Button>

              <Dialog fullScreen open={open === employee.dni} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">
                  {employee.apellido}, {employee.nombre}
                </DialogTitle>
                <form>
                  <DialogContent>
                    <DialogContentText>Adjuntar planilla de útiles</DialogContentText>
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
                          <Button variant="contained" onClick={handleUpload} sx={sxSuccess} disabled={!!documentacionURL}>
                            Subir Archivo
                          </Button>
                        </Fragment>
                      ) : null}
                    </Fragment>
                    <DialogActions>
                      <Button variant="contained" sx={sxClose} onClick={handleClose} disabled={!!documentacionURL}>
                        Cerrar
                      </Button>
                      <Button type="button" onClick={handleSubmit} variant="contained" sx={sxSave}>
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

export default WorkerListItemSchoolSupplies;