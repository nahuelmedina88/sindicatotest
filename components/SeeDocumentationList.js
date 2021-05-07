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

const SeeDocumentationList = ({ item }) => {
    const [openImage, setOpenImage] = useState("");
    const classes = useStyles();
    const handleClickOpenImage = (anio) => {
        setOpenImage(anio);
    };

    const handleCloseImage = () => {
        setOpenImage("");
    };

    return (
        <>
            <Fragment>
                <Link href="#">
                    <a className={`${classes.btn} ${classes.buttonPurple}`}
                        onClick={() => handleClickOpenImage(item.anio)}
                    >
                        Ver Documentación
                    </a>
                </Link>
                <Dialog fullWidth
                    open={openImage === item.anio && true}
                    onClose={handleCloseImage}
                    aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>

                        </DialogContentText>
                        <Image
                            src={item && item.tipoDoc}
                            alt="Constancia Alumno Regular"
                            width={640}
                            height={480}
                        />
                        <DialogActions>
                            <Button variant="contained"
                                className={classes.buttonClose}
                                onClick={handleCloseImage}>Cerrar</Button>
                        </DialogActions>
                    </DialogContent>
                </Dialog>
            </Fragment>
        </>

    );
}

export default SeeDocumentationList;