import React, { useState, useEffect, useContext } from 'react';
import Layout from "../components/layout/Layout";
import styles from "./css/AddCompany.module.scss";
import Image from 'next/image';
import { useDispatch, useSelector } from "react-redux";
import { addCompanyAction, getCompaniesAction } from "../components/redux/actions/CompanyActions";
import { useRouter } from 'next/router';
import { updatePathnameAction } from "../components/redux/actions/GeneralActions";
//Firebase
import { FirebaseContext } from "../firebase";
//Formik
import { Formik, Form, Field } from 'formik';
import validation from "../validation/addCompanyValidate";

const AddCompany = () => {
    const dispatch = useDispatch();
    const [generalError, setGeneralError] = useState("");
    const history = useRouter();
    const getPathName = useSelector(state => state.general.pathname);
    const companiesSelector = useSelector(state => state.companies.companies);
    const { user, firebase } = useContext(FirebaseContext);

    const addCompanyDispatch = (employee, firebase) => {
        dispatch(addCompanyAction(employee, firebase));
    }
    useEffect(() => {
        const loadCompanies = (firebase) => { dispatch(getCompaniesAction(firebase)) }
        loadCompanies(firebase);
        const loadPathname = getPathName => { dispatch(updatePathnameAction(getPathName)) }
        loadPathname();
    }, [])

    let EmptyObject = {
        nombre: '',
        ciudad: '',
        domicilio: '',
        cuit: '',
        razonSocial: '',
    }

    return (
        <Formik initialValues={EmptyObject}
            onSubmit={(values, { setSubmitting, resetForm }) => {
                const found = companiesSelector.find(company => (company.cuit === values.cuit || company.razonSocial === values.razonSocial));
                setSubmitting(true);
                if (!found) {
                    setTimeout(() => {
                        addCompanyDispatch(values, firebase);
                        setGeneralError("");
                        resetForm({
                            values: EmptyObject,
                        });
                        setSubmitting(false);
                    }, 1000);
                } else {
                    setTimeout(() => {
                        setGeneralError("Existe una empresa con ese número de CUIT o Razón Social.")
                        setSubmitting(false);
                    }, 1000);
                }
            }}
            validate={validation}
        >
            {({ values, errors, touched, isSubmitting }) => (
                <Layout>
                    <div className={styles.container}>
                        <Form className="form">
                            <fieldset className={styles.flexForm}>
                                <legend>Datos de la Empresa</legend>
                                <div className={styles.formControl}>
                                    <label>Nombre</label>
                                    <Field
                                        type="text"
                                        className="inputSecondary"
                                        name="nombre"
                                        placeholder="Nombre"
                                    ></Field>
                                    {touched.nombre && errors.nombre && <span className="errorMessage">{errors.nombre}</span>}
                                </div>
                                <div className={styles.formControl}>
                                    <label>Ciudad</label>
                                    <Field
                                        type="text"
                                        className="inputSecondary"
                                        name="ciudad"
                                        placeholder="Ciudad"
                                    ></Field>
                                    {touched.ciudad && errors.ciudad && <span className="errorMessage">{errors.ciudad}</span>}
                                </div>
                                <div className={styles.formControl}>
                                    <label>Domicilio</label>
                                    <Field
                                        type="text"
                                        className="inputSecondary"
                                        name="domicilio"
                                        placeholder="Domicilio"
                                    ></Field>
                                    {touched.domicilio && errors.domicilio && <span className="errorMessage">{errors.domicilio}</span>}
                                </div>
                                <div className={styles.formControl}>
                                    <label>CUIT</label>
                                    <Field
                                        type="number"
                                        className="inputSecondary"
                                        name="cuit"
                                        placeholder="CUIT"
                                    ></Field>
                                    {touched.cuit && errors.cuit && <span className="errorMessage">{errors.cuit}</span>}
                                </div>
                                <div className={styles.formControl}>
                                    <label>Razón Social</label>
                                    <Field
                                        type="text"
                                        className="inputSecondary"
                                        name="razonSocial"
                                        placeholder="Razón Social"
                                    ></Field>
                                    {touched.razonSocial && errors.razonSocial && <span className="errorMessage">{errors.razonSocial}</span>}
                                </div>
                            </fieldset>
                            <span className="errorMessageMedium">{generalError}</span>
                            <div className={styles.submittingButton}>
                                <button
                                    onClick={() => setGeneralError("")}
                                    disabled={isSubmitting}
                                    type="submit"
                                    className="btn btnExploring alignSelfCenter"
                                >{isSubmitting ? "Enviando" : "Enviar"}
                                </button>
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
            )}
        </Formik >
    );
}
export default AddCompany;
