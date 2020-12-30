import React, { useEffect, useState, useContext } from 'react';
import Select, { components } from 'react-select';
import Layout from "../components/layout/Layout";
import { useRouter } from 'next/router';
import styles from "./css/AddEmployee.module.scss"

//Redux
import { useDispatch, useSelector } from "react-redux";
import { updatePathnameAction } from "../components/redux/actions/GeneralActions";
import { getCompaniesAction } from "../components/redux/actions/CompanyActions";
import { addEmployeeAction } from "../components/redux/actions/EmployeeActions";

//Firebase
import { FirebaseContext } from "../firebase";

const AddEmployee = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [idNumber, updateIdNumber] = useState();
    const [name, updateName] = useState("");
    const [lastName, updateLastName] = useState("");
    const [dni, updateDni] = useState();
    const [company, updateCompany] = useState([]);
    const [companies, updateCompanies] = useState([]);


    const loading = useSelector(state => state.employees.loading);
    const error = useSelector(state => state.employees.error);
    const companiesSelector = useSelector(state => state.companies.companies);

    const { firebase } = useContext(FirebaseContext);
    const AddEmployeeDispatch = (employee, firebase) => dispatch(addEmployeeAction(employee, firebase));

    useEffect(() => {
        const currentPathname = router.pathname;
        const loadPathname = getPathName => { dispatch(updatePathnameAction(getPathName)) }
        loadPathname(currentPathname);
        const loadCompanies = (firebase) => { dispatch(getCompaniesAction(firebase)) }
        loadCompanies(firebase);
        const companiesSelect = companiesSelector.map(company => ({
            id: company.id,
            value: company.id,
            label: company.nombre,
            ciudad: company.ciudad
        }));
        updateCompanies(companiesSelect);
    }, []);

    const handleOnClick = (e) => {
        e.preventDefault();
        debugger;
        AddEmployeeDispatch({
            nroLegajo: idNumber,
            nombre: name,
            apellido: lastName,
            dni: dni,
            empresa: company
        }, firebase);
        router.push("/employees");
    }

    const handleCompany = (e) => {
        let empresa = {
            "id": e.id,
            "nombre": e.label,
            "ciudad": e.ciudad
        };
        updateCompany(empresa);
    }

    return (<>
        <Layout>
            <div className={styles.container}>
                <h2 className={styles.title}> Agregar Empleado</h2>
                <form className="form">
                    <input
                        type="number"
                        className="inputSecondary"
                        value={idNumber}
                        onChange={e => updateIdNumber(Number(e.target.value))}
                        name="idNumber"
                        placeholder="Nro Legajo"
                    />
                    <input
                        type="text"
                        className="inputSecondary"
                        name="name"
                        placeholder="Nombre"
                        value={name}
                        onChange={e => updateName(e.target.value)}
                    />

                    <input
                        type="text"
                        className="inputSecondary"
                        name="lastName"
                        placeholder="Apellido"
                        value={lastName}
                        onChange={e => updateLastName(e.target.value)}
                    />

                    <input
                        type="number"
                        className={`inputSecondary`}
                        name="dni"
                        placeholder="DNI"
                        value={dni}
                        onChange={e => updateDni(Number(e.target.value))}
                    />

                    <Select
                        // className={!arsTo ? styles.foreignCurrencyFirst : styles.foreignCurrencySecond}
                        className={`inputSecondary ` + styles.myselect}
                        options={companies}
                        onChange={handleCompany}
                        placeholder={"Seleccione un frigorífico"}
                    // defaultValue={{ label: "United States Dollar", value: 'USD' }}//usd by default
                    // components={{ Option: IconOption }}
                    ></Select>

                    <button
                        onClick={handleOnClick}
                        type="submit"
                        className="btn btnPrimary"
                    >Aceptar</button>

                </form>
                {loading ? <p>Cargando...</p> : null}
                {error ? <p className="alert alert-danger">Hubo un error</p> : null}
            </div>

        </Layout>
    </>);
}

export default AddEmployee;