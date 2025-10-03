// pages/employees/[id].js
import React, { Fragment, memo, useContext, useEffect, useState } from 'react';
import styles from "../css/[id].module.scss";
import { useDispatch, useSelector } from "react-redux";
import { editEmployeeAction, addEmployeeAction, getEmployeesAction } from "../../components/redux/actions/EmployeeActions";
import { getSectionsAction, getCategoriesAction } from "../../components/redux/actions/SectionActions";
import Select from 'react-select';
import { useRouter } from "next/router";
import Image from 'next/image';
import { getCompaniesAction } from "../../components/redux/actions/CompanyActions";
import { capitalizeFirstLetter } from "../../components/helpers/formHelper";

// Import Data
import relationshipSelect from "../../components/data/relationship.json";
import sexSelect from "../../components/data/sexo.json";

// Firebase
import { FirebaseContext } from "../../firebase";
import Layout from '../../components/layout/Layout';

// Formik
import { Formik, Field, Form, FieldArray, getIn } from "formik";
import validation from "../../validation/addEmployeeValidate.js";

// MUI
import Button from '@mui/material/Button';

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

const EditEmployee = memo(() => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [url, setUrl] = useState();
  const [maritalStatusTypes, updateMaritalStatusTypes] = useState("");
  const [section, setSection] = useState("");
  const [generalError, setGeneralError] = useState("");

  // UseSelector
  const companiesSelector = useSelector(state => state.companies.companies);
  const employeeToEdit = useSelector(state => state.employees.employeeToEdit);
  const sectionsSelector = useSelector(state => state.sections.sections);
  const categoriesSelector = useSelector(state => state.sections.categories);

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

  const sectionsSelect = sectionsSelector.map(section => ({
    id: section.codigo,
    value: section.codigo,
    label: section.nombre
  }));

  const categoriesSelect = categoriesSelector.map(category => ({
    id: category.codigo,
    value: category.codigo,
    label: category.nombre
  }));

  // Firebase
  const { user } = useContext(FirebaseContext);

  useEffect(() => {
    dispatch(getCompaniesAction());
    dispatch(getSectionsAction());
    dispatch(getEmployeesAction());
    getUrl();
    updateMaritalStatusTypes(require("../../components/data/maritalStatus.json"));
  }, [dispatch]);

  useEffect(() => {
    if (section) dispatch(getCategoriesAction(section));
  }, [section, dispatch]);

  const getUrl = () => {
    let documentacionurl = "";
    if (employeeToEdit && employeeToEdit.documentacion) {
      employeeToEdit.documentacion.forEach(doc => {
        if (doc.anio === new Date().getFullYear() && doc.tipo === "Ficha Trabajador") {
          documentacionurl = doc.url;
        }
      });
    }
    setUrl(documentacionurl);
  };

  return (
    <>
      {employeeToEdit ? (
        <Formik
          initialValues={employeeToEdit}
          onSubmit={(values, { setSubmitting }) => {
            const oldCompany = employeeToEdit.empresa.nombre;
            const newCompany = values.empresa.nombre;
            if (oldCompany && oldCompany !== newCompany) {
              const currentDay = new Date();
              if (!values.fechas_cambio_empresa) values.fechas_cambio_empresa = [];
              values.fechas_cambio_empresa.push({
                fecha: currentDay,
                anterior_empresa: oldCompany,
                nueva_empresa: newCompany
              });
            }
            setSubmitting(true);
            setTimeout(() => {
              values.fecha_ultima_modificacion = new Date();
              values.usuario_ultima_modificacion = user && user.uid;
              dispatch(editEmployeeAction(values));
              setSubmitting(false);
              router.push("/generalWorkerList");
            }, 2000);
          }}
          validate={validation}
        >
          {({ values, errors, touched, isSubmitting, setFieldValue, setFieldTouched }) => (
            <div>
              <Layout>
                <div className={styles.container}>
                  {url ? (
                    <div className={styles.fichaButton}>
                      <Button
                        variant="contained"
                        color="primary"
                        component="a"
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          bgcolor: 'rgb(86, 7, 138)',
                          '&:hover': { bgcolor: 'rgba(86, 7, 138, 0.7)' }
                        }}
                      >
                        Ver Ficha de Afiliacion
                      </Button>
                    </div>
                  ) : null}

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
                          className={`inputSecondary ` + styles.myselect}
                          name="estado_civil"
                          options={maritalStatusTypes}
                          placeholder={"Estado Civil"}
                          value={{ label: values.estado_civil }}
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
                          className={`inputSecondary ` + styles.myselect}
                          options={sectionsSelect}
                          name="seccion"
                          value={{ label: values.seccion.label }}
                          placeholder={"Seleccione una Sección"}
                          onChange={(option) => {
                            setFieldValue("seccion", option);
                            setSection({
                              "codigo_seccion": option.value,
                              "nombre_seccion": option.label,
                            });
                          }}
                          onBlur={option => setFieldTouched("seccion", option)}
                        />
                        {touched.seccion && errors.seccion && <span className="errorMessage">{errors.seccion}</span>}
                      </div>

                      <div className={styles.formControl}>
                        <label>Categoría</label>
                        <Select
                          className={`inputSecondary ` + styles.myselect}
                          options={categoriesSelect}
                          name="categoria"
                          value={{ label: values.categoria.label }}
                          placeholder={"Seleccione una Categoría"}
                          onChange={option => setFieldValue("categoria", option)}
                          onBlur={option => setFieldTouched("categoria", option)}
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
                        {touched.fecha_ingreso_empresa && errors.fecha_ingreso_empresa && <span className="errorMessage">{errors.fecha_ingreso_empresa}</span>}
                      </div>

                      <div className={styles.formControl}>
                        <label>Empresa</label>
                        <Select
                          className={`inputSecondary ` + styles.myselect}
                          options={companiesSelect}
                          name="empresa"
                          value={{ label: values.empresa.label }}
                          placeholder={"Seleccione un frigorífico"}
                          onChange={option => setFieldValue("empresa", option)}
                          onBlur={option => setFieldTouched("empresa", option)}
                        />
                        {touched.empresa && errors.empresa && <span className="errorMessage">{errors.empresa}</span>}
                      </div>
                    </fieldset>

                    <FieldArray name="familia">
                      {({ push, remove }) => (
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
                                    className={`inputSecondary ` + styles.myselect}
                                    options={relationshipSelect}
                                    name={`familia[.${index}.]parentesco`}
                                    value={{ label: values.familia[index].parentesco }}
                                    placeholder={"Parentesco"}
                                    onChange={option => setFieldValue(`familia[.${index}.]parentesco`, option.label)}
                                    onBlur={option => setFieldTouched(`familia[.${index}.]parentesco`, option.label)}
                                  />
                                  <span className="errorMessage">
                                    <ErrorMessageArraySelect name={`familia[.${index}.]parentesco`} />
                                  </span>
                                </div>

                                <div className={styles.formControl}>
                                  <label>Sexo</label>
                                  <Select
                                    className={`inputSecondary ` + styles.myselect}
                                    options={sexSelect}
                                    name={`familia[.${index}.]sexo`}
                                    value={{ label: values.familia[index].sexo }}
                                    placeholder={"Sexo"}
                                    onChange={option => setFieldValue(`familia[.${index}.]sexo`, option.label)}
                                    onBlur={option => setFieldTouched(`familia[.${index}.]sexo`, option.label)}
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
                                    className={`inputSecondary`}
                                    name={`familia[.${index}.]dni_familia`}
                                    placeholder="DNI"
                                  />
                                  <span className="errorMessage">
                                    <ErrorMessageArray name={`familia[.${index}.]dni_familia`} />
                                  </span>
                                </div>

                                {/* Antes estaba <Link><a>...</a></Link>, lo cambiamos por button */}
                                <button
                                  type="button"
                                  id={index}
                                  onClick={() => remove(index)}
                                  className={styles.buttonDelete}
                                  aria-label="Eliminar integrante"
                                >
                                  <svg id={index} className={styles.iconDelete}>
                                    <use id={index} href="/img/sprite.svg#icon-cross"></use>
                                  </svg>
                                </button>
                              </fieldset>
                            </Fragment>
                          ))}

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
                                documentacion: []
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
                        className={`btn btnExploring alignSelfCenter`}
                      >
                        {isSubmitting ? "Guardando cambios" : "Guardar cambios"}
                      </button>

                      {isSubmitting ? (
                        <Image
                          src="/img/loading.gif"
                          alt="loading"
                          width={50}
                          height={50}
                        />
                      ) : null}
                    </div>
                  </Form>
                </div>
              </Layout>
            </div>
          )}
        </Formik>
      ) : (
        <span className="errorMessage">Something went wrong</span>
      )}
    </>
  );
});

export default EditEmployee;