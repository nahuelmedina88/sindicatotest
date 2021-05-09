import React, { memo, useContext, useEffect, useState } from 'react';
import styles from "../css/[id].module.scss";
import { useDispatch, useSelector } from "react-redux";
import { editCompanyAction } from "../../components/redux/actions/CompanyActions";
// import { useHistory } from "react-router-dom";
import { useRouter } from "next/router";
import Image from 'next/image';
// import history from "../history";

//Firebase
import { FirebaseContext } from "../../firebase";
import Layout from '../../components/layout/Layout';
//Formik
import { Formik, Field, Form, FieldArray, getIn, ErrorMessage } from "formik";
import validation from "../../validation/addCompanyValidate.js"

const EditCompany = memo(() => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [generalError, setGeneralError] = useState("");
    //UseSelector
    const companyToEdit = useSelector(state => state.companies.companyToEdit);


    //Firebase
    const { firebase } = useContext(FirebaseContext);

    return (<>
        {companyToEdit ?
            <Formik
                initialValues={companyToEdit}
                onSubmit={(values, { setSubmitting }) => {
                    setSubmitting(true);
                    setTimeout(() => {
                        values && dispatch(editCompanyAction(values, firebase));
                        setSubmitting(false);
                        router.push("/companies");
                    }, 2000);
                }}
                validate={validation}
            >
                {({ values, errors, touched, isSubmitting }) => (
                    <div>
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
                                            <label>Calle</label>
                                            <Field
                                                type="text"
                                                className="inputSecondary"
                                                name="calle"
                                                placeholder="Calle"
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
                                            ></Field>
                                            {touched.numero_calle && errors.numero_calle && <span className="errorMessage">{errors.numero_calle}</span>}
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
                    </div>
                )}
            </Formik>
            : <span className="errorMessage">Algo fue mal</span>}
    </>);
})

export default EditCompany;