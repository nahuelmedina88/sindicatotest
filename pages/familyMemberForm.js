import React, { useState } from 'react';
import useValidation from "../hooks/useValidation";
import addEmployeeValidate from "../validation/addEmployeeValidate";
import styles from "./css/familyMemberForm.module.scss";
import Select from 'react-select';
import Link from "next/link";
//Import Data
import relationshipSelect from "../components/data/relationship.json";
import sexSelect from "../components/data/sexo.json";
const FamilyMemberForm = ({ updateFamily, family }) => {


    const [relationshipFamily, setRelationshipFamily] = useState("");
    const [sexFamily, setSexFamily] = useState("");

    // const [family, setFamily] = useState([]);
    const [errorFamily, setErrorFamily] = useState("");

    const initialState = {
        nameFamily: "",
        lastNameFamily: "",
        birthdateFamily: "",
        dniFamily: ""
    }
    const {
        values,
        errors,
        handleChange,
        handleBlur,
        emptyInputs
    } = useValidation(initialState, addEmployeeValidate);

    const { dniFamily, nameFamily, lastNameFamily, birthdateFamily } = values;


    const onClickAddMember = e => {
        e.preventDefault();
        if (!errors.nameFamily && !errors.lastNameFamily && !errors.dniFamily && !errors.birthdateFamily
        ) {
            if (nameFamily !== "" &&
                lastNameFamily !== "" &&
                birthdateFamily !== "" &&
                dniFamily !== "") {

                const reg = family.find(member => member.dni === dniFamily);
                if (!reg) {
                    let memberfamily = {
                        nombre: nameFamily,
                        apellido: lastNameFamily,
                        dni: dniFamily,
                        fecha_nacimiento: birthdateFamily,
                        parentesco: relationshipFamily,
                        sexo: sexFamily
                    };
                    updateFamily([...family, memberfamily]);
                    emptyInputs();
                    setErrorFamily("");
                } else {
                    setErrorFamily("Este familiar ya existe.");
                }
            }
            else {
                // setErrorFamily("Verifique que todos los campos esten completos");
            }
        } else {
            // setErrorFamily("Verifique que todo este correcto");
        }
    }

    const handleDeleteMemberFamily = e => {
        e.preventDefault();
        let newFamily = family.filter(member => parseInt(member.dni) !== parseInt(e.target.id));
        setFamily(newFamily);
    }

    return (
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
            <fieldset className={styles.flexFormFamilia}>
                <legend>Nuevo Integrante Familiar</legend>
                <div className={styles.formControl}>
                    <label>Nombre</label>
                    <input
                        type="text"
                        className="inputSecondary"
                        name="nameFamily"
                        placeholder="Nombre"
                        value={nameFamily}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    // required
                    />
                    {errors.nameFamily && <span className="btn dangerInputSmall">{errors.nameFamily}</span>}
                </div>
                <div className={styles.formControl}>
                    <label>Apellido</label>
                    <input
                        type="text"
                        className="inputSecondary"
                        name="lastNameFamily"
                        placeholder="Apellido"
                        value={lastNameFamily}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    // required
                    />
                    {errors.lastNameFamily && <span className="btn dangerInputSmall">{errors.lastNameFamily}</span>}
                </div>
                <div className={styles.formControl}>
                    <label>Parentesco</label>
                    <Select
                        className={`inputSecondary ` + styles.myselect}
                        options={relationshipSelect}
                        onChange={e => setRelationshipFamily(e.label)}
                        placeholder={"Parentesco"}
                    ></Select>
                </div>
                <div className={styles.formControl}>
                    <label>Sexo</label>
                    <Select
                        className={`inputSecondary ` + styles.myselect}
                        options={sexSelect}
                        onChange={e => setSexFamily(e.value)}
                        placeholder={"Sexo"}
                    ></Select>
                </div>
                <div className={styles.formControl}>
                    <label>Fecha de Nacimiento</label>
                    <input
                        // type={inputTypeBirthdateFamily}
                        type="date"
                        className="inputSecondary"
                        name="birthdateFamily"
                        placeholder="Fecha de nacimiento"
                        value={birthdateFamily}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    // onChange={e => setBirthdateFamily(e.target.value)}
                    // onFocus={() => !birthdateFamily && setTypeInputBirthdateFamily("date")}
                    // onBlur={() => !birthdateFamily && setTypeInputBirthdateFamily("text")}
                    // required
                    />
                    {errors.birthdateFamily && <span className="btn dangerInputSmall">{errors.birthdateFamily}</span>}
                </div>
                <div className={styles.formControl}>
                    <label>DNI</label>
                    <input
                        type="number"
                        className={`inputSecondary`}
                        name="dniFamily"
                        placeholder="DNI"
                        value={dniFamily}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                    {errors.dniFamily && <span className="btn dangerInputSmall">{errors.dniFamily}</span>}
                </div>
                <div className={styles.formControl}>
                    <button onClick={onClickAddMember}
                        className="btn btnInfo">Agregar
                                    </button>
                </div>
                {errorFamily && <span className="btn dangerInputSmall">{errorFamily}</span>}
            </fieldset>
        </fieldset>

    );
}

export default FamilyMemberForm;