import React, { useState } from 'react';
import useValidation from "../hooks/useValidation";
import addEmployeeValidate from "../validation/addEmployeeValidate";
import styles from "./css/familyMemberForm.module.scss";
import Select from 'react-select';
import Link from "next/link";
//Import Data
import relationshipSelect from "../components/data/relationship.json";
import sexSelect from "../components/data/sexo.json";
//Formik
import { Formik, Form, Field } from "formik";

const FamilyMemberForm = ({ updateFamily, family }) => {

    // const [familia, setFamilia] = useState("");

    const handleDeleteMemberFamily = e => {
        e.preventDefault();
        let newFamily = family.filter(member => parseInt(member.dni) !== parseInt(e.target.id));
        updateFamily(newFamily);
    }

    return (
        <Formik
            initialValues={{
                nombre_familia: "",
                apellido_familia: "",
                fecha_nacimiento_familia: "",
                dni_familia: "",
                sexo: "",
                parentesco: ""
            }}
            onClick={(values, { setSubmitting }) => {
                setSubmitting(true);
                updateFamily([...family, values]);
                setSubmitting(false);
            }}

        >{({ values, errors, touched, isSubmitting, setFieldValue, setFieldTouched }) => (
            <fieldset className={styles.familyGroup}>
                <legend>Grupo Familiar</legend>
                {
                    family.length !== 0 ?
                        family.map(member => (
                            <div className={styles.familyMembers}>
                                <span><strong>Apellido y Nombre: </strong>{member.apellido}, {member.nombre}</span>
                                <span><strong>DNI: </strong>{member.dni}</span>
                                <span><strong>Parentesco: </strong>{member.parentesco}</span>
                                <span><strong>Sexo: </strong> {member.sexo}</span>
                                <span><strong>Fecha de Nacimiento: </strong>{member.fecha_nacimiento}</span>
                                <Link href="#">
                                    <a id={member.dni} onClick={handleDeleteMemberFamily} className={styles.buttonDelete}>
                                        <svg id={member.dni} className={styles.iconDelete} >
                                            <use id={member.dni} xlinkHref="img/sprite.svg#icon-cross"></use>
                                        </svg>
                                    </a>
                                </Link>
                            </div>
                        )) :
                        null
                }
                <Form>
                    <fieldset className={styles.flexFormFamilia}>
                        <legend>Nuevo Integrante Familiar</legend>
                        <div className={styles.formControl}>
                            <label>Nombre</label>
                            <Field
                                type="text"
                                className="inputSecondary"
                                name="nombre_familia"
                                placeholder="Nombre"
                                value={values.nombre_familia}
                            ></Field>
                            {errors.nombre_familia && <span className="btn dangerInputSmall">{errors.nombre_familia}</span>}
                        </div>
                        <div className={styles.formControl}>
                            <label>Apellido</label>
                            <Field
                                type="text"
                                className="inputSecondary"
                                name="apellido_familia"
                                placeholder="Apellido"
                                value={values.apellido_familia}
                            ></Field>
                            {errors.apellido_familia && <span className="btn dangerInputSmall">{errors.apellido_familia}</span>}
                        </div>
                        <div className={styles.formControl}>
                            <label>Parentesco</label>
                            <Select
                                className={`inputSecondary ` + styles.myselect}
                                options={relationshipSelect}
                                name="parentesco"
                                onChange={e => setRelationshipFamily(e.label)}
                                placeholder={"Parentesco"}
                                onChange={option => setFieldValue("parentesco", option)}
                                onBlur={option => setFieldTouched("parentesco", option)}
                            ></Select>
                        </div>
                        <div className={styles.formControl}>
                            <label>Sexo</label>
                            <Select
                                className={`inputSecondary ` + styles.myselect}
                                options={sexSelect}
                                name="sexo"
                                onChange={e => setSexFamily(e.value)}
                                placeholder={"Sexo"}
                                onChange={option => setFieldValue("sexo", option)}
                                onBlur={option => setFieldTouched("sexo", option)}
                            ></Select>
                        </div>
                        <div className={styles.formControl}>
                            <label>Fecha de Nacimiento</label>
                            <Field
                                type="date"
                                className="inputSecondary"
                                name="fecha_nacimiento_familia"
                                placeholder="Fecha de nacimiento"
                                value={values.fecha_nacimiento_familia}
                            ></Field>
                            {errors.fecha_nacimiento_familia && <span className="btn dangerInputSmall">{errors.fecha_nacimiento_familia}</span>}
                        </div>
                        <div className={styles.formControl}>
                            <label>DNI</label>
                            <Field
                                type="number"
                                className={`inputSecondary`}
                                name="dni_familia"
                                placeholder="DNI"
                                value={values.dni_familia}
                            ></Field>
                            {errors.dni_familia && <span className="btn dangerInputSmall">{errors.dni_familia}</span>}
                        </div>
                        <div className={styles.formControl}>
                            <button
                                type="button"
                                className="btn btnInfo">
                                Agregar
                            </button>
                        </div>
                        {/* {errorFamily && <span className="btn dangerInputSmall">{errorFamily}</span>} */}
                    </fieldset>
                </Form>
            </fieldset>
        )}
        </Formik >
    );
}

export default FamilyMemberForm;