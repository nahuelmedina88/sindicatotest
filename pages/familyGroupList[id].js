// pages/familyGroupList[id].js
import React, { useState, useContext, Fragment } from 'react';
import styles from "./css/familyGroupList[id].module.scss";

// MUI
import Select from '@mui/material/Select';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';

// Next
import Link from "next/link";

// Componentes
import HistorialDialog from "../components/HistorialDialog";
import SeeDocumentation from "../components/SeeDocumentation";
import Layout2 from '../components/layout/Layout2';

// Redux
import {
  editEmployeeWithoutAlertAction,
  editEmployeeAction,
  seeEmployeeAction
} from "../components/redux/actions/EmployeeActions";
import { useSelector, useDispatch } from "react-redux";

// Firebase
import { FirebaseContext } from "../firebase";

// --- estilos con sx (reemplazo de makeStyles) ---
const sxBtnBase = {
  px: 1,
  py: 0.5,
  borderRadius: '5px',
  textDecoration: 'none',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: '#fff',
  fontSize: '1rem',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center'
};

const sxStyles = {
  formControl: { m: 1, minWidth: 120 },
  table: { minWidth: 650 },
  bgColorChecked: { backgroundColor: '#98b3e4b5' },
  bgColorNoChecked: { backgroundColor: '#f2747480' },
  buttonPrimary: {
    ...sxBtnBase,
    bgcolor: '#0084ff',
    color: '#fff',
    '&:hover': { bgcolor: '#0084ffb5' }
  },
  buttonInfo: {
    ...sxBtnBase,
    bgcolor: '#00a2ba',
    color: '#fff',
    '&:hover': { bgcolor: '#00a2bab5' }
  },
  buttonSuccess: {
    ...sxBtnBase,
    bgcolor: '#00a441',
    color: '#fff',
    '&:hover': { bgcolor: '#00a441b5' }
  },
  buttonClose: {
    ...sxBtnBase,
    bgcolor: 'rgb(138,7,7)',
    color: '#fff',
    '&:hover': { bgcolor: 'rgba(138,7,7,0.7)' }
  },
  buttonSave: {
    ...sxBtnBase,
    bgcolor: 'rgb(7,138,7)',
    color: '#fff',
    '&:hover': { bgcolor: 'rgba(7,138,7,0.7)' }
  },
  buttonPurple: {
    ...sxBtnBase,
    bgcolor: 'rgb(86, 7, 138)',
    color: '#fff',
    '&:hover': { bgcolor: 'rgba(86, 7, 138, 0.7)' }
  }
};

