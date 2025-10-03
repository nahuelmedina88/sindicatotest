import React, { useContext, useState, Fragment } from 'react';

import styles from "./css/Company.module.scss";

// Material UI
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { CircularProgress } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';

// Redux
import { editCompanyAction, seeCompanyAction, editCompanyAction2 } from "./redux/actions/CompanyActions";
import { useDispatch } from "react-redux";

// Firebase context (ruta nueva)
import FirebaseContext from "../firebase/context";

// Next
import Link from "next/link";

// Formik / Yup
import { Formik } from "formik";
import { object, string } from "yup";

// Image Compression
import imageCompression from 'browser-image-compression';

// Firebase Storage (SDK modular)
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

// Data
import documentationTypeData from "../components/data/documentationType.json";

// ---- estilos con sx (reemplazan makeStyles) ----
const baseBtnSx = {
  p: '0.4rem',
  borderRadius: '5px',
  textDecoration: 'none',
  borderWidth: '1px',
  borderColor: '#fff',
  fontSize: '1rem',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
};

const sxPurple = {
  ...baseBtnSx,
  bgcolor: 'rgb(86, 7, 138)',
  color: '#fff',
  '&:hover': { bgcolor: 'rgba(86, 7, 138, 0.7)' }
};

const sxClose = {
  ...baseBtnSx,
  bgcolor: 'rgb(138,7,7)',
  color: '#fff',
  '&:hover': { bgcolor: 'rgba(138,7,7,0.7)' }
};

const sxSave = {
  ...baseBtnSx,
  bgcolor: 'rgb(7,138,7)',
  color: '#fff',
  '&:hover': { bgcolor: 'rgba(7,138,7,0.7)' }
};

const sxBlue = {
  ...baseBtnSx,
  bgcolor: '#3b5999',
  color: '#fff',
  '&:hover': { bgcolor: '#3b5999b5' }
};

const sxInfo = {
  ...baseBtnSx,
  bgcolor: '#00a2ba',
  color: '#fff',
  '&:hover': { bgcolor: '#00a2bab5' }
};

