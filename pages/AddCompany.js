import React, { useState, useEffect, useContext } from 'react';
import Layout from "../components/layout/Layout";
import styles from "./css/AddCompany.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { addCompanyAction } from "../components/redux/actions/CompanyActions";
import { useRouter } from 'next/router';
import { updatePathnameAction } from "../components/redux/actions/GeneralActions";
//Firebase
import { FirebaseContext } from "../firebase";


const AddCompany = () => {
    const [nombre, setNombre] = useState("");
    const [ciudad, setCiudad] = useState("");
    const dispatch = useDispatch();
    const history = useRouter();
    const getPathName = useSelector(state => state.general.pathname);

    const { user, firebase } = useContext(FirebaseContext);



    const addCompanyDispatch = (employee, firebase) => {
        dispatch(addCompanyAction(employee, firebase));
    }
    const handleOnClick = (e) => {
        e.preventDefault();
        addCompanyDispatch({
            nombre: nombre,
            ciudad: ciudad
        }, firebase);
        history.push("/companies");
    }
    useEffect(() => {
        const loadPathname = getPathName => { dispatch(updatePathnameAction(getPathName)) }
        loadPathname();
    }, [])

    return (
        <Layout>
            <div className={styles.container}>

                <form className="form">
                    <h2 className={styles.title}>Agregar Empresa</h2>
                    <input
                        type="text"
                        className="inputSecondary"
                        name="ciudad"
                        placeholder="Nombre"
                        value={nombre}
                        onChange={e => setNombre(e.target.value)}
                    />
                    <input
                        type="text"
                        className="inputSecondary"
                        name="ciudad"
                        placeholder="Ciudad"
                        value={ciudad}
                        onChange={e => setCiudad(e.target.value)}
                    />
                    <button
                        onClick={handleOnClick}
                        type="submit"
                        className="btn btnPrimary"
                    >Aceptar</button>
                </form>
                {/* {loading ? <p>Cargando...</p> : null} */}
            </div>
        </Layout>
    );
}

export default AddCompany;