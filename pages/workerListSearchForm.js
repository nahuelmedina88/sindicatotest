import React, { useState, useEffect, useContext, Fragment } from 'react';
import Layout from "../components/layout/Layout";
import styles from "./css/workerListSearchForm.module.scss";
// import Image from 'next/image';
import Select from 'react-select';
import WorkerList from "../components/WorkerList";

import { SearchBoxContext } from "../components/context/SearchBoxContext";

//Redux
import { useDispatch, useSelector } from "react-redux";
import { updatePathnameAction } from "../components/redux/actions/GeneralActions";
import { getEmployeesByDateAction } from "../components/redux/actions/EmployeeActions";
import { getCompaniesAction } from "../components/redux/actions/CompanyActions";

//Customs Components UI
import Search from "../components/ui/Search";
import EmployeeListItem from "../components/EmployeeListItem";

//Material UI
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from "@material-ui/core/Button";

//Firebase
import { FirebaseContext } from "../firebase";

//Formik
import { Formik, Form, Field } from 'formik';

import ExportButton from '../components/ui/ExportButton';

const validation = (values) => {
    let errors = {};

    if (!values.fecha_desde) {
        errors.nombre = 'Ingrese la fecha desde';
    }
    if (!values.fecha_hasta) {
        errors.ciudad = "Ingrese la fecha hasta";
    }
    return errors;
}

const useStyles = makeStyles({
    table: {
        tableLayout: "fixed",
    },
});


const workerListSearchForm = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [companyComboBox, setCompanyComboBox] = useState("");
    const [employeesByCompany, setEmployeesByCompany] = useState([]);

    const [searchBoxValue, setSearchBoxValue] = useState("");

    const [formSubmit, setFormSubmit] = useState(false);

    let employeesSearch = useSelector(state => state.employees.employeesSearch);
    let employeesSelector = useSelector(state => state.employees.employees);
    let employeesSorted = employeesSelector.sort((a, b) => (a.apellido > b.apellido) ? 1 : ((b.apellido > a.apellido) ? -1 : 0));

    const companiesSelector = useSelector(state => state.companies.companies);
    const companiesSelect = companiesSelector.map(company => ({
        id: company.id,
        value: company.id,
        label: company.nombre,
        ciudad: company.ciudad,
        domicilio: company.domicilio
    }));
    companiesSelect.push({
        id: 0,
        value: "Padron General",
        label: "Padrón General",
    })

    const { firebase, user } = useContext(FirebaseContext);

    let EmptyObject = {
        fecha_desde: '',
        fecha_hasta: '',
        empresa: '',
    }

    const getEmployeesByDate = (values, firebase) => {
        dispatch(getEmployeesByDateAction(values, firebase));
    }

    // const handleCompany = (e) => {
    //     let employees = employeesSorted.filter(employee => employee.empresa.nombre === e.label);
    //     setEmployeesByCompany(employees);
    //     setCompanyComboBox(e.label);
    // }

    const loadCompanies = (firebase) => {
        dispatch(getCompaniesAction(firebase))
    }

    useEffect(() => {
        const loadPathname = getPathName => { dispatch(updatePathnameAction(getPathName)) }
        loadPathname();
        loadCompanies(firebase);
    }, [])

    useEffect(() => {
        if (!user) {
            window.location.href = "/login";
        }
    }, []);
    return (
        <Formik initialValues={EmptyObject}
            onSubmit={(values, { setSubmitting
                // , resetForm 
            }) => {
                setSubmitting(true);
                setTimeout(() => {
                    // addCompanyDispatch(values, firebase);
                    getEmployeesByDate(values, firebase);
                    setFormSubmit(true);
                    // resetForm({
                    //     values: EmptyObject,
                    // });
                    setSubmitting(false);
                }, 1000);

            }}
            validate={validation}
        >
            {({ values, errors, touched, isSubmitting, setFieldValue, setFieldTouched }) => (
                <Layout>
                    <div className={styles.container}>
                        <Form className="form">
                            <fieldset className={styles.flexForm}>
                                <legend>Búsqueda de padrones</legend>
                                <div className={styles.formControl}>
                                    <label>Fecha Desde</label>
                                    <Field
                                        type="date"
                                        className="inputSecondary"
                                        name="fecha_desde"
                                        placeholder="Fecha desde"
                                    ></Field>
                                    {touched.fecha_desde && errors.fecha_desde && <span className="errorMessage">{errors.fecha_desde}</span>}
                                </div>
                                <div className={styles.formControl}>
                                    <label>Fecha Hasta</label>
                                    <Field
                                        type="date"
                                        className="inputSecondary"
                                        name="fecha_hasta"
                                        placeholder="Fecha hasta"
                                    ></Field>
                                    {touched.fecha_hasta && errors.fecha_hasta && <span className="errorMessage">{errors.fecha_hasta}</span>}
                                </div>
                                {/* <div className={styles.formControl}>
                                    <label>Empresa</label>
                                    <Select
                                        className={`inputSecondary ` + styles.myselect}
                                        options={companiesSelect}
                                        onChange={handleCompany}
                                        placeholder={"Seleccione un frigorífico"}
                                    ></Select>
                                </div> */}
                                <div className={styles.formControl}>
                                    <label>Empresa</label>
                                    <Select
                                        className={`inputSecondary ` + styles.myselect}
                                        options={companiesSelect}
                                        name="empresa"
                                        defaultValue={{ label: "Padrón General", value: 0 }}
                                        placeholder={"Seleccione un frigorífico"}
                                        onChange={option => setFieldValue("empresa", option.label)}
                                        onBlur={option => setFieldTouched("empresa", option.label)}
                                    ></Select>
                                    {touched.empresa && errors.empresa && <span className="errorMessage">{errors.empresa}</span>}
                                </div>
                            </fieldset>

                            <div className={styles.submittingButton}>
                                <Button
                                    disabled={isSubmitting}
                                    type="submit"
                                    startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                                    variant="contained"
                                    color="primary"
                                >{isSubmitting ? "Enviando" : "Enviar"}
                                </Button>
                            </div>
                        </Form>
                        {formSubmit ?
                            <Fragment>
                                <div className={styles.absCenterSelf}>
                                    <SearchBoxContext.Provider value={{ searchBoxValue, setSearchBoxValue }}>
                                        <div className={styles.searchExportParent}>
                                            <Search
                                                employeesRedux={values.fecha_desde ? employeesSorted : employeesSearch}
                                            />
                                            <ExportButton
                                                employeesSearch={employeesSearch}
                                                employeesSorted={employeesSorted}
                                            />
                                        </div>
                                        <WorkerList
                                            employeesSearch={employeesSearch}
                                            employeesSorted={employeesSorted}
                                        />
                                    </SearchBoxContext.Provider>
                                </div>
                            </Fragment>
                            : null
                        }
                    </div>
                </Layout>
            )
            }
        </Formik >

    );
}
export default workerListSearchForm;
