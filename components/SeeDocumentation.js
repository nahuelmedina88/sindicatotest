// components/SeeDocumentation.js
import React, { useState, Fragment } from 'react';

// Material UI
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

// Next
import Image from 'next/image';

const baseBtnSx = {
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

const SeeDocumentation = ({ row }) => {
  const [openImage, setOpenImage] = useState("");

  const handleClickOpenImage = (dni) => setOpenImage(dni);
  const handleCloseImage = () => setOpenImage("");

  // Ultimo documento (si existe)
  const lastDoc = row?.documentacion?.length
    ? row.documentacion[row.documentacion.length - 1]
    : null;

  const hasDocForThisYear =
    Boolean(lastDoc) && lastDoc.anio === new Date().getFullYear();

  return (
    <>
      {hasDocForThisYear ? (
        <Fragment>
          <Button
            variant="contained"
            onClick={() => handleClickOpenImage(row.dni_familia)}
            sx={{
              ...baseBtnSx,
              bgcolor: 'rgb(86, 7, 138)',
              color: '#fff',
              '&:hover': { bgcolor: 'rgba(86, 7, 138, 0.7)' }
            }}
          >
            Ver Documentación
          </Button>

          <Dialog
            fullWidth
            open={openImage === row.dni_familia && Boolean(row.dni_familia)}
            onClose={handleCloseImage}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">
              {/* Podés mostrar algún título si lo tenés */}
            </DialogTitle>
            <DialogContent>
              <DialogContentText />
              {lastDoc?.url ? (
                <Image
                  src={lastDoc.url}
                  alt="Constancia Alumno Regular"
                  width={640}
                  height={480}
                />
              ) : null}

              <DialogActions>
                <Button
                  variant="contained"
                  onClick={handleCloseImage}
                  sx={{
                    ...baseBtnSx,
                    bgcolor: 'rgb(138, 7, 7)',
                    color: '#fff',
                    '&:hover': { bgcolor: 'rgba(138, 7, 7, 0.7)' }
                  }}
                >
                  Cerrar
                </Button>
              </DialogActions>
            </DialogContent>
          </Dialog>
        </Fragment>
      ) : (
        <span>No hay documentación</span>
      )}
    </>
  );
};

export default SeeDocumentation;