import React, { useState } from 'react';
import Layout2 from "../components/layout/Layout2";
import Router from "next/router";
import styles from "./css/login.module.scss";
//validation
import useValidation from "../hooks/useValidation";
import loginValidate from "../validation/loginValidate";
import firebase from "../firebase/firebase";

const login = () => {
    const [error, setError] = useState(false);

    const initialState = {
        email: "",
        password: ""
    }

    const iniciarSesion = async () => {
        try {
            const usuario = await firebase.iniciarSesion(email, password);
            console.log(usuario);
            Router.push("/");
        } catch (error) {
            console.log(error);
            setError(error.message);
        }

    }

    const {
        values,
        errors,
        submitForm,
        handleSubmit,
        handleChange
    } = useValidation(initialState, loginValidate, iniciarSesion);

    const { email, password } = values



    return (

        <div className={styles.container}>
            <div className={styles.card}>
                <h1>Iniciar Sesión</h1>
                <form className={styles.form} onSubmit={handleSubmit} >
                    <div className={styles.input}>
                        <label htmlFor="exampleInputEmail1">Email</label>
                        <input
                            type="email"
                            className="input"
                            id="exampleInputEmail1"
                            name="email"
                            placeholder="Ingrese su email"
                            onChange={handleChange}
                            value={email}
                        />
                    </div>
                    <div className={styles.input}>
                        <label htmlFor="exampleInputPassword1">Contraseña</label>
                        <input
                            type="password"
                            className="input"
                            id="exampleInputPassword1"
                            name="password"
                            placeholder="Ingrese su clave"
                            onChange={handleChange}
                            value={password}
                        />
                    </div>
                    <button
                        type="submit"
                        className={"btn btnPrimary " + styles.input}
                    >Aceptar
                </button>
                    {error ? <p className="alert alert-danger">{error}</p> : null}
                </form>
            </div>
            {/* <div className="d-flex flex-column align-items-center">
                <h1 className="p-3">Iniciar Sesión</h1>
                <form onSubmit={handleSubmit} >
                    <div className="form-group">
                        <label htmlFor="exampleInputEmail1">Email address</label>
                        <input
                            type="email"
                            className="form-control"
                            id="exampleInputEmail1"
                            name="email"
                            placeholder="Enter email"
                            onChange={handleChange}
                            value={email}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="exampleInputPassword1">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="exampleInputPassword1"
                            name="password"
                            placeholder="Password"
                            onChange={handleChange}
                            value={password}
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary"
                    >Aceptar
                </button>
                    {error ? <p className="alert alert-danger">{error}</p> : null}
                </form>
            </div> */}
        </div>

    );
}

export default login;