const familyGroupList = () => {
  const [talle, setTalle] = useState("");
  const [talle_anio, setTalleAnio] = useState(new Date().getFullYear());
  const [kit_escolar, setKitEscolar] = useState("");
  const [kit_escolar_anio, setKitEscolarAnio] = useState(new Date().getFullYear());
  const [selectedFile, setSelectedFile] = useState(null);
  const [dni_familiar, setDNIFamiliar] = useState("");

  const employeeToSee = useSelector(state => state.employees.employeeToSee);
  const [open, setOpen] = useState("");

  // Firebase
  const { firebase } = useContext(FirebaseContext);
  const dispatch = useDispatch();

  const schoolSuppliesSelect = [
    { id: "1", value: "PrimarioUno", label: "Primario 1ro 3ro", name: "kit_escolar" },
    { id: "2", value: "PrimarioDos", label: "Primario 4to 6to", name: "kit_escolar" },
    { id: "3", value: "secundario", label: "Secundario", name: "kit_escolar" },
    { id: "4", value: "especial", label: "Especial", name: "kit_escolar" }
  ];

  const handleClickOpen = (dni) => {
    setOpen(dni);
    setDNIFamiliar(dni);
  };

  const handleClose = () => setOpen("");

  const isAllChecked = (employee) => {
    const arr = employee.familia.map(fam => !!(fam.entregado && fam.entregado.checked));
    return !arr.includes(false);
  };

  const getDateDDMMAAAA = (mydate) => {
    const date = new Date(mydate);
    const day = date.getDate() + 1; // mantengo tu +1 (por si está por zona horaria)
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}-${month < 10 ? `0${month}` : month}-${year}`;
    // si no necesitás el +1, podés quitarlo.
  };

  const handleChangeCheckBox = (e) => {
    const dniChecked = parseInt(e.target.id, 10);

    // clonar familia inmutablemente
    const newFamiliares = employeeToSee.familia.map((familiar) =>
        familiar.dni_familia === dniChecked
        ? {
            ...familiar,
            entregado: { checked: e.target.checked, anio: new Date().getFullYear() },
            }
        : familiar
    );

    const newEmployee = {
        ...employeeToSee,
        familia: newFamiliares,
    };

    // recalcular flag "entregado" general sin mutar
    const allChecked = newEmployee.familia.every(
        (f) => f.entregado && f.entregado.checked
    );
    newEmployee.entregado = { checked: allChecked, anio: new Date().getFullYear() };

    dispatch(editEmployeeWithoutAlertAction(newEmployee, firebase));
    dispatch(seeEmployeeAction(newEmployee));
};


const handleSubmit = () => {
  const targetDni = dni_familiar;

  const newFamilia = employeeToSee.familia.map((fam) => {
    if (fam.dni_familia !== targetDni) return fam;

    // Copias superficiales + arrays copiados
    let newFam = {
      ...fam,
      talle: Array.isArray(fam.talle) ? [...fam.talle] : [],
      kit_escolar: Array.isArray(fam.kit_escolar) ? [...fam.kit_escolar] : [],
    };

    // Actualizar/insertar talle del año seleccionado
    if (talle) {
      const idx = newFam.talle.findIndex((t) => t.anio === talle_anio);
      if (idx >= 0) {
        newFam = {
          ...newFam,
          talle: newFam.talle.map((t, i) =>
            i === idx ? { ...t, numero: talle } : t
          ),
        };
      } else {
        newFam = {
          ...newFam,
          talle: [...newFam.talle, { numero: talle, anio: talle_anio }],
        };
      }
    }

    // Actualizar/insertar kit del año seleccionado
    if (kit_escolar) {
      const idx2 = newFam.kit_escolar.findIndex((k) => k.anio === kit_escolar_anio);
      if (idx2 >= 0) {
        newFam = {
          ...newFam,
          kit_escolar: newFam.kit_escolar.map((k, i) =>
            i === idx2 ? { ...k, tipo: kit_escolar } : k
          ),
        };
      } else {
        newFam = {
          ...newFam,
          kit_escolar: [...newFam.kit_escolar, { tipo: kit_escolar, anio: kit_escolar_anio }],
        };
      }
    }

    return newFam;
  });

  const newEmployee = {
    ...employeeToSee,
    familia: newFamilia,
  };

  dispatch(editEmployeeAction(newEmployee, firebase));
  dispatch(seeEmployeeAction(newEmployee));
  handleClose();
};

  return (
    <>
      <Layout2>
        {employeeToSee ? (
          <Fragment>
            <TableContainer component={Paper}>
              <Table sx={sxStyles.table} aria-label="caption table">
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
                  </TableRow>
                </TableHead>
                <TableBody>
                  {employeeToSee.familia.map((row) => {
                    const isChecked = row.entregado && row.entregado.checked;
                    const lastTalle = row.talle?.[row.talle.length - 1];
                    const showTalle = lastTalle && lastTalle.anio === new Date().getFullYear()
                      ? lastTalle.numero
                      : null;
                    const lastKit = row.kit_escolar?.[row.kit_escolar.length - 1];
                    const showKit = lastKit && lastKit.anio === new Date().getFullYear()
                      ? lastKit.tipo
                      : null;

                    return (
                      <TableRow
                        key={row.dni_familia}
                        sx={isChecked ? sxStyles.bgColorChecked : sxStyles.bgColorNoChecked}
                      >
                        <TableCell>
                          <Checkbox
                            id={String(row.dni_familia)}
                            checked={!!(row.entregado && row.entregado.checked)}
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
                        <TableCell align="right">{showTalle}</TableCell>
                        <TableCell align="right">{showKit}</TableCell>

                        <TableCell>
                          <Fragment>
                            <Button
                              variant="contained"
                              onClick={() => handleClickOpen(row.dni_familia)}
                              sx={sxStyles.buttonSuccess}
                            >
                              Agregar Útiles
                            </Button>

                            <Dialog
                              open={open === row.dni_familia && !!row.dni_familia}
                              onClose={handleClose}
                              aria-labelledby="form-dialog-title"
                            >
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
                                  />

                                  <FormControl sx={sxStyles.formControl} fullWidth>
                                    <InputLabel id="kit-escolar-label">Kit Escolar</InputLabel>
                                    <Select
                                      labelId="kit-escolar-label"
                                      id="kit-escolar"
                                      name="kit_escolar"
                                      label="Kit Escolar"
                                      onChange={(e) => setKitEscolar(e.target.value)}
                                      value={kit_escolar}
                                    >
                                      {schoolSuppliesSelect.map(obj => (
                                        <MenuItem key={obj.id} value={obj.label}>
                                          {obj.label}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>

                                  <DialogActions>
                                    <Button
                                      variant="contained"
                                      onClick={handleClose}
                                      sx={sxStyles.buttonClose}
                                    >
                                      Cerrar
                                    </Button>
                                    <Button
                                      type="button"
                                      onClick={handleSubmit}
                                      variant="contained"
                                      sx={sxStyles.buttonSave}
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
                          <HistorialDialog row={row} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              {/* Navegación: usar Button con LinkComponent para evitar <a> dentro de <Link> */}
              <Button
                LinkComponent={Link}
                href="/schoolSuppliesWorkerList"
                sx={sxStyles.buttonPurple}
              >
                Ir a la Lista
              </Button>
            </TableContainer>
          </Fragment>
        ) : null}
      </Layout2>
    </>
  );
};

export default familyGroupList;
