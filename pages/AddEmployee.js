import React, { useEffect, useState, useContext, Fragment } from 'react';
import Select from 'react-select';
import Image from 'next/image';
import Layout from "../components/layout/Layout";
import { useRouter } from 'next/router';
import Link from "next/link";

//Styles
import styles from "./css/AddEmployee.module.scss";

//Import Data
import relationshipSelect from "../components/data/relationship.json";
import sexSelect from "../components/data/sexo.json";

//Data
import maritalStatusSelect from "../components/data/maritalStatus.json";

//Redux
import { useDispatch, useSelector } from "react-redux";
import { updatePathnameAction } from "../components/redux/actions/GeneralActions";
import { getCompaniesAction } from "../components/redux/actions/CompanyActions";
import { addEmployeeAction, getEmployeesAction } from "../components/redux/actions/EmployeeActions";
import { getSectionsAction, getCategoriesAction } from "../components/redux/actions/SectionActions";

//Firebase
import { FirebaseContext } from "../firebase";

//Formik
import { Formik, Field, Form, FieldArray, getIn, ErrorMessage } from "formik";
import validation from "../validation/addEmployeeValidate";
import { object, array, number, string, boolean } from "yup";

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
    //UseSelector
    const loading = useSelector(state => state.employees.loading);
    const employeesSelector = useSelector(state => state.employees.employees);
    const companiesSelector = useSelector(state => state.companies.companies);
    const companiesSelect = companiesSelector.map(company => ({
        id: company.id,
        value: company.id,
        label: company.nombre,
        nombre: company.nombre,
        ciudad: company.ciudad,
        domicilio: company.domicilio
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
    const { firebase } = useContext(FirebaseContext);
    const AddEmployeeDispatch = (employee, firebase) => dispatch(addEmployeeAction(employee, firebase));

    useEffect(() => {
        const currentPathname = router.pathname;
        const loadPathname = getPathName => { dispatch(updatePathnameAction(getPathName)) }
        loadPathname(currentPathname);
        const loadCompanies = (firebase) => { dispatch(getCompaniesAction(firebase)) }
        loadCompanies(firebase);
        const loadSections = (firebase) => { dispatch(getSectionsAction(firebase)) }
        loadSections(firebase);
        const loadEmployees = (firebase) => dispatch(getEmployeesAction(firebase));
        loadEmployees(firebase);

        updateMaritalStatusTypes(maritalStatusSelect);
    }, [dispatch]);

    useEffect(() => {
        const loadCategories = (firebase, section) => { dispatch(getCategoriesAction(firebase, section)) }
        loadCategories(firebase, section);
    }, [section])

    let EmptyObject = {
        nombre: '',
        apellido: '',
        ciudad: '',
        domicilio: '',
        codigo_postal: '',
        dni: '',
        fecha_nacimiento: '',
        nacionalidad: 'Argentina',
        estado_civil: '',
        email: '',
        telefono: '',
        nroLegajo: '',
        fecha_ingreso: '',
        seccion: {},
        categoria: {},
        empresa: {},
        familia: [
            {
                talle: [],
                kit_escolar: []
            }
        ]
    };

    return (<>
        <Formik
            initialValues={EmptyObject}
            onSubmit={(values, { resetForm, setSubmitting }) => {
                const found = employeesSelector.find(emp => (emp.dni === values.dni || emp.nroLegajo === values.nroLegajo));
                setSubmitting(true);
                if (!found) {
                    setTimeout(() => {
                        values.estado = "Activo";
                        AddEmployeeDispatch(values, firebase);
                        setGeneralError("");
                        resetForm({
                            values: EmptyObject,
                        });
                        setSubmitting(false);
                    }, 1000);
                } else {
                    setTimeout(() => {
                        setGeneralError("Ya existe un empleado con ese dni y/o nro de afiliado.")
                        setSubmitting(false);
                    }, 1000);
                }
                // router.push("/employees");
            }}
            validate={validation}
            validationSchema={object({
                familia: array(object({
                    nombre_familia: string().required("Ingrese el nombre!"),
                    apellido_familia: string().required("Ingrese el apellido!"),
                    dni_familia: number().required("Ingrese el DNI!")
                        .min(999999, "El mínimo son 7 dígitos")
                        .max(999999999, "El máximo son 10 dígitos"),
                    fecha_nacimiento_familia: string().required("Ingrese la fecha de nacimiento!"),
                    sexo: string().required("Seleccione el sexo"),
                    parentesco: string().required("Seleccione el parentesco"),
                }))
            })}
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
                                            value={values.nombre}
                                        ></Field>
                                        {touched.nombre && errors.nombre && <span className="errorMessage">{errors.nombre}</span>}
                                    </div>
                                    <div className={styles.formControl}>
                                        <label>Apellido</label>
                                        <Field
                                            type="text"
                                            className="inputSecondary"
                                            name="apellido"
                                            placeholder="Apellido"
                                            value={values.apellido}
                                        ></Field>
                                        {touched.apellido && errors.apellido && <p className="errorMessage">{errors.apellido}</p>}
                                    </div>
                                    <div className={styles.formControl}>
                                        <label>Domicilio</label>
                                        <Field
                                            type="text"
                                            className="inputSecondary"
                                            name="domicilio"
                                            placeholder="Domicilio"
                                            value={values.domicilio}
                                        ></Field>
                                        {touched.domicilio && errors.domicilio && <span className="errorMessage">{errors.domicilio}</span>}
                                    </div>
                                    <div className={styles.formControl}>
                                        <label>Ciudad</label>
                                        <Field
                                            type="text"
                                            className="inputSecondary"
                                            name="ciudad"
                                            placeholder="Ciudad"
                                            value={values.ciudad}
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
                                            value={values.codigo_postal}
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
                                            value={values.dni}
                                        ></Field>
                                        {touched.dni && errors.dni && <span className="errorMessage">{errors.dni}</span>}
                                    </div>
                                    <div className={styles.formControl}>
                                        <label>Fecha de Nacimiento</label>
                                        <Field
                                            type="date"
                                            className="inputSecondary"
                                            name="fecha_nacimiento"
                                            placeholder="Fecha de nacimiento"
                                            value={values.fecha_nacimiento}
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
                                            value={values.nacionalidad}
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
                                            value={values.email}
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
                                            value={values.telefono}
                                        ></Field>
                                        {touched.telefono && errors.telefono && <span className="errorMessage">{errors.telefono}</span>}
                                    </div>
                                </fieldset>
                                <fieldset className={styles.flexFormEmpresa}>
                                    <legend>Información relacionada a la Empresa</legend>
                                    <div className={styles.formControl}>
                                        <label>Nro Legajo</label>
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
                                        <label>Fecha de Ingreso</label>
                                        <Field
                                            type="date"
                                            className="inputSecondary"
                                            name="fecha_ingreso"
                                            placeholder="Fecha de Ingreso"
                                            value={values.fecha_ingreso}
                                        ></Field>
                                        {touched.fecha_ingreso && errors.fecha_ingreso && <span className="errorMessage">{errors.fecha_ingreso}</span>}
                                    </div>
                                    <div className={styles.formControl}>
                                        <label>Sección</label>
                                        <Select
                                            className={`inputSecondary ` + styles.myselect}
                                            options={sectionsSelect}
                                            name="seccion"
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
                                            placeholder={"Seleccione una Categoría"}
                                            onChange={option => setFieldValue("categoria", option)}
                                            onBlur={option => setFieldTouched("categoria", option)}
                                        ></Select>
                                        {touched.categoria && errors.categoria && <span className="errorMessage">{errors.categoria}</span>}
                                    </div>
                                    <div className={styles.formControl}>
                                        <label>Empresa</label>
                                        <Select
                                            className={`inputSecondary ` + styles.myselect}
                                            options={companiesSelect}
                                            name="empresa"
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
                                                            <span className="errorMessage"><ErrorMessageArray name={`familia[.${index}.]nombre_familia`}></ErrorMessageArray></span>
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
                                                                // onChange={e => setRelationshipFamily(e.label)}
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
                                                                // onChange={e => setSexFamily(e.value)}
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
                                                                    <use id={index} xlinkHref="img/sprite.svg#icon-cross"></use>
                                                                </svg>
                                                            </a>
                                                        </Link>
                                                    </fieldset>
                                                </Fragment>
                                            ))}
                                            <button type="button" onClick={() => push({
                                                nombre_familia: '', apellido_familia: '',
                                                fecha_nacimiento_familia: '', sexo: '', parentesco: '', dni_familia: ''
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
                                    >{isSubmitting ? "Enviando" : "Enviar"}</button>
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
    </>);
}

export default AddEmployee;