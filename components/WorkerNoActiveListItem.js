import React, { useContext, useState, Fragment } from 'react';

// MUI
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

// Helpers
import { numberWithPoint } from "../components/helpers/formHelper";

// Redux
import {
  seeEmployeeAction,
  editEmployeeAction,
  editEmployeeAction2,
  deleteEmployeeActionNoImpactDatabase
} from "./redux/actions/EmployeeActions";
import { useDispatch } from "react-redux";

// Firebase (mismo import que venimos usando)
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

const sxPurple = {
  ...baseBtnSx,
  bgcolor: 'rgb(86, 7, 138)',
  color: '#fff',
  '&:hover': { bgcolor: 'rgba(86, 7, 138, 0.7)' },
};

const sxSave = {
  ...baseBtnSx,
  bgcolor: 'rgb(7,138,7)',
  color: '#fff',
  '&:hover': { bgcolor: 'rgba(7,138,7,0.7)' },
};

const WorkerNoActiveListItem = ({ employee }) => {
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();
  const { firebase } = useContext(FirebaseContext);

  const handleClickOpen = (dni) => setOpen(dni);
  const handleClose = () => setOpen(false);

  const redirectToSee = (emp) => dispatch(seeEmployeeAction(emp));

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
            <Button variant="contained" sx={sxPurple} onClick={() => redirectToSee(employee)}>
              Ver Ficha
            </Button>
          </Link>
        </TableCell>

        {/* Dar de alta */}
        <TableCell align="right">
          <Fragment>
            <Button variant="contained" sx={sxSave} onClick={() => handleClickOpen(employee.id)}>
              Dar de Alta
            </Button>

            <Dialog open={open === employee.id} onClose={handleClose} aria-labelledby="alta-trabajador">
              <DialogTitle id="alta-trabajador">
                Alta del Trabajador {employee.nombre} {employee.apellido}
              </DialogTitle>
              <DialogContent>
                {/* Formik inline para mantener tu lógica actual */}
                {/* Si ya tenés un wrapper de Formik en el padre, podés mover esto allí */}
                {/* Mantengo tu validación y tiempos */}
                {(
                  // mini-Formik sin hooks externos
                  (() => {
                    const { useState } = React;
                    const [values, setValues] = useState({ ...employee, fecha_alta: '' });
                    const [submitting, setSubmitting] = useState(false);
                    const [error, setError] = useState('');

                    const onChange = (e) => setValues(v => ({ ...v, [e.target.name]: e.target.value }));

                    const onSubmit = async (e) => {
                      e.preventDefault();
                      if (!values.fecha_alta) {
                        setError('La fecha es requerida');
                        return;
                      }
                      setError('');
                      setSubmitting(true);
                      setTimeout(async () => {
                        const updated = { ...values, estado: "Activo", fecha_ingreso: values.fecha_alta };
                        dispatch(editEmployeeAction(updated, firebase));
                        // En tu código original no pasabas firebase aquí; mantengo eso:
                        dispatch(deleteEmployeeActionNoImpactDatabase(updated.id));
                        setSubmitting(false);
                        setOpen(false);
                      }, 2000);
                    };

                    return (
                      <form onSubmit={onSubmit}>
                        <DialogContentText>Ingrese la fecha de alta</DialogContentText>
                        <TextField
                          autoFocus
                          margin="dense"
                          type="date"
                          name="fecha_alta"
                          onChange={onChange}
                          fullWidth
                        />
                        {error && <span className="errorMessage">{error}</span>}
                        <DialogActions>
                          <Button onClick={handleClose}>Cancelar</Button>
                          <Button
                            type="submit"
                            disabled={submitting}
                            variant="contained"
                            color="primary"
                            startIcon={submitting ? <CircularProgress size="0.9rem" /> : undefined}
                          >
                            {submitting ? "Dando de alta" : "Dar de alta"}
                          </Button>
                        </DialogActions>
                      </form>
                    );
                  })()
                )}
              </DialogContent>
            </Dialog>
          </Fragment>
        </TableCell>
      </TableRow>
    </>
  );
};

export default WorkerNoActiveListItem;