import React, { useState, Fragment } from 'react';
//Material UI
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
//Next
import Link from "next/link";
import Image from 'next/image'

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
    buttonPurple: {
        backgroundColor: "rgb(86, 7, 138)",
        color: "#fff",
        "&:hover": {
            backgroundColor: "rgb(86, 7, 138,0.7)",
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

const SeeDocumentation = ({ row }) => {
    const classes = useStyles();
    const [openImage, setOpenImage] = useState("");

    const handleClickOpenImage = (dni) => {
        setOpenImage(dni);
    };

    const handleCloseImage = () => {
        setOpenImage("");
    };

    return (
        <>
            {row.documentacion[0] && row.documentacion[row.documentacion.length - 1].anio === new Date().getFullYear() ?
                <Fragment>
                    <Link href="#">
                        <a className={`${classes.btn} ${classes.buttonPurple}`}
                            onClick={() => handleClickOpenImage(row.dni_familia)}
                        >Ver Documentación
                                        </a>
                    </Link>
                    <Dialog fullWidth
                        open={openImage === row.dni_familia && true}
                        onClose={handleCloseImage}
                        aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title">
                            {/* {row.documentacion[row.documentacion.length - 1].} */}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText>

                            </DialogContentText>
                            <Image
                                src={row.documentacion.length > 0 && row.documentacion[row.documentacion.length - 1].url}
                                alt="Constancia Alumno Regular"
                                width={640}
                                height={480}
                            />
                            <DialogActions>
                                <Button variant="contained"
                                    className={classes.buttonClose}
                                    onClick={handleCloseImage}>Cerrar
                                    </Button>
                            </DialogActions>
                        </DialogContent>
                    </Dialog>
                </Fragment> :
                <span>No hay documentación</span>
            }
        </>

    );
}

export default SeeDocumentation;