import React, { useContext, useState, Fragment, memo, useEffect } from 'react';

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

//Redux
import { seeEmployeeAction, editEmployeeAction, editEmployeeAction2 } from "./redux/actions/EmployeeActions";
import { useDispatch } from "react-redux";

//Firebase
import { FirebaseContext } from "../firebase";

//Next
import Link from "next/link";

//Formik
import { Formik } from "formik";
import { object, string } from "yup";


const WorkerListItemSchoolSupplies = ({ employee }) => {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const dispatch = useDispatch();

    const { firebase } = useContext(FirebaseContext);

    const redirectToEdit = (employee) => {
        dispatch(editEmployeeAction2(employee));
        // history.push(`/employees/edit/${employee.id}`);
    }
    const redirectToSee = (employee) => {
        dispatch(seeEmployeeAction(employee));
        // history.push(`/employees/edit/${employee.id}`);
    }

    useEffect(() => {
        //console.log("employeesListItem render");
    }, [])

    return (<>
        <TableRow key={employee.dni}>
            <TableCell align="right">{employee.nroLegajo}</TableCell>
            {/* <TableCell component="th" scope="row">{employee.apellido}</TableCell> */}
            <TableCell align="right">{employee.apellido}</TableCell>
            <TableCell align="right">{employee.nombre}</TableCell>
            <TableCell align="right">{employee.dni}</TableCell>
            <TableCell align="right">{employee.empresa.nombre}</TableCell>
            <TableCell align="right">
                <Link
                    href="/familyGroupList[id]"
                    as={`/familyGroupList${employee.id}`}
                >
                    <a className="btn btnPrimary btnTable"
                        onClick={() => redirectToSee(employee)}
                    >
                        Cargar Útiles
                                        </a>
                </Link>
            </TableCell>
        </TableRow>
    </>);
}

export default WorkerListItemSchoolSupplies;