import React, { useEffect, useState, useContext, Fragment } from 'react';
import Select from 'react-select';
// import SelectMui from '@material-ui/core/Select';
// import FormControl from '@material-ui/core/FormControl';
// import MenuItem from '@material-ui/core/MenuItem';
// import InputLabel from '@material-ui/core/InputLabel';
import { makeStyles } from '@material-ui/core/styles';

import Image from 'next/image';
import Layout from "../components/layout/Layout";
import { useRouter } from 'next/router';
import Link from "next/link";
import { capitalizeFirstLetter, numberWithPoint } from "../components/helpers/formHelper";

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
// const useStyles2 = makeStyles((theme) => ({
//     formControl: {
//         margin: theme.spacing(1),
//         minWidth: 120,
//     }
// }));

const AddEmployee = () => {
    // const classes2 = useStyles2();
    const dispatch = useDispatch();
    const router = useRouter();
    const [maritalStatusTypes, updateMaritalStatusTypes] = useState("");
    const [section, setSection] = useState("");
    const [generalError, setGeneralError] = useState("");
    const [legajo, setLegajo] = useState("");
    const [empresa, setEmpresa] = useState("");

    //UseSelector
    const loading = useSelector(state => state.employees.loading);
    const employeesSelector = useSelector(state => state.employees.employees);

    const companiesSelector = useSelector(state => state.companies.companies);
    // const companiesSelect = companiesSelector.map(company => ({
    //     label: company.nombre,
    //     value: {
    //         id: company.id,
    //         nombre: company.nombre,
    //         ciudad: company.ciudad,
    //         calle: company.calle,
    //         numero_calle: company.numero_calle,
    //         cuit: company.cuit,
    //     }
    // }));
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
    const AddEmployeeDispatch = (employee, firebase) => dispatch(addEmployeeAction(employee, firebase));

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
        updateMaritalStatusTypes(maritalStatusSelect);
    }, [dispatch]);

    useEffect(() => {
        getLastWorker();
    }, [employeesSelector])

    useEffect(() => {
        const loadCategories = (firebase, section) => { dispatch(getCategoriesAction(firebase, section)) }
        loadCategories(firebase, section);
    }, [section])

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
        setLegajo(empleadoMaximo.nroLegajo);
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
        nacionalidad: 'Argentina',
        estado_civil: '',
        entregado: { checked: false, anio: new Date().getFullYear() },
        documentacion: [],
        email: '',
        telefono: '',
        // nroLegajo: legajo,
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
                // documentacion: [] //Sujeto a revision del cliente.
            }
        ]
    };

    // const validateFamilia = (familia) => {
    //     if (familia.length <= 1) {
    //         if (
    //             !familia[0].nombre_familia || !familia[0].apellido_familia ||
    //             !familia[0].dni_familia || !familia[0].fecha_nacimiento_familia ||
    //             !familia[0].sexo || !familia[0].parentesco) {
    //             return false;
    //         } else { return true; }
    //     } else { return true; }
    // }

    return (<>
        <Formik
            initialValues={EmptyObject}
            onSubmit={(values, { resetForm, setSubmitting }) => {
                const found = employeesSelector.find(emp => (emp.dni === values.dni || emp.nroLegajo === values.nroLegajo));
                setSubmitting(true);
                if (!found) {
                    setTimeout(() => {
                        values.estado = "Activo";
                        values.fecha_creacion = new Date();
                        values.usuario_creacion = user.uid;
                        // if (!validateFamilia(values.familia)) {
                        //     values.familia = null;
                        // }
                        AddEmployeeDispatch(values, firebase);
                        // setGeneralError("");
                        // resetForm({
                        //     values: EmptyObject,
                        // });
                        setSubmitting(false);
                        router.push("/generalWorkerList");
                        //router.push("/generalWorkerList", undefined, { shallow: true })
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
                    {console.log(values)}
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
                                            value={capitalizeFirstLetter(values.apellido)}
                                        ></Field>
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
                                    {/* <div className={styles.formControl}>
                                        <label>Nro Legajo</label>
                                        <Field
                                            type="number"
                                            className="inputSecondary"
                                            name="nroLegajo"
                                            placeholder="Nro Legajo"
                                            disabled={true}
                                            value={values.nroLegajo = (legajo || 0) + 1}
                                        ></Field>
                                        {touched.nroLegajo && errors.nroLegajo && <p className="errorMessage">{errors.nroLegajo}</p>}
                                    </div> */}
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
                                            placeholder={"Seleccione un frigorífico"}
                                            onChange={option => setFieldValue("empresa", option)}
                                            onBlur={option => setFieldTouched("empresa", option)}
                                        ></Select>
                                        {touched.empresa && errors.empresa && <span className="errorMessage">{errors.empresa}</span>}
                                    </div>
                                    {/* <FormControl className={classes2.formControl}>
                                        <InputLabel id="demo-controlled-open-select-label">Empresa</InputLabel>
                                        <SelectMui
                                            labelId="demo-controlled-open-select-label"
                                            id="demo-controlled-open-select"
                                            name="empresa"
                                            placeholder="Seleccione un frigorifico"
                                            // onChange={option => setEmpresa(option.target.value)}
                                            onChange={option => setFieldValue("empresa", option.target.value)}
                                            onBlur={option => setFieldTouched("empresa", option.target.value)}
                                        >
                                            {companiesSelect.map(obj =>
                                                <MenuItem value={obj.value}>{obj.label}</MenuItem>
                                            )}
                                        </SelectMui>
                                        {touched.empresa && errors.empresa && <span className="errorMessage">{errors.empresa}</span>}
                                    </FormControl> */}
                                </fieldset>
                                <FieldArray name="familia">
                                    {({ push, remove }) => (
                                        <Fragment>
                                            {values.familia.length > 0 ?
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

                                                </Fragment> : null}
                                            <button type="button" onClick={() => push({
                                                nombre_familia: '', apellido_familia: '',
                                                fecha_nacimiento_familia: '', sexo: '', parentesco: '',
                                                dni_familia: '',
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