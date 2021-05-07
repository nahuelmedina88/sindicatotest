import React, { useState } from 'react';
import Router from "next/router";
import styles from "./css/login.module.scss";
//validation
import useValidation from "../hooks/useValidation";
import loginValidate from "../validation/loginValidate";
import firebase from "../firebase/firebase";
import Link from "next/link"
import Image from 'next/image';

const login = () => {

    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const initialState = {
        email: "",
        password: ""
    }

    const iniciarSesion = async () => {
        try {
            setError("");
            setLoading(true);
            const usuario = await firebase.iniciarSesion(email, password);
            setLoading(false);
            Router.push("/");
        } catch (error) {
            setLoading(false);
            if (error.code === "auth/user-not-found") {
                setError("Usuario no encontrado.");
            }
            if (error.code === "auth/wrong-password") {
                setError("Introduzca una contraseña correcta.");
            }
        }
    }

    const {
        values,
        errors,
        submitForm,
        handleSubmit,
        handleChange,
        handleBlur
    } = useValidation(initialState, loginValidate, iniciarSesion);

    const { email, password } = values

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1>Iniciar Sesión</h1>
                {loading ?
                    <Image
                        src="/img/loading.gif"
                        alt="loading"
                        width={100}
                        height={100}
                    ></Image>
                    :
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className="formControl">
                            <label htmlFor="exampleInputEmail1">Email</label>
                            <input
                                type="email"
                                className="input"
                                id="exampleInputEmail1"
                                name="email"
                                placeholder="Ingrese su email"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={email}
                                required
                            />

                        </div>
                        {errors.email && <p className="btn dangerInput">{errors.email}</p>}
                        <div className="formControl">
                            <label htmlFor="exampleInputPassword1">Contraseña</label>
                            <input
                                type="password"
                                className="input"
                                id="exampleInputPassword1"
                                name="password"
                                placeholder="Ingrese su clave"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={password}
                                required
                            />

                        </div>
                        {errors.password && <p className="btn dangerInput">{errors.password}</p>}
                        <button
                            type="submit"
                            className={"btn btnPrimary formControl"}
                        >Aceptar
                </button>


                        {/* Comentado por temas de seguridad
                        
                        <span>No tiene una cuenta y desea registrarse</span>
                        <Link href="/signin">
                            <a>Click Aquí</a>
                        </Link> */}
                    </form>
                }
                {error ? <p className="alert danger">{error}</p> : null}
            </div>
        </div>
    );
}

export default login;