import React, { useState, useContext, Fragment } from 'react';

//Redux
import { editEmployeeAction, seeEmployeeAction } from "../components/redux/actions/EmployeeActions";
import { useSelector, useDispatch } from "react-redux";

import Select from 'react-select';
import Layout2 from '../components/layout/Layout2';

import { makeStyles } from '@material-ui/core/styles';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { CircularProgress } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import AddIcon from '@material-ui/icons/Add';
import DoneAllIcon from '@material-ui/icons/DoneAll';


//Firebase
import { FirebaseContext } from "../firebase";


//Next
import Link from "next/link";

//Formik
import { Formik, FieldArray } from "formik";
import { object, string } from "yup";


const useStyles2 = makeStyles({
    table: {
        minWidth: 650,
    },
    buttonAdd: {
        margin: 4,
        padding: 0,
        minWidth: 0,
    },
});

const useStylesDialog = makeStyles({
    dialogPaper: {

    },
});


const familyGroupList = () => {

    const [showAddButton, setShowAddButton] = useState(true);
    const [showSaveButton, setShowSaveButton] = useState(false);

    const [showAddButtonKit, setShowAddButtonKit] = useState(true);
    const [showSaveButtonKit, setShowSaveButtonKit] = useState(false);

    const classes2 = useStyles2();
    const classes = useStylesDialog();
    const employeeToSee = useSelector(state => state.employees.employeeToSee);
    const [open, setOpen] = useState(false);
    //Firebase
    const { firebase } = useContext(FirebaseContext);

    const dispatch = useDispatch();

    const getLast20years = () => {
        let fecha = new Date();
        let ano = fecha.getFullYear();
        let arrayObject = [];
        for (let index = ano; index >= 2000; index--) {
            arrayObject.push({ value: index, label: index });
        }
        return arrayObject;
    }

    let ultimosveinteanios = getLast20years();

    const schoolSuppliesSelect = [
        {
            "id": "1",
            "value": "primario",
            "label": "Primario",
            "name": "kit_escolar"
        },
        {
            "id": "2",
            "value": "secundario",
            "label": "Secundario",
            "name": "kit_escolar"
        },
        {
            "id": "3",
            "value": "especial",
            "label": "Especial",
            "name": "kit_escolar"
        }
    ];


    return (<>
        <Layout2>
            {employeeToSee ?
                <TableContainer component={Paper}>
                    <Table className={classes2.table} aria-label="caption table">
                        {/* <caption>A basic table example with a caption</caption> */}
                        <TableHead>
                            <TableRow>
                                <TableCell>Apellido y Nombre</TableCell>
                                <TableCell align="right">DNI</TableCell>
                                <TableCell align="right">Fecha Nacimiento</TableCell>
                                <TableCell align="right">Parentesco</TableCell>
                                <TableCell align="right">Sexo</TableCell>
                                <TableCell align="right">Talle</TableCell>
                                <TableCell align="right">Tipo Kit Escolar</TableCell>
                                <TableCell align="right">Documentación</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {employeeToSee.familia.map((row) => (
                                <TableRow key={row.dni_familia}>
                                    <TableCell component="th" scope="row">
                                        {row.apellido_familia}, {row.nombre_familia}
                                    </TableCell>
                                    <TableCell align="right">{row.dni_familia}</TableCell>
                                    <TableCell align="right">{row.fecha_nacimiento_familia}</TableCell>
                                    <TableCell align="right">{row.parentesco}</TableCell>
                                    <TableCell align="right">{row.sexo}</TableCell>
                                    <TableCell align="right">
                                        {/* {row.talle.map((item, idx) => (
                                            <TableRow>
                                                <TableCell align="left">
                                                    {item.numero}
                                                </TableCell>
                                            </TableRow>
                                        ))} */}
                                        <Fragment>
                                            <Formik
                                                initialValues={employeeToSee}
                                                onSubmit={(values, { setSubmitting }) => {
                                                    setSubmitting(true);
                                                    setTimeout(() => {
                                                        setSubmitting(false);
                                                        values.familia.map(familiar =>
                                                            familiar.talle.map(t => {
                                                                t.enviado = "ok"
                                                            }));
                                                        values && dispatch(editEmployeeAction(values, firebase));
                                                        values && dispatch(seeEmployeeAction(values));
                                                        setOpen(false);
                                                        setShowSaveButton(false);
                                                        setShowAddButton(true);
                                                    }, 2000);
                                                }}
                                            >{({ values, isSubmitting, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
                                                <form onSubmit={handleSubmit}>

                                                    <FieldArray name="familia">
                                                        {({ push, remove }) => (
                                                            <Fragment>
                                                                {values.familia.map((iFamily, index) => (
                                                                    <Fragment key={iFamily}>
                                                                        <FieldArray name={`familia[.${index}.]talle`}>
                                                                            {({ push, remove }) => (
                                                                                <Fragment>
                                                                                    {/* <Fragment>
                                                                                        {
                                                                                            values.familia[index].talle &&
                                                                                            values.familia[index].talle.length === 0 &&
                                                                                            push({ numero: "", anio: "", enviado: "" })
                                                                                        }
                                                                                    </Fragment> */}
                                                                                    <Fragment>
                                                                                        {
                                                                                            showAddButton ?
                                                                                                <Button type="button" color="primary"
                                                                                                    variant="contained"
                                                                                                    className={classes2.buttonAdd}
                                                                                                    onClick={() => {
                                                                                                        push({ numero: '', anio: '', enviado: '' }),
                                                                                                            setShowSaveButton(true),
                                                                                                            setShowAddButton(false)
                                                                                                    }}
                                                                                                // className={`btn btnInfo`}>+</button>
                                                                                                ><AddIcon fontSize="small" /></Button>
                                                                                                : null
                                                                                        }
                                                                                    </Fragment>
                                                                                    <span>{row.talle[0] && row.talle[row.talle.length - 1].numero}</span>
                                                                                    {
                                                                                        values.familia[index].talle &&
                                                                                        values.familia[index].talle.length >= 0 &&

                                                                                        values.familia[index].talle.map((i, idx) => (
                                                                                            i.enviado !== "ok" ?
                                                                                                <Fragment>
                                                                                                    {/* {console.log("Holaa" + values.familia[index].talle[idx])} */}
                                                                                                    <TextField
                                                                                                        autoFocus
                                                                                                        margin="dense"
                                                                                                        type="text"
                                                                                                        name={`familia[${index}].talle[${idx}].numero`}
                                                                                                        onChange={handleChange}
                                                                                                        onBlur={handleBlur}
                                                                                                        fullWidth
                                                                                                        label="Talle"
                                                                                                        variant="outlined"
                                                                                                    ></TextField>
                                                                                                    <Select
                                                                                                        className={`inputSecondary `}
                                                                                                        name={`familia[${index}].talle[${idx}].anio`}
                                                                                                        options={ultimosveinteanios}
                                                                                                        placeholder={"Año"}
                                                                                                        onChange={option => setFieldValue(`familia[.${index}.]talle[.${idx}.]anio`, option.label)}
                                                                                                    ></Select>
                                                                                                </Fragment> :
                                                                                                <Fragment></Fragment>
                                                                                        ))
                                                                                    }

                                                                                </Fragment>
                                                                            )}
                                                                        </FieldArray>
                                                                        {/* <Select
                                                                                    className={`inputSecondary `}
                                                                                    name={`familia[.${index}.]kit_escolar`}
                                                                                    options={schoolSuppliesSelect}
                                                                                    placeholder={"Kit Escolar"}
                                                                                    onChange={option => setFieldValue(`familia[.${index}.]kit_escolar`, option.label)}
                                                                                ></Select>
                                                                                <Select
                                                                                    className={`inputSecondary `}
                                                                                    name={`familia[.${index}.]anio`}
                                                                                    options={ultimosveinteanios}
                                                                                    placeholder={"Año"}
                                                                                    onChange={option => setFieldValue(`familia[.${index}.]anio`, option.label)}
                                                                                ></Select> */}
                                                                    </Fragment>
                                                                ))}

                                                            </Fragment>
                                                        )}
                                                    </FieldArray>
                                                    {showSaveButton ?
                                                        <Button
                                                            type="submit"
                                                            disabled={isSubmitting}
                                                            variant="contained"
                                                            size="small"
                                                            color="Secondary"
                                                            // className={`btn btnDanger`}
                                                            startIcon={isSubmitting ? <CircularProgress size="0.9rem" /> : undefined}
                                                        >{isSubmitting ? <DoneAllIcon fontSize="small" /> : <CheckIcon fontSize="small" />}
                                                        </Button> : null}
                                                </form>
                                            )}
                                            </Formik>
                                        </Fragment>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Fragment>
                                            <Formik
                                                initialValues={employeeToSee}
                                                onSubmit={(values, { setSubmitting }) => {
                                                    setSubmitting(true);
                                                    setTimeout(() => {
                                                        setSubmitting(false);
                                                        values.familia.map(familiar =>
                                                            familiar.kit_escolar.map(t => {
                                                                t.enviado = "ok"
                                                            }));
                                                        values && dispatch(editEmployeeAction(values, firebase));
                                                        values && dispatch(seeEmployeeAction(values));
                                                        setShowSaveButtonKit(false);
                                                        setShowAddButtonKit(true);
                                                    }, 2000);
                                                }}
                                            >{({ values, isSubmitting, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
                                                <form onSubmit={handleSubmit}>

                                                    <FieldArray name="familia">
                                                        {({ push, remove }) => (
                                                            <Fragment>
                                                                {values.familia.map((iFamily, index) => (
                                                                    <Fragment key={iFamily}>
                                                                        <FieldArray name={`familia[.${index}.]kit_escolar`}>
                                                                            {({ push, remove }) => (
                                                                                <Fragment>
                                                                                    {/* <Fragment>
                                                                                        {
                                                                                            values.familia[index].kit_escolar &&
                                                                                            values.familia[index].kit_escolar.length === 0 &&
                                                                                            push({ tipo: "", anio: "", enviado: "" })
                                                                                        }
                                                                                    </Fragment> */}
                                                                                    <Fragment>
                                                                                        {
                                                                                            showAddButtonKit ?
                                                                                                <Button type="button" color="primary"
                                                                                                    variant="contained"
                                                                                                    className={classes2.buttonAdd}
                                                                                                    onClick={() => {
                                                                                                        push({ tipo: '', anio: '', enviado: '' }),
                                                                                                            setShowSaveButtonKit(true),
                                                                                                            setShowAddButtonKit(false)
                                                                                                    }}
                                                                                                ><AddIcon fontSize="small" /></Button>
                                                                                                : null
                                                                                        }
                                                                                    </Fragment>
                                                                                    <span>{row.kit_escolar[0] && row.kit_escolar[row.kit_escolar.length - 1].tipo}</span>
                                                                                    {
                                                                                        values.familia[index].kit_escolar &&
                                                                                        values.familia[index].kit_escolar.length >= 0 &&

                                                                                        values.familia[index].kit_escolar.map((i, idx) => (
                                                                                            i.enviado !== "ok" ?
                                                                                                <Fragment>
                                                                                                    <Select
                                                                                                        className={`inputSecondary `}
                                                                                                        name={`familia[${index}].kit_escolar[${idx}].tipo`}
                                                                                                        options={schoolSuppliesSelect}
                                                                                                        placeholder={"Kit Escolar"}
                                                                                                        onChange={option => setFieldValue(`familia[${index}].kit_escolar[${idx}].tipo`, option.label)}
                                                                                                    ></Select>
                                                                                                    <Select
                                                                                                        className={`inputSecondary `}
                                                                                                        name={`familia[${index}].kit_escolar[${idx}].anio`}
                                                                                                        options={ultimosveinteanios}
                                                                                                        placeholder={"Año"}
                                                                                                        onChange={option => setFieldValue(`familia[.${index}.]kit_escolar[.${idx}.]anio`, option.label)}
                                                                                                    ></Select>
                                                                                                </Fragment> :
                                                                                                <Fragment></Fragment>
                                                                                        ))
                                                                                    }

                                                                                </Fragment>
                                                                            )}
                                                                        </FieldArray>
                                                                        {/* <Select
                                                                                    className={`inputSecondary `}
                                                                                    name={`familia[.${index}.]kit_escolar`}
                                                                                    options={schoolSuppliesSelect}
                                                                                    placeholder={"Kit Escolar"}
                                                                                    onChange={option => setFieldValue(`familia[.${index}.]kit_escolar`, option.label)}
                                                                                ></Select>
                                                                                <Select
                                                                                    className={`inputSecondary `}
                                                                                    name={`familia[.${index}.]anio`}
                                                                                    options={ultimosveinteanios}
                                                                                    placeholder={"Año"}
                                                                                    onChange={option => setFieldValue(`familia[.${index}.]anio`, option.label)}
                                                                                ></Select> */}
                                                                    </Fragment>
                                                                ))}

                                                            </Fragment>
                                                        )}
                                                    </FieldArray>
                                                    {showSaveButtonKit ?
                                                        <Button
                                                            type="submit"
                                                            disabled={isSubmitting}
                                                            variant="contained"
                                                            size="small"
                                                            color="Secondary"
                                                            // className={`btn btnDanger`}
                                                            startIcon={isSubmitting ? <CircularProgress size="0.9rem" /> : undefined}
                                                        >{isSubmitting ? <DoneAllIcon fontSize="small" /> : <CheckIcon fontSize="small" />}
                                                        </Button> : null}
                                                </form>
                                            )}
                                            </Formik>
                                        </Fragment>
                                    </TableCell>


                                    <TableCell align="right">{row.documentacion}</TableCell>
                                    <TableCell>

                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                : null}
        </Layout2>
    </>);
}

export default familyGroupList;