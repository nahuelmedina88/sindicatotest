import React, { useState, Fragment } from 'react';

//Next
import Link from "next/link";

//Material UI
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

import SeeDocumentationList from "./SeeDocumentationList";

const useStyles = makeStyles({
    btn: {
        padding: "0.4rem",
        borderRadius: "5px",
        textDecoration: "none",
        borderWidth: "1px",
        borderColor: "#fff",
        fontSize: "1rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    buttonInfo: {
        backgroundColor: "#00a2ba",
        color: "#fff",
        "&:hover": {
            backgroundColor: "#00a2bab5",
        }
    },
    buttonClose: {
        backgroundColor: "rgb(138,7,7)",
        color: "#fff",
        "&:hover": {
            backgroundColor: "rgb(138,7,7, 0.7)",
        }
    },
});

const HistorialDialog = ({ row }) => {
    const classes = useStyles();
    const [openHistorial, setOpenHistorial] = useState("");
    const handleClickOpenHistorial = (dni) => {
        setOpenHistorial(dni);
    };

    const handleCloseHistorial = () => {
        setOpenHistorial("");
    };

    const ArregloUtiles = (talle, kit_escolar, documentacion) => {
        const currentYear = new Date().getFullYear();
        let yearsArray = [];
        for (let i = currentYear; i >= 2017; i--) {
            yearsArray.push(i);
        }
        let nuevoArray = [];
        yearsArray.map((itemAnio, idx) => {
            let talleNumero = talle.map(item => {
                if (item.anio === itemAnio) {
                    return item.numero;
                }
            });
            let tipoKit = kit_escolar.map(item => {
                if (item.anio === itemAnio) {
                    return item.tipo;
                }
            });
            let tipoDoc = documentacion.map(item => {
                if (item.anio === itemAnio) {
                    return item.url;
                }
            });
            nuevoArray.push({
                talleNumero: talleNumero.find(element => element !== undefined),
                tipoKit: tipoKit.find(element => element !== undefined),
                tipoDoc: tipoDoc.find(element => element !== undefined),
                anio: itemAnio
            });
        });
        return nuevoArray;
    }

    return (
        <Fragment>
            <Link href="#">
                <a className={`${classes.btn} ${classes.buttonInfo}`}
                    onClick={() => handleClickOpenHistorial(row.dni_familia)}
                >Historial</a>
            </Link>
            <Dialog fullScreen open={openHistorial === row.dni_familia && true}
                onClose={handleCloseHistorial}
                aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">
                    {row.apellido_familia}, {row.nombre_familia}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Información detallada
                                                    </DialogContentText>
                    <TableContainer component={Paper}>
                        <Table aria-label="caption table">
                            {/* <caption>A basic table example with a caption</caption> */}
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left">Talle</TableCell>
                                    <TableCell align="left">Kit Escolar</TableCell>
                                    <TableCell align="left">Documentación</TableCell>
                                    <TableCell align="left">Año</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {ArregloUtiles(row.talle, row.kit_escolar, row.documentacion).map(item => (
                                    <TableRow key={item.anio} id={item.anio}>
                                        <TableCell align="left">{item && item.talleNumero}</TableCell>
                                        <TableCell align="left">{item && item.tipoKit}</TableCell>
                                        <TableCell align="left">
                                            {item.tipoDoc ?
                                                <SeeDocumentationList item={item} />
                                                : null
                                            }
                                        </TableCell>
                                        <TableCell align="left">{item && item.anio}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <DialogActions>
                        <Button variant="contained"
                            className={classes.buttonClose}
                            onClick={handleCloseHistorial}>Cerrar</Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        </Fragment>
    );
}
export default HistorialDialog;