const Company = ({ company }) => {
  const [open, setOpen] = useState(false);
  const [openFicha, setOpenFicha] = useState(false);
  const [selectedFile, setSelectedFile] = useState("");
  const [documentacionURL, setDocumentacionURL] = useState("");
  const [progress, setProgress] = useState(0);

  const [documentationType, setDocumentationType] = useState("");
  const [documentationDate, setDocumentationDate] = useState("");

  const dispatch = useDispatch();

  // Traemos storage/auth/db del provider (adaptador modular que hicimos)
  const firebase = useContext(FirebaseContext);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const redirectToEdit = (c) => dispatch(editCompanyAction2(c));
  const redirectToSee = (c) => dispatch(seeCompanyAction(c));

  const handleClickOpenFicha = (cuit) => {
    setDocumentacionURL("");
    setProgress(0);
    setSelectedFile("");
    setOpenFicha(cuit);
    setDocumentationType("");
    setDocumentationDate("");
  };
  const handleCloseFicha = () => setOpenFicha(false);

  const handleChangeUploadImage = async (event) => {
    const imageFile = event.target.files[0];
    const options = { maxSizeMB: 0.4, maxWidthOrHeight: 1920, useWebWorker: true };
    try {
      const compressedFile = await imageCompression(imageFile, options);
      setSelectedFile(compressedFile);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmitFicha = () => {
    const newCompany = { ...company };
    newCompany.documentacion.push({ tipo: documentationType, fecha: documentationDate, url: documentacionURL });
    dispatch(editCompanyAction(newCompany, firebase));
    dispatch(seeCompanyAction(newCompany));
    handleCloseFicha();
  };

  // ---- SUBIDA A STORAGE con SDK modular ----
  const handleUpload = () => {
    const path = `documentacion/${documentationType}_${documentationDate}_${company.cuit}`;
    const refObj = storageRef(firebase.storage, path);
    const uploadTask = uploadBytesResumable(refObj, selectedFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const thisprogress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgress(thisprogress);
      },
      (error) => console.log(error),
      async () => {
        const url = await getDownloadURL(refObj);
        setDocumentacionURL(url);
      }
    );
  };

  return (
    <>
      <TableRow key={company.dni}>
        <TableCell align="right">{company.nombre}</TableCell>
        <TableCell align="right">{company.ciudad}</TableCell>
        <TableCell align="right">
          {company.domicilio ? company.domicilio : `${company.calle} ${company.numero_calle}`}
        </TableCell>
        <TableCell align="right">{company.cuit}</TableCell>
        <TableCell align="right">{company.razonSocial}</TableCell>

        <TableCell align="right">
          <Link href="/companies/SeeCompany[id]" as={`/companies/SeeCompany${company.id}`}>
            <Button sx={sxInfo} onClick={() => redirectToSee(company)}>Ver</Button>
          </Link>
        </TableCell>

        <TableCell align="right">
          <Link href="/companies/[id]" as={`/companies/${company.id}`}>
            <Button variant="contained" sx={sxPurple} onClick={() => redirectToEdit(company)}>
              Editar
            </Button>
          </Link>
        </TableCell>

        <TableCell align="right">
          <Fragment>
            <Button sx={sxBlue} onClick={() => handleClickOpenFicha(company.cuit)}>
              Agregar Documento
            </Button>

            <Dialog
              fullScreen
              open={openFicha === company.cuit}
              onClose={handleCloseFicha}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">{company.nombre}</DialogTitle>
              <form>
                <DialogContent>
                  <DialogContentText>Agregar Documento a la Carpeta</DialogContentText>

                  <FormControl sx={{ m: 1, minWidth: '100%' }}>
                    <InputLabel id="doc-type-label">Tipo de Documentación</InputLabel>
                    <Select
                      labelId="doc-type-label"
                      id="doc-type"
                      name="documentacion"
                      label="Tipo de Documentación"
                      onChange={(e) => setDocumentationType(e.target.value)}
                      value={documentationType}
                    >
                      {documentationTypeData.map((obj) => (
                        <MenuItem key={obj.label} value={obj.label}>{obj.label}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl sx={{ m: 1, minWidth: '100%' }}>
                    <TextField
                      id="date"
                      label="Fecha Documentación"
                      type="date"
                      name="fecha_documentacion"
                      value={documentationDate}
                      onChange={(e) => setDocumentationDate(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </FormControl>

                  {documentationDate && documentationType ? (
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
                            sx={baseBtnSx}
                            disabled={!!documentacionURL}
                          >
                            Subir Archivo
                          </Button>
                        </Fragment>
                      ) : null}
                    </Fragment>
                  ) : null}

                  <DialogActions>
                    <Button
                      variant="contained"
                      sx={sxClose}
                      onClick={handleCloseFicha}
                      disabled={!!documentacionURL && !!documentationType && !!documentationDate}
                    >
                      Cerrar
                    </Button>
                    <Button
                      type="button"
                      onClick={handleSubmitFicha}
                      disabled={!(documentacionURL && documentationType && documentationDate)}
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
        </TableCell>

        <TableCell align="right">
          <Fragment>
            <Button sx={sxClose} onClick={handleClickOpen}>
              Eliminar
            </Button>

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
                  validationSchema={object({
                    fecha_baja: string().required("La fecha es requerida"),
                  })}
                >
                  {({ values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                      <DialogContentText>Ingrese la fecha de baja</DialogContentText>
                      <TextField
                        autoFocus
                        margin="dense"
                        type="date"
                        name="fecha_baja"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        fullWidth
                      />
                      {touched.fecha_baja && errors.fecha_baja && (
                        <span className="errorMessage">{errors.fecha_baja}</span>
                      )}
                      <DialogActions>
                        <Button onClick={handleClose} color="primary">
                          Cancelar
                        </Button>
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          variant="contained"
                          color="primary"
                          startIcon={isSubmitting ? <CircularProgress size="0.9rem" /> : undefined}
                        >
                          {isSubmitting ? "Dando de baja" : "Dar de baja"}
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
    </>
  );
};

export default Company;