import React, { useEffect, useState, useContext, Fragment } from 'react';
import Select from 'react-select';

import Image from 'next/image';
import Layout from "../components/layout/Layout";
import { useRouter } from 'next/router';
import Link from "next/link";
import { capitalizeFirstLetter } from "../components/helpers/formHelper";

// Styles
import styles from "./css/AddEmployee.module.scss";

// Data (Selects)
import relationshipSelect from "../components/data/relationship.json";
import sexSelect from "../components/data/sexo.json";
import maritalStatusSelect from "../components/data/maritalStatus.json";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { getCompaniesAction } from "../components/redux/actions/CompanyActions";
import { addEmployeeAction, getEmployeesAction } from "../components/redux/actions/EmployeeActions";
import { getSectionsAction, getCategoriesAction } from "../components/redux/actions/SectionActions";

// Firebase (context NUEVO)
import FirebaseContext from "../firebase/context";

// Formik / Yup
import { Formik, Field, Form, FieldArray, getIn } from "formik";
import validation from "../validation/addEmployeeValidate";

const ErrorMessageArray = ({ name }) => (
  <Field
    name={name}
    render={({ form }) => {
      const error = getIn(form.errors, name);
      const touch = getIn(form.touched, name);
      return touch && error ? error : null;
    }}
  />
);

const ErrorMessageArraySelect = ({ name }) => (
  <Field
    as={Select}
    name={name}
    render={({ form }) => {
      const error = getIn(form.errors, name);
      const touch = getIn(form.touched, name);
      return touch && error ? error : null;
    }}
  />
);

