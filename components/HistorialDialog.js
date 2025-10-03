// components/HistorialDialog.js
import React, { useState, Fragment } from 'react';

// Material UI
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

// Si más adelante reactivás esta columna, dejá el import.
// import SeeDocumentationList from "./SeeDocumentationList";

const btnBaseSx = {
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
  alignItems: 'center'
};

const HistorialDialog = ({ row }) => {
  const [openHistorial, setOpenHistorial] = useState("");

  const handleClickOpenHistorial = (dni) => {
    setOpenHistorial(dni);
  };

  const handleCloseHistorial = () => {
    setOpenHistorial("");
  };

  // const ArregloUtiles = (talle, kit_escolar, documentacion) => {
  const ArregloUtiles = (talle, kit_escolar) => {
    const currentYear = new Date().getFullYear();
    let yearsArray = [];
    for (let i = currentYear; i >= 2017; i--) {
      yearsArray.push(i);
    }
    let nuevoArray = [];
    yearsArray.forEach((itemAnio) => {
      const talleNumero = talle.map(item => (item.anio === itemAnio ? item.numero : undefined));
      const tipoKit = kit_escolar.map(item => (item.anio === itemAnio ? item.tipo : undefined));
      // const tipoDoc = documentacion.map(item => (item.anio === itemAnio ? item.url : undefined));
      nuevoArray.push({
        talleNumero: talleNumero.find(el => el !== undefined),
        tipoKit: tipoKit.find(el => el !== undefined),
        // tipoDoc: tipoDoc.find(el => el !== undefined),
        anio: itemAnio
      });
    });
    return nuevoArray;
  };

  return (
    <Fragment>
      {/* Antes había <Link><a/></Link>; ahora usamos directamente Button */}
      <Button
        variant="contained"
        onClick={() => handleClickOpenHistorial(row.dni_familia)}
        sx={{
          ...btnBaseSx,
          bgcolor: '#00a2ba',
          color: '#fff',
          '&:hover': { bgcolor: '#00a2bab5' }
        }}
      >
        Historial
      </Button>

      <Dialog
        fullScreen
        open={openHistorial === row.dni_familia && Boolean(row.dni_familia)}
        onClose={handleCloseHistorial}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          {row.apellido_familia}, {row.nombre_familia}
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            Información detallada
          </DialogContentText>

          <TableContainer component={Paper}>
            <Table aria-label="caption table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Talle</TableCell>
                  <TableCell align="left">Kit Escolar</TableCell>
                  {/* <TableCell align="left">Documentación</TableCell> */}
                  <TableCell align="left">Año</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* ArregloUtiles(row.talle, row.kit_escolar, row.documentacion).map(item => ( */}
                {ArregloUtiles(row.talle, row.kit_escolar).map(item => (
                  <TableRow key={item.anio} id={String(item.anio)}>
                    <TableCell align="left">{item && item.talleNumero}</TableCell>
                    <TableCell align="left">{item && item.tipoKit}</TableCell>
                    {/* <TableCell align="left">
                      {item.tipoDoc ? <SeeDocumentationList item={item} /> : null}
                    </TableCell> */}
                    <TableCell align="left">{item && item.anio}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <DialogActions sx={{ mt: 2 }}>
            <Button
              variant="contained"
              onClick={handleCloseHistorial}
              sx={{
                ...btnBaseSx,
                bgcolor: 'rgb(138,7,7)',
                color: '#fff',
                '&:hover': { bgcolor: 'rgba(138,7,7,0.7)' }
              }}
            >
              Cerrar
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

export default HistorialDialog;