// pages/workerListSearchForm.js
import React, { useState, useEffect, useContext, Fragment } from 'react';
import Layout from "../components/layout/Layout";
import styles from "./css/workerListSearchForm.module.scss";
import Select from 'react-select';
import WorkerList from "../components/WorkerList";

import { SearchBoxContext } from "../components/context/SearchBoxContext";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { updatePathnameAction } from "../components/redux/actions/GeneralActions";
import { getEmployeesByDateAction } from "../components/redux/actions/EmployeeActions";
import { getCompaniesAction } from "../components/redux/actions/CompanyActions";

// UI
import Search from "../components/ui/Search";
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';

// Firebase
import { FirebaseContext } from "../firebase";

// Formik
import { Formik, Form, Field } from 'formik';

import ExportButton from '../components/ui/ExportButton';

const validation = (values) => {
  const errors = {};
  if (!values.fecha_desde) errors.fecha_desde = 'Ingrese la fecha desde';
  if (!values.fecha_hasta) errors.fecha_hasta = 'Ingrese la fecha hasta';
  return errors;
};

const WorkerListSearchForm = () => {
  const dispatch = useDispatch();

  const [searchBoxValue, setSearchBoxValue] = useState("");
  const [formSubmit, setFormSubmit] = useState(false);

  const employeesSearch = useSelector(state => state.employees.employeesSearch);
  const employeesSelector = useSelector(state => state.employees.employees);
  const employeesSorted = [...employeesSelector].sort((a, b) =>
    a.apellido > b.apellido ? 1 : b.apellido > a.apellido ? -1 : 0
  );

  const companiesSelector = useSelector(state => state.companies.companies);
  const companiesSelect = companiesSelector.map(company => ({
    id: company.id,
    value: company.id,
    label: company.nombre,
    ciudad: company.ciudad,
    domicilio: company.domicilio
  }));
  companiesSelect.push({ id: 0, value: "Padron General", label: "Padrón General" });

  const { firebase, user } = useContext(FirebaseContext);

  const EmptyObject = {
    fecha_desde: '',
    fecha_hasta: '',
    empresa: '',
  };

  const getEmployeesByDate = (values, fb) => {
    dispatch(getEmployeesByDateAction(values, fb));
  };

  const loadCompanies = (fb) => {
    dispatch(getCompaniesAction(fb));
  };

  useEffect(() => {
    dispatch(updatePathnameAction('/workerListSearchForm'));
    loadCompanies(firebase);
  }, [dispatch, firebase]);

  useEffect(() => {
    if (!user) {
      window.location.href = "/login";
    }
  }, [user]);

  return (
    <Formik
      initialValues={EmptyObject}
      validate={validation}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(true);
        setTimeout(() => {
          getEmployeesByDate(values, firebase);
          setFormSubmit(true);
          setSubmitting(false);
        }, 1000);
      }}
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
                  />
                  {touched.fecha_desde && errors.fecha_desde && (
                    <span className="errorMessage">{errors.fecha_desde}</span>
                  )}
                </div>

                <div className={styles.formControl}>
                  <label>Fecha Hasta</label>
                  <Field
                    type="date"
                    className="inputSecondary"
                    name="fecha_hasta"
                    placeholder="Fecha hasta"
                  />
                  {touched.fecha_hasta && errors.fecha_hasta && (
                    <span className="errorMessage">{errors.fecha_hasta}</span>
                  )}
                </div>

                <div className={styles.formControl}>
                  <label>Empresa</label>
                  <Select
                    className={`inputSecondary ${styles.myselect}`}
                    options={companiesSelect}
                    name="empresa"
                    defaultValue={{ label: "Padrón General", value: 0 }}
                    placeholder={"Seleccione un frigorífico"}
                    onChange={(option) => setFieldValue("empresa", option.label)}
                    onBlur={(option) => setFieldTouched("empresa", option?.label)}
                  />
                  {touched.empresa && errors.empresa && (
                    <span className="errorMessage">{errors.empresa}</span>
                  )}
                </div>
              </fieldset>

              <div className={styles.submittingButton}>
                <Button
                  disabled={isSubmitting}
                  type="submit"
                  startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                  variant="contained"
                  color="primary"
                >
                  {isSubmitting ? "Enviando" : "Enviar"}
                </Button>
              </div>
            </Form>

            {formSubmit ? (
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
            ) : null}
          </div>
        </Layout>
      )}
    </Formik>
  );
};

export default WorkerListSearchForm;