const AddEmployee = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [maritalStatusTypes, updateMaritalStatusTypes] = useState("");
  const [section, setSection] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [legajo, setLegajo] = useState("");
  const [empresa, setEmpresa] = useState("");

  // Selectors
  const loading = useSelector(state => state.employees.loading);
  const employeesSelector = useSelector(state => state.employees.employees);

  const companiesSelector = useSelector(state => state.companies.companies);
  const companiesSelect = companiesSelector.map(company => ({
    id: company.id,
    label: company.nombre,
    value: company.id,
    nombre: company.nombre,
    ciudad: company.ciudad,
    calle: company.calle,
    numero_calle: company.numero_calle,
    cuit: company.cuit,
  }));

  const sectionsSelector = useSelector(state => state.sections.sections);
  const sectionsSelect = sectionsSelector.map(section => ({
    id: section.codigo,
    value: section.codigo,
    label: section.nombre
  }));

  const categoriesSelector = useSelector(state => state.sections.categories);
  const categoriesSelect = categoriesSelector.map(category => ({
    id: category.codigo,
    value: category.codigo,
    label: category.nombre
  }));

  // Firebase (de nuestro provider modular)
  const { firebase, user } = useContext(FirebaseContext);

  const AddEmployeeDispatch = (employee, fb) => dispatch(addEmployeeAction(employee, fb));

  useEffect(() => {
    dispatch(getCompaniesAction(firebase));
    dispatch(getSectionsAction(firebase));
    dispatch(getEmployeesAction(firebase));
    updateMaritalStatusTypes(maritalStatusSelect);
  }, [dispatch, firebase]);

  useEffect(() => {
    getLastWorker();
  }, [employeesSelector]);

  useEffect(() => {
    dispatch(getCategoriesAction(firebase, section));
  }, [dispatch, firebase, section]);

  const getLastWorker = () => {
    let empleadoPrevio = "";
    let empleadoMaximo = "";
    employeesSelector.map(empleado => {
      let empleadoActual = empleado;
      if (!empleadoPrevio) {
        empleadoMaximo = empleadoActual;
      } else if (parseInt(empleadoActual.nroLegajo) > parseInt(empleadoMaximo.nroLegajo)) {
        empleadoMaximo = empleadoActual;
      } else {
        empleadoMaximo = empleadoMaximo;
      }
      empleadoPrevio = empleadoActual;
    });
    setLegajo(empleadoMaximo?.nroLegajo || "");
  };

  useEffect(() => {
    if (!user) {
      window.location.href = "/login";
    }
  }, [user]);

  const EmptyObject = {
    nombre: '',
    apellido: '',
    ciudad: '',
    calle: '',
    numero_calle: '',
    codigo_postal: '',
    dni: '',
    cuil: '',
    fecha_nacimiento: '',
    nacionalidad: 'Argentina',
    estado_civil: '',
    entregado: { checked: false, anio: new Date().getFullYear() },
    documentacion: [],
    email: '',
    telefono: '',
    nroLegajo: '',
    nro_legajo_empresa: '',
    fecha_ingreso: '',
    seccion: {},
    categoria: {},
    fecha_ingreso_empresa: '',
    empresa: {},
    familia: [
      {
        talle: [],
        kit_escolar: [],
      }
    ]
  };

  return (
    <Formik
      initialValues={EmptyObject}
      onSubmit={(values, { resetForm, setSubmitting }) => {
        const found = employeesSelector.find(
          emp => (emp.dni === values.dni || emp.nroLegajo === values.nroLegajo)
        );
        setSubmitting(true);
        if (!found) {
          setTimeout(() => {
            values.estado = "Activo";
            values.fecha_creacion = new Date();
            values.usuario_creacion = user.uid;
            AddEmployeeDispatch(values, firebase);
            setSubmitting(false);
            router.push("/generalWorkerList");
          }, 1000);
        } else {
          setTimeout(() => {
            setGeneralError("Ya existe un empleado con ese dni y/o nro de afiliado.");
            setSubmitting(false);
          }, 1000);
        }
      }}
      validate={validation}
    >
      {({ values, errors, touched, isSubmitting, setFieldValue, setFieldTouched }) => (
        <div>
          <Layout>
            <div className={styles.container}>
              <Form className={styles.mainForm} autoComplete="off">
                <fieldset className={styles.flexForm}>
                  <legend>Datos básicos del Trabajador</legend>

                  <div className={styles.formControl}>
                    <label>Nombre</label>
                    <Field
                      type="text"
                      className="inputSecondary"
                      name="nombre"
                      placeholder="Nombre"
                      value={capitalizeFirstLetter(values.nombre)}
                    />
                    {touched.nombre && errors.nombre && <span className="errorMessage">{errors.nombre}</span>}
                  </div>

                  <div className={styles.formControl}>
                    <label>Apellido</label>
                    <Field
                      type="text"
                      className="inputSecondary"
                      name="apellido"
                      placeholder="Apellido"
                      value={capitalizeFirstLetter(values.apellido)}
                    />
                    {touched.apellido && errors.apellido && <p className="errorMessage">{errors.apellido}</p>}
                  </div>

                  <div className={styles.formControl}>
                    <label>Calle</label>
                    <Field
                      type="text"
                      className="inputSecondary"
                      name="calle"
                      placeholder="Calle"
                      value={capitalizeFirstLetter(values.calle)}
                    />
                    {touched.calle && errors.calle && <span className="errorMessage">{errors.calle}</span>}
                  </div>

                  <div className={styles.formControl}>
                    <label>Número</label>
                    <Field
                      type="number"
                      className="inputSecondary"
                      name="numero_calle"
                      placeholder="Número"
                      value={values.numero_calle}
                    />
                    {touched.numero_calle && errors.numero_calle && <span className="errorMessage">{errors.numero_calle}</span>}
                  </div>

                  <div className={styles.formControl}>
                    <label>Ciudad</label>
                    <Field
                      type="text"
                      className="inputSecondary"
                      name="ciudad"
                      placeholder="Ciudad"
                      value={capitalizeFirstLetter(values.ciudad)}
                    />
                    {touched.ciudad && errors.ciudad && <span className="errorMessage">{errors.ciudad}</span>}
                  </div>

                  <div className={styles.formControl}>
                    <label>Código Postal</label>
                    <Field
                      type="text"
                      className="inputSecondary"
                      name="codigo_postal"
                      placeholder="Codigo Postal"
                      value={values.codigo_postal}
                    />
                    {touched.codigo_postal && errors.codigo_postal && <span className="errorMessage">{errors.codigo_postal}</span>}
                  </div>

                  <div className={styles.formControl}>
                    <label>DNI</label>
                    <Field
                      type="number"
                      className="inputSecondary"
                      name="dni"
                      placeholder="DNI"
                      value={values.dni}
                    />
                    {touched.dni && errors.dni && <span className="errorMessage">{errors.dni}</span>}
                  </div>

                  <div className={styles.formControl}>
                    <label>CUIL</label>
                    <Field
                      type="number"
                      className="inputSecondary"
                      name="cuil"
                      placeholder="CUIL"
                      value={values.cuil}
                    />
                    {touched.cuil && errors.cuil && <span className="errorMessage">{errors.cuil}</span>}
                  </div>

                  <div className={styles.formControl}>
                    <label>Fecha de Nacimiento</label>
                    <Field
                      type="date"
                      className="inputSecondary"
                      name="fecha_nacimiento"
                      placeholder="Fecha de nacimiento"
                      value={values.fecha_nacimiento}
                    />
                    {touched.fecha_nacimiento && errors.fecha_nacimiento && <span className="errorMessage">{errors.fecha_nacimiento}</span>}
                  </div>

                  <div className={styles.formControl}>
                    <label>Nacionalidad</label>
                    <Field
                      type="text"
                      className="inputSecondary"
                      name="nacionalidad"
                      placeholder="Nacionalidad"
                      value={capitalizeFirstLetter(values.nacionalidad)}
                    />
                    {touched.nacionalidad && errors.nacionalidad && <span className="errorMessage">{errors.nacionalidad}</span>}
                  </div>

                  <div className={styles.formControl}>
                    <label>Estado Civil</label>
                    <Select
                      className={`inputSecondary ${styles.myselect}`}
                      name="estado_civil"
                      options={maritalStatusTypes}
                      placeholder="Estado Civil"
                      onChange={option => setFieldValue("estado_civil", option.label)}
                      onBlur={option => setFieldTouched("estado_civil", option.label)}
                    />
                    {touched.estado_civil && errors.estado_civil && <span className="errorMessage">{errors.estado_civil}</span>}
                  </div>

                  <div className={styles.formControl}>
                    <label>Email</label>
                    <Field
                      type="email"
                      className="inputSecondary"
                      name="email"
                      placeholder="Email"
                      value={values.email}
                    />
                    {touched.email && errors.email && <span className="errorMessage">{errors.email}</span>}
                  </div>

                  <div className={styles.formControl}>
                    <label>Nro de Teléfono</label>
                    <Field
                      type="text"
                      className="inputSecondary"
                      name="telefono"
                      placeholder="Número de teléfono"
                      value={values.telefono}
                    />
                    {touched.telefono && errors.telefono && <span className="errorMessage">{errors.telefono}</span>}
                  </div>
                </fieldset>

                <fieldset className={styles.flexFormEmpresa}>
                  <legend>Información relacionada al Sindicato</legend>
                  <div className={styles.formControl}>
                    <label>Nro Afiliado</label>
                    <Field
                      type="number"
                      className="inputSecondary"
                      name="nroLegajo"
                      placeholder="Nro Legajo"
                      value={values.nroLegajo}
                    />
                    {touched.nroLegajo && errors.nroLegajo && <p className="errorMessage">{errors.nroLegajo}</p>}
                  </div>
                  <div className={styles.formControl}>
                    <label>Fecha de Afiliación</label>
                    <Field
                      type="date"
                      className="inputSecondary"
                      name="fecha_ingreso"
                      placeholder="Fecha de Ingreso"
                      value={values.fecha_ingreso}
                    />
                    {touched.fecha_ingreso && errors.fecha_ingreso && <span className="errorMessage">{errors.fecha_ingreso}</span>}
                  </div>
                </fieldset>

                <fieldset className={styles.flexFormEmpresa}>
                  <legend>Información relacionada a la Empresa</legend>
                  <div className={styles.formControl}>
                    <label>Nro Legajo</label>
                    <Field
                      type="number"
                      className="inputSecondary"
                      name="nro_legajo_empresa"
                      placeholder="Nro Legajo"
                      value={values.nro_legajo_empresa}
                    />
                    {touched.nro_legajo_empresa && errors.nro_legajo_empresa && <p className="errorMessage">{errors.nro_legajo_empresa}</p>}
                  </div>

                  <div className={styles.formControl}>
                    <label>Sección</label>
                    <Select
                      className={`inputSecondary ${styles.myselect}`}
                      options={sectionsSelect}
                      name="seccion"
                      placeholder="Seleccione una Sección"
                      onChange={(option) => {
                        setFieldValue("seccion", option);
                        setSection({
                          "codigo_seccion": option.value,
                          "nombre_seccion": option.label,
                        });
                      }}
                      onBlur={(option) => setFieldTouched("seccion", option)}
                    />
                    {touched.seccion && errors.seccion && <span className="errorMessage">{errors.seccion}</span>}
                  </div>

                  <div className={styles.formControl}>
                    <label>Categoría</label>
                    <Select
                      className={`inputSecondary ${styles.myselect}`}
                      options={categoriesSelect}
                      name="categoria"
                      placeholder="Seleccione una Categoría"
                      onChange={(option) => setFieldValue("categoria", option)}
                      onBlur={(option) => setFieldTouched("categoria", option)}
                    />
                    {touched.categoria && errors.categoria && <span className="errorMessage">{errors.categoria}</span>}
                  </div>

                  <div className={styles.formControl}>
                    <label>Fecha de Ingreso a la Empresa</label>
                    <Field
                      type="date"
                      className="inputSecondary"
                      name="fecha_ingreso_empresa"
                      placeholder="Fecha de Ingreso"
                      value={values.fecha_ingreso_empresa}
                    />
                    {touched.fecha_ingreso_empresa && errors.fecha_ingreso_empresa && (
                      <span className="errorMessage">{errors.fecha_ingreso_empresa}</span>
                    )}
                  </div>

                  <div className={styles.formControl}>
                    <label>Empresa</label>
                    <Select
                      className={`inputSecondary ${styles.myselect}`}
                      options={companiesSelect}
                      name="empresa"
                      placeholder="Seleccione un frigorífico"
                      onChange={(option) => setFieldValue("empresa", option)}
                      onBlur={(option) => setFieldTouched("empresa", option)}
                    />
                    {touched.empresa && errors.empresa && <span className="errorMessage">{errors.empresa}</span>}
                  </div>
                </fieldset>

                <FieldArray name="familia">
                  {({ push, remove }) => (
                    <Fragment>
                      {values.familia.length > 0 && (
                        <Fragment>
                          {values.familia.map((_, index) => (
                            <Fragment key={index}>
                              <fieldset className={styles.flexFormFamilia}>
                                <legend>Nuevo Integrante Familiar</legend>

                                <div className={styles.formControl}>
                                  <label>Nombre</label>
                                  <Field
                                    type="text"
                                    className="inputSecondary"
                                    name={`familia[.${index}.]nombre_familia`}
                                    placeholder="Nombre"
                                  />
                                  <span className="errorMessage">
                                    <ErrorMessageArray name={`familia[.${index}.]nombre_familia`} />
                                  </span>
                                </div>

                                <div className={styles.formControl}>
                                  <label>Apellido</label>
                                  <Field
                                    type="text"
                                    className="inputSecondary"
                                    name={`familia[.${index}.]apellido_familia`}
                                    placeholder="Apellido"
                                  />
                                  <span className="errorMessage">
                                    <ErrorMessageArray name={`familia[.${index}.]apellido_familia`} />
                                  </span>
                                </div>

                                <div className={styles.formControl}>
                                  <label>Parentesco</label>
                                  <Select
                                    className={`inputSecondary ${styles.myselect}`}
                                    options={relationshipSelect}
                                    name={`familia[.${index}.]parentesco`}
                                    placeholder="Parentesco"
                                    onChange={(option) => setFieldValue(`familia[.${index}.]parentesco`, option.label)}
                                    onBlur={(option) => setFieldTouched(`familia[.${index}.]parentesco`, option.label)}
                                  />
                                  <span className="errorMessage">
                                    <ErrorMessageArraySelect name={`familia[.${index}.]parentesco`} />
                                  </span>
                                </div>

                                <div className={styles.formControl}>
                                  <label>Sexo</label>
                                  <Select
                                    className={`inputSecondary ${styles.myselect}`}
                                    options={sexSelect}
                                    name={`familia[.${index}.]sexo`}
                                    placeholder="Sexo"
                                    onChange={(option) => setFieldValue(`familia[.${index}.]sexo`, option.label)}
                                    onBlur={(option) => setFieldTouched(`familia[.${index}.]sexo`, option.label)}
                                  />
                                  <span className="errorMessage">
                                    <ErrorMessageArraySelect name={`familia[.${index}.]sexo`} />
                                  </span>
                                </div>

                                <div className={styles.formControl}>
                                  <label>Fecha de Nacimiento</label>
                                  <Field
                                    type="date"
                                    className="inputSecondary"
                                    name={`familia[.${index}.]fecha_nacimiento_familia`}
                                    placeholder="Fecha de nacimiento"
                                  />
                                  <span className="errorMessage">
                                    <ErrorMessageArray name={`familia[.${index}.]fecha_nacimiento_familia`} />
                                  </span>
                                </div>

                                <div className={styles.formControl}>
                                  <label>DNI</label>
                                  <Field
                                    type="number"
                                    className="inputSecondary"
                                    name={`familia[.${index}.]dni_familia`}
                                    placeholder="DNI"
                                  />
                                  <span className="errorMessage">
                                    <ErrorMessageArray name={`familia[.${index}.]dni_familia`} />
                                  </span>
                                </div>

                                {/* Botón eliminar (sin Link + a) */}
                                <button
                                  type="button"
                                  onClick={() => remove(index)}
                                  className={styles.buttonDelete}
                                  aria-label="Eliminar integrante"
                                >
                                  <svg className={styles.iconDelete}>
                                    <use href="/img/sprite.svg#icon-cross"></use>
                                  </svg>
                                </button>
                              </fieldset>
                            </Fragment>
                          ))}
                        </Fragment>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          push({
                            nombre_familia: '',
                            apellido_familia: '',
                            fecha_nacimiento_familia: '',
                            sexo: '',
                            parentesco: '',
                            dni_familia: '',
                            talle: [],
                            kit_escolar: [],
                            documentacion: [],
                          })
                        }
                        className={`btn btnInfo ${styles.mainBoton}`}
                      >
                        Agregar Familiar Nuevo
                      </button>
                    </Fragment>
                  )}
                </FieldArray>

                <span className="errorMessageMedium">{generalError}</span>

                <div className={styles.submittingButton}>
                  <button
                    onClick={() => { setGeneralError("") }}
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btnExploring alignSelfCenter"
                  >
                    {isSubmitting ? "Enviando" : "Enviar"}
                  </button>
                  {isSubmitting ? (
                    <Image src="/img/loading.gif" alt="loading" width={50} height={50} />
                  ) : null}
                </div>
              </Form>
            </div>
          </Layout>
        </div>
      )}
    </Formik>
  );
};

export default AddEmployee;