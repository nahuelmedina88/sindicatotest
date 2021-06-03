import React, { useContext, useState, Fragment } from 'react';

//Material UI
import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { CircularProgress } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';

//Helpers
import { numberWithPoint } from "./helpers/formHelper";

//Redux
import {
    seeEmployeeAction,
    editEmployeeWithoutAlertAction,
    editEmployeeAction,
    editEmployeeAction2,
    deleteEmployeeActionNoImpactDatabase
} from "./redux/actions/EmployeeActions";
import { useDispatch } from "react-redux";

//Firebase
import { FirebaseContext } from "../firebase";

//Next
import Link from "next/link";

//Formik
import { Formik } from "formik";
import { object, string } from "yup";


const useStyles = makeStyles({
    table: {
        tableLayout: "fixed",
    },
    btn: {
        padding: "0.4rem",
        borderRadius: "5px",
        textDecoration: "none",
        borderWidth: "1px",
        borderColor: "#fff",
        fontSize: "1rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
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
    buttonYellow: {
        backgroundColor: "#879442",
        color: "#fff",
        "&:hover": {
            backgroundColor: "#879442b5",
        }
    },
    buttonSave: {
        backgroundColor: "rgb(7,138,7)",
        color: "#fff",
        "&:hover": {
            backgroundColor: "rgb(7,138,7, 0.7)",
        }
    },
    buttonBlue: {
        backgroundColor: "#3b5999;",
        color: "#fff",
        "&:hover": {
            backgroundColor: "#3b5999b5",
        }
    },
    buttonInfo: {
        backgroundColor: "#00a2ba",
        color: "#fff",
        "&:hover": {
            backgroundColor: "#00a2bab5",
        }
    },
    bgColorChecked: {
        backgroundColor: "#98b3e4b5",
    },
    bgColorNoChecked: {
        backgroundColor: "#f2747480",
    },
});

const SelectFoundationWorkerListItem = ({ employee }) => {
    const [open, setOpen] = useState(false);
    const classes = useStyles();
    const handleClickOpen = (dni) => {
        setOpen(dni);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const dispatch = useDispatch();

    const { firebase } = useContext(FirebaseContext);

    const redirectToSee = (employee) => {
        dispatch(seeEmployeeAction(employee));
        // history.push(`/employees/edit/${employee.id}`);
    }

    const handleChangeCheckBox = (e) => {
        let dniChecked = parseInt(e.target.id);
        let newEmployee = Object.assign({}, employee);
        newEmployee.padron_fundacional = (employee.dni === dniChecked) && e.target.checked
        dispatch(editEmployeeWithoutAlertAction(newEmployee, firebase));
        // dispatch(seeEmployeeAction(newEmployee));
    }


    return (<>
        <TableRow key={employee.dni} className={employee.padron_fundacional && employee.padron_fundacional ? classes.bgColorChecked : classes.bgColorNoChecked}>
            <TableCell align="right">{employee.nroLegajo}</TableCell>
            <TableCell align="right">{employee.apellido}</TableCell>
            <TableCell align="right">{employee.nombre}</TableCell>
            <TableCell align="right">{numberWithPoint(employee.dni)}</TableCell>
            <TableCell align="right">{employee.empresa.nombre}</TableCell>
            <TableCell align="right">
                <Checkbox
                    id={employee.dni}
                    checked={employee.padron_fundacional ? employee.padron_fundacional : false}
                    onChange={handleChangeCheckBox}
                    inputProps={{ 'aria-label': 'controlled' }}
                />
            </TableCell>
        </TableRow>
    </>);
}

export default SelectFoundationWorkerListItem;