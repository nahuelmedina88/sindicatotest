import React, { Fragment, memo, useContext, useEffect, useState } from 'react';
import styles from "../css/[id].module.scss";
import { useDispatch, useSelector } from "react-redux";
import { editEmployeeAction } from "../../components/redux/actions/EmployeeActions";
// import { updatePathnameAction } from "../../components/redux/actions/GeneralActions";
import { addEmployeeAction, getEmployeesAction } from "../../components/redux/actions/EmployeeActions";
import { getSectionsAction, getCategoriesAction } from "../../components/redux/actions/SectionActions";
import Select from 'react-select';
// import { useHistory } from "react-router-dom";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from 'next/image';
import { getCompaniesAction } from "../../components/redux/actions/CompanyActions";
// import history from "../history";
import { capitalizeFirstLetter } from "../../components/helpers/formHelper";

//Import Data
import relationshipSelect from "../../components/data/relationship.json";
import sexSelect from "../../components/data/sexo.json";

//Firebase
import { FirebaseContext } from "../../firebase";
import Layout from '../../components/layout/Layout';
//Formik
import { Formik, Field, Form, FieldArray, getIn, ErrorMessage } from "formik";
import validation from "../../validation/addEmployeeValidate.js"
import { object, array, number, string, boolean } from "yup";
//Data
import maritalStatusSelect from "../../components/data/maritalStatus.json";
import { date } from 'yup/lib/locale';
//Material UI
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    buttonPurple: {
        backgroundColor: "rgb(86, 7, 138)",
        color: "#fff",
        "&:hover": {
            backgroundColor: "rgb(86, 7, 138,0.7)",
        }
    },
});

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
    const classes = useStyles();
    const dispatch = useDispatch();
    const router = useRouter();
    const [employee, setEmployee] = useState({});
    const [url, setUrl] = useState();
    const [maritalStatusTypes, updateMaritalStatusTypes] = useState("");
    const [section, setSection] = useState("");
    const [generalError, setGeneralError] = useState("");
    //UseSelector
    const employeesSelector = useSelector(state => state.employees.employees);
    const companiesSelector = useSelector(state => state.companies.companies);
    const employeeToEdit = useSelector(state => state.employees.employeeToEdit);

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

    //Firebase
    const { firebase, user } = useContext(FirebaseContext);

    useEffect(() => {
        // const currentPathname = router.pathname;
        // const loadPathname = getPathName => { dispatch(updatePathnameAction(getPathName)) }
        // loadPathname(currentPathname);
        const loadCompanies = (firebase) => { dispatch(getCompaniesAction(firebase)) }
        loadCompanies(firebase);
        const loadSections = (firebase) => { dispatch(getSectionsAction(firebase)) }
        loadSections(firebase);
        const loadEmployees = (firebase) => dispatch(getEmployeesAction(firebase));
        loadEmployees(firebase);
        getUrl();
        updateMaritalStatusTypes(maritalStatusSelect);
        // }, [dispatch]);
    }, []);

    useEffect(() => {
        const loadCategories = (firebase, section) => { dispatch(getCategoriesAction(firebase, section)) }
        loadCategories(firebase, section);
    }, [section]);

    const getUrl = () => {
        let documentacionurl = "";
        employeeToEdit.documentacion.map(doc => {
            if (doc.anio === new Date().getFullYear() &&
                doc.tipo === "Ficha Trabajador") {
                documentacionurl = doc.url;
            }
        })
        setUrl(documentacionurl);
    }

    let EmptyObject = {
        nombre: '',
        apellido: '',
        ciudad: '',
        calle: '',
        numero_calle: '',
        codigo_postal: '',
        dni: '',
        cuil: '',
        fecha_nacimiento: '',
        nacionalidad: '',
        estado_civil: '',
        email: '',
        telefono: '',
        nroLegajo: '',
        nro_legajo_empresa: '',
        fecha_ingreso: '',
        seccion: {},
        categoria: {},
        empresa: {},
        familia: []
    };

    return (<>
        {employeeToEdit ?
            <Formik
                initialValues={employeeToEdit}
                onSubmit={(values, { setSubmitting }) => {
                    //const found = employeesSelector.find(emp => (emp.dni === values.dni || emp.nroLegajo === values.nroLegajo));
                    let oldCompany = employeeToEdit.empresa.nombre;
                    let newCompany = values.empresa.nombre;
                    if (oldCompany && oldCompany !== newCompany) {
                        let currentDay = new Date();
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
                        values.usuario_ultima_modificacion = user.uid;
                        values && dispatch(editEmployeeAction(values, firebase));
                        setSubmitting(false);
                        router.push("/generalWorkerList");
                    }, 2000);
                }}
                validate={validation}
            // validationSchema={object({
            //     familia: array(object({
            //         nombre_familia: string().required("Ingrese el nombre!"),
            //         apellido_familia: string().required("Ingrese el apellido!"),
            //         dni_familia: number().required("Ingrese el DNI!")
            //             .min(999999, "El mínimo son 7 dígitos")
            //             .max(999999999, "El máximo son 10 dígitos"),
            //         fecha_nacimiento_familia: string().required("Ingrese la fecha de nacimiento!"),
            //         sexo: string().required("Seleccione el sexo"),
            //         parentesco: string().required("Seleccione el parentesco"),
            //     }))
            // })}
            >
                {({ values, errors, touched, isSubmitting, setFieldValue, setFieldTouched }) => (
                    <div>
                        <Layout>

                            <div className={styles.container}>
                                {url ?
                                    <div className={styles.fichaButton}>
                                        <a target="_blank"
                                            href={url}
                                            rel="noopener noreferrer">
                                            <Button variant="contained"
                                                color="primary"
                                                className={`${classes.buttonPurple}`}
                                            >Ver Ficha de Afiliacion
                                        </Button>
                                        </a>
                                    </div>
                                    : null
                                }
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
                                            ></Field>
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
                                            ></Field>
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
                                            ></Field>
                                            {touched.ciudad && errors.ciudad && <span className="errorMessage">{errors.ciudad}</span>}
                                        </div>
                                        <div className={styles.formControl}>
                                            <label>Código Postal</label>
                                            <Field
                                                type="text"
                                                className="inputSecondary"
                                                name="codigo_postal"
                                                placeholder="Codigo Postal"
                                            ></Field>
                                            {touched.codigo_postal && errors.codigo_postal && <span className="errorMessage">{errors.codigo_postal}</span>}
                                        </div>
                                        <div className={styles.formControl}>
                                            <label>DNI</label>
                                            <Field
                                                type="number"
                                                className={`inputSecondary`}
                                                name="dni"
                                                placeholder="DNI"
                                            ></Field>
                                            {touched.dni && errors.dni && <span className="errorMessage">{errors.dni}</span>}
                                        </div>
                                        <div className={styles.formControl}>
                                            <label>CUIL</label>
                                            <Field
                                                type="number"
                                                className={`inputSecondary`}
                                                name="cuil"
                                                placeholder="CUIL"
                                                value={values.cuil}
                                            ></Field>
                                            {touched.cuil && errors.cuil && <span className="errorMessage">{errors.cuil}</span>}
                                        </div>
                                        <div className={styles.formControl}>
                                            <label>Fecha de Nacimiento</label>
                                            <Field
                                                type="date"
                                                className="inputSecondary"
                                                name="fecha_nacimiento"
                                                placeholder="Fecha de nacimiento"
                                            ></Field>
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
                                            ></Field>
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
                                            ></Select>
                                            {touched.estado_civil && errors.estado_civil && <span className="errorMessage">{errors.estado_civil}</span>}
                                        </div>
                                        <div className={styles.formControl}>
                                            <label>Email</label>
                                            <Field
                                                type="email"
                                                className="inputSecondary"
                                                name="email"
                                                placeholder="Email"
                                            ></Field>
                                            {touched.email && errors.email && <span className="errorMessage">{errors.email}</span>}
                                        </div>
                                        <div className={styles.formControl}>
                                            <label>Nro de Teléfono</label>
                                            <Field
                                                type="text"
                                                className="inputSecondary"
                                                name="telefono"
                                                placeholder="Número de teléfono"
                                            ></Field>
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
                                            ></Field>
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
                                            ></Field>
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
                                            ></Field>
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
                                                onChange={
                                                    option => {
                                                        setFieldValue("seccion", option);
                                                        setSection({
                                                            "codigo_seccion": option.value,
                                                            "nombre_seccion": option.label,
                                                        });
                                                    }
                                                }
                                                onBlur={option => setFieldTouched("seccion", option)}
                                            ></Select>
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
                                            ></Select>
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
                                            ></Field>
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
                                            ></Select>
                                            {touched.empresa && errors.empresa && <span className="errorMessage">{errors.empresa}</span>}
                                        </div>
                                    </fieldset>
                                    <FieldArray name="familia">
                                        {({ push, remove }) => (
                                            <Fragment>
                                                {values.familia.map((_, index) => (
                                                    <Fragment>
                                                        <fieldset className={styles.flexFormFamilia}>
                                                            <legend>Nuevo Integrante Familiar</legend>
                                                            <div className={styles.formControl}>
                                                                <label>Nombre</label>
                                                                <Field
                                                                    type="text"
                                                                    className="inputSecondary"
                                                                    name={`familia[.${index}.]nombre_familia`}
                                                                    placeholder="Nombre"
                                                                ></Field>
                                                                <span className="errorMessage">
                                                                    <ErrorMessageArray name={`familia[.${index}.]nombre_familia`}></ErrorMessageArray>
                                                                </span>
                                                            </div>
                                                            <div className={styles.formControl}>
                                                                <label>Apellido</label>
                                                                <Field
                                                                    type="text"
                                                                    className="inputSecondary"
                                                                    name={`familia[.${index}.]apellido_familia`}
                                                                    placeholder="Apellido"
                                                                ></Field>
                                                                <span className="errorMessage"><ErrorMessageArray name={`familia[.${index}.]apellido_familia`}></ErrorMessageArray></span>
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
                                                                ></Select>
                                                                <span className="errorMessage"><ErrorMessageArraySelect name={`familia[.${index}.]parentesco`}></ErrorMessageArraySelect></span>
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
                                                                ></Select>
                                                                <span className="errorMessage"><ErrorMessageArraySelect name={`familia[.${index}.]sexo`}></ErrorMessageArraySelect></span>
                                                            </div>
                                                            <div className={styles.formControl}>
                                                                <label>Fecha de Nacimiento</label>
                                                                <Field
                                                                    type="date"
                                                                    className="inputSecondary"
                                                                    name={`familia[.${index}.]fecha_nacimiento_familia`}
                                                                    placeholder="Fecha de nacimiento"
                                                                ></Field>
                                                                <span className="errorMessage"><ErrorMessageArray name={`familia[.${index}.]fecha_nacimiento_familia`}></ErrorMessageArray></span>
                                                            </div>
                                                            <div className={styles.formControl}>
                                                                <label>DNI</label>
                                                                <Field
                                                                    type="number"
                                                                    className={`inputSecondary`}
                                                                    name={`familia[.${index}.]dni_familia`}
                                                                    placeholder="DNI"
                                                                ></Field>
                                                                <span className="errorMessage"><ErrorMessageArray name={`familia[.${index}.]dni_familia`}></ErrorMessageArray></span>
                                                            </div>
                                                            <Link href="#">
                                                                <a id={index} onClick={() => remove(index)} className={styles.buttonDelete}>
                                                                    <svg id={index} className={styles.iconDelete} >
                                                                        <use id={index} xlinkHref="../img/sprite.svg#icon-cross"></use>
                                                                    </svg>
                                                                </a>
                                                            </Link>
                                                        </fieldset>
                                                    </Fragment>
                                                ))}
                                                <button type="button" onClick={() => push({
                                                    nombre_familia: '', apellido_familia: '',
                                                    fecha_nacimiento_familia: '', sexo: '',
                                                    parentesco: '', dni_familia: '',
                                                    talle: [], kit_escolar: [], documentacion: []
                                                })}
                                                    className={`btn btnInfo ${styles.mainBoton}`}>Agregar Familiar Nuevo</button>
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
                                        >{isSubmitting ? "Guardando cambios" : "Guardar cambios"}</button>
                                        {isSubmitting ? <Image
                                            src="/img/loading.gif"
                                            alt="loading"
                                            width={50}
                                            height={50}
                                        ></Image> : null}
                                    </div>
                                </Form>
                            </div>
                        </Layout>
                        {/* <pre>{JSON.stringify(values, null, 2)}</pre>
                    <pre>   {JSON.stringify(errors, null, 2)}</pre> */}
                    </div>
                )}
            </Formik>
            : <span className="errorMessage">Something went wrong</span>}
        {/* <Fragment><pre> employeeedit  {JSON.stringify(employeeToEdit, null, 2)}</pre>
        </Fragment> */}
    </>);
})

export default EditEmployee;