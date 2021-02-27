import React, { useEffect, useState, useContext } from 'react';
import useValidation from "../hooks/useValidation";
import addEmployeeValidate from "../validation/addEmployeeValidate";
import Select, { components } from 'react-select';
import Layout from "../components/layout/Layout";
import { useRouter } from 'next/router';
//  import Link from "next/link";
import styles from "./css/AddEmployee.module.scss";

import FamilyMemberForm from "./familyMemberForm";

//Data
import maritalStatusSelect from "../components/data/maritalStatus.json";
// import relationshipSelect from "../components/data/relationship.json";
// import sexSelect from "../components/data/sexo.json";

//Redux
import { useDispatch, useSelector } from "react-redux";
import { updatePathnameAction } from "../components/redux/actions/GeneralActions";
import { getCompaniesAction } from "../components/redux/actions/CompanyActions";
import { addEmployeeAction } from "../components/redux/actions/EmployeeActions";
import { getSectionsAction, getCategoriesAction } from "../components/redux/actions/SectionActions";

//Firebase
import { FirebaseContext } from "../firebase";

const AddEmployee = () => {
    const dispatch = useDispatch();
    const router = useRouter();

    const initialState = {
        name: "",
        lastName: "",
        idNumber: "",
        address: "",
        city: "",
        postalcode: "",
        email: "",
        birthdate: "",
        dni: "",
        phone: "",
        nationality: "",
        admissiondate: "",
    }
    // const [errorFamily, setErrorFamily] = useState("");

    //Local State

    const [maritalStatus, updateMaritalStatus] = useState("");

    const [section, setSection] = useState("");
    const [category, setCategory] = useState("");
    // const [relationshipFamily, setRelationshipFamily] = useState("");
    // const [sexFamily, setSexFamily] = useState("");

    const [company, updateCompany] = useState([]);
    const [maritalStatusTypes, updateMaritalStatusTypes] = useState("");


    const [family, setFamily] = useState([]);
    const updateFamily = (newValue) => {
        setFamily(newValue);
    }

    const [buttonFamilyPressed, updateButtonFamilyPressed] = useState(false);

    //inputType Date States
    // const [typeInput, setTypeInput] = useState("text");
    // const [inputTypeAdmission, setTypeInputAdmission] = useState("text");
    // const [inputTypeBirthdateFamily, setTypeInputBirthdateFamily] = useState("text");

    //texto boton estado
    const [textBoton, setTextBoton] = useState("Agregar Grupo Familiar");
    //UseSelector
    const loading = useSelector(state => state.employees.loading);
    // const error = useSelector(state => state.employees.error); 
    const companiesSelector = useSelector(state => state.companies.companies);
    const companiesSelect = companiesSelector.map(company => ({
        id: company.id,
        value: company.id,
        label: company.nombre,
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

        updateMaritalStatusTypes(maritalStatusSelect);
    }, [dispatch]);


    useEffect(() => {
        const loadCategories = (firebase, section) => { dispatch(getCategoriesAction(firebase, section)) }
        loadCategories(firebase, section);
    }, [section])


    const handleCompany = (e) => {
        let empresa = {
            "id": e.id,
            "nombre": e.label,
            "ciudad": e.ciudad,
            "domicilio": e.domicilio
        };

        updateCompany(empresa);
    }

    const handleSection = (e) => {
        let seccion = {
            "codigo_seccion": e.value,
            "nombre_seccion": e.label,
        };
        setSection(seccion);
    }

    const handleCategories = (e) => {
        let category = {
            "codigo_category": e.value,
            "nombre_category": e.label,
        };
        setCategory(category);
    }

    const onClickOpenFamilyForm = e => {
        e.preventDefault();
        buttonFamilyPressed ? updateButtonFamilyPressed(false) : updateButtonFamilyPressed(true);
        !buttonFamilyPressed ? setTextBoton("Ocultar formulario") : setTextBoton("Agregar Grupo Familiar");
    }

    const addEmployeeRedux = () => {
        AddEmployeeDispatch({
            nombre: name,
            apellido: lastName,
            dni: dni,
            domicilio: address,
            ciudad: city,
            codigo_postal: postalcode,
            fecha_nacimiento: birthdate,
            nacionalidad: nationality,
            estado_civil: maritalStatus,
            email: email,
            telefono: phone,
            nroLegajo: idNumber,
            empresa: company,
            fecha_ingreso: admissiondate,
            seccion: section,
            categoria: category,
            familia: family,
        }, firebase);
        router.push("/employees");
    }
    const agregarTrabajador = async () => {
        try {
            addEmployeeRedux();
        } catch (error) {
            console.log(error);
        }
    }

    const {
        values,
        errors,
        submitForm,
        handleSubmit,
        handleChange,
        handleBlur,
        emptyInputs
    } = useValidation(initialState, addEmployeeValidate, agregarTrabajador);

    const { name, lastName, idNumber, address, city, postalcode, dni, birthdate,
        admissiondate, email, phone, nationality } = values

    return (<>
        <Layout>
            <div className={styles.container}>
                <form className={styles.mainForm} onSubmit={handleSubmit}>
                    <fieldset className={styles.flexForm}>
                        <legend>Datos básicos del Trabajador</legend>
                        <div className={styles.formControl}>
                            <label>Nombre</label>
                            <input
                                type="text"
                                className="inputSecondary"
                                name="name"
                                placeholder="Nombre"
                                value={name}
                                // onChange={e => updateName(e.target.value)}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                required
                            />
                            {errors.name && <span className="btn dangerInputSmall">{errors.name}</span>}
                        </div>
                        <div className={styles.formControl}>
                            <label>Apellido</label>
                            <input
                                type="text"
                                className="inputSecondary"
                                name="lastName"
                                placeholder="Apellido"
                                value={lastName}
                                // onChange={e => updateLastName(e.target.value)}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                required
                            />
                            {errors.lastName && <p className="btn dangerInputSmall">{errors.lastName}</p>}
                        </div>
                        <div className={styles.formControl}>
                            <label>Domicilio</label>
                            <input
                                type="text"
                                className="inputSecondary"
                                name="address"
                                placeholder="Domicilio"
                                value={address}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                required
                            />
                            {errors.address && <span className="btn dangerInputSmall">{errors.address}</span>}
                        </div>

                        <div className={styles.formControl}>
                            <label>Ciudad</label>
                            <input
                                type="text"
                                className="inputSecondary"
                                name="city"
                                placeholder="Ciudad"
                                value={city}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                required
                            />
                            {errors.city && <span className="btn dangerInputSmall">{errors.city}</span>}
                        </div>
                        <div className={styles.formControl}>
                            <label>Código Postal</label>
                            <input
                                type="text"
                                className="inputSecondary"
                                name="postalcode"
                                placeholder="Codigo Postal"
                                value={postalcode}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                required
                            />
                            {errors.postalcode && <span className="btn dangerInputSmall">{errors.postalcode}</span>}
                        </div>
                        <div className={styles.formControl}>
                            <label>DNI</label>
                            <input
                                type="number"
                                className={`inputSecondary`}
                                name="dni"
                                placeholder="DNI"
                                value={dni}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                required
                            />
                            {errors.dni && <span className="btn dangerInputSmall">{errors.dni}</span>}
                        </div>
                        <div className={styles.formControl}>
                            <label>Fecha de Nacimiento</label>
                            <input
                                // type={typeInput}
                                type="date"
                                className="inputSecondary"
                                name="birthdate"
                                placeholder="Fecha de nacimiento"
                                value={birthdate}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                // onChange={e => updateBirthdate(e.target.value)}
                                // onFocus={() => !birthdate && setTypeInput("date")}
                                // onBlur={() => !birthdate && setTypeInput("text")}
                                required
                            />
                            {errors.birthdate && <span className="btn dangerInputSmall">{errors.birthdate}</span>}
                        </div>
                        <div className={styles.formControl}>
                            <label>Nacionalidad</label>
                            <input
                                type="text"
                                className="inputSecondary"
                                name="nationality"
                                placeholder="Nacionalidad"
                                value={nationality}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                required
                            />
                            {errors.nationality && <span className="btn dangerInputSmall">{errors.nationality}</span>}
                        </div>
                        <div className={styles.formControl}>
                            <label>Estado Civil</label>
                            <Select
                                className={`inputSecondary ` + styles.myselect}
                                options={maritalStatusTypes}
                                onChange={e => updateMaritalStatus(e.label)}
                                placeholder={"Estado Civil"}
                                required
                            ></Select>
                        </div>
                        <div className={styles.formControl}>
                            <label>Email</label>
                            <input
                                type="email"
                                className="inputSecondary"
                                name="email"
                                placeholder="Email"
                                value={email}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                required
                            />
                            {errors.email && <span className="btn dangerInputSmall">{errors.email}</span>}
                        </div>
                        <div className={styles.formControl}>
                            <label>Nro de Teléfono</label>
                            <input
                                type="text"
                                className="inputSecondary"
                                name="phone"
                                placeholder="Número de teléfono"
                                value={phone}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                required
                            />
                            {errors.phone && <span className="btn dangerInputSmall">{errors.phone}</span>}
                        </div>
                    </fieldset>
                    <fieldset className={styles.flexFormEmpresa}>
                        <legend>Información relacionada a la Empresa</legend>
                        <div className={styles.formControl}>
                            <label>Nro Legajo</label>
                            <input
                                type="number"
                                className="inputSecondary"
                                value={idNumber}
                                // onChange={e => updateIdNumber(Number(e.target.value))}
                                name="idNumber"
                                placeholder="Nro Legajo"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                required
                            />
                            {errors.idNumber && <p className="btn dangerInputSmall">{errors.idNumber}</p>}
                        </div>
                        <div className={styles.formControl}>
                            <label>Fecha de Ingreso</label>
                            <input
                                // type={{inputTypeAdmission}}
                                type="date"
                                className="inputSecondary"
                                name="admissiondate"
                                placeholder="Fecha de Ingreso"
                                value={admissiondate}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            // onChange={e => updateAdmissiondate(e.target.value)}
                            // onFocus={() => !admissiondate && setTypeInputAdmission("date")}
                            // onBlur={() => !admissiondate && setTypeInputAdmission("text")}
                            />
                            {errors.admissiondate && <span className="btn dangerInputSmall">{errors.admissiondate}</span>}
                        </div>
                        <div className={styles.formControl}>
                            <label>Sección</label>
                            <Select
                                className={`inputSecondary ` + styles.myselect}
                                options={sectionsSelect}
                                onChange={handleSection}
                                placeholder={"Seleccione una Sección"}
                            ></Select>
                        </div>
                        <div className={styles.formControl}>
                            <label>Categoría</label>
                            <Select
                                className={`inputSecondary ` + styles.myselect}
                                options={categoriesSelect}
                                onChange={handleCategories}
                                placeholder={"Seleccione una Categoría"}
                            ></Select>
                        </div>
                        <div className={styles.formControl}>
                            <label>Empresa</label>
                            <Select
                                className={`inputSecondary ` + styles.myselect}
                                options={companiesSelect}
                                onChange={handleCompany}
                                placeholder={"Seleccione un frigorífico"}
                            ></Select>
                        </div>
                    </fieldset>
                    <button onClick={onClickOpenFamilyForm}
                        className={`btn btnPrimary ${styles.mainBoton}`}>{textBoton}
                    </button>
                    {buttonFamilyPressed ?
                        <FamilyMemberForm updateFamily={updateFamily} family={family} />
                        : null}
                    <button
                        type="submit"
                        className={`btn btnExploring ${styles.mainBoton}`}
                    >Aceptar</button>
                </form>
                {loading ? <p>Cargando...</p> : null}
                {/* {error ? <p className="alert alert-danger">Hubo un error</p> : null} */}
            </div>

        </Layout>
    </>);
}

export default AddEmployee;