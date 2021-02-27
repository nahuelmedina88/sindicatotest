import React, { useState } from 'react';
import Router from "next/router";
import styles from "./css/signin.module.scss";
import Link from "next/link";
import Image from 'next/image';

//validation
import useValidation from "../hooks/useValidation";
import signinValidate from "../validation/signinValidate";

import firebase from "../firebase/firebase";

const signin = () => {

    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const initialState = {
        nombre: "",
        email: "",
        password: ""
    }

    const crearCuenta = async () => {
        try {
            setLoading(true);
            await firebase.registrar(nombre, email, password);
            setLoading(false);

            Router.push("/");
        } catch (error) {
            console.log(error);
            setLoading(false);
            setError(error.message);
            if (error.code === "auth/email-already-in-use") {
                setError("Existe una cuenta con ese email");
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
    } = useValidation(initialState, signinValidate, crearCuenta);

    const { nombre, email, password } = values



    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1>Registrar cuenta</h1>
                {loading ?
                    <Image
                        src="/img/loading.gif"
                        alt="loading"
                        width={100}
                        height={100}
                    ></Image>
                    :
                    <form className={styles.form} onSubmit={handleSubmit} >
                        <div className="formControl">
                            <label htmlFor="exampleInputText1">Nombre</label>
                            <input
                                type="text"
                                className="input"
                                id="exampleInputText1"
                                name="nombre"
                                placeholder="Nombre de usuario"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={nombre}
                            />
                        </div>
                        {errors.nombre && <p className="btn dangerInput">{errors.nombre}</p>}
                        <div className="formControl">
                            <label htmlFor="exampleInputEmail1">Email</label>
                            <input
                                type="email"
                                className="input"
                                id="exampleInputEmail1"
                                name="email"
                                placeholder="Enter email"
                                onChange={handleChange}
                                value={email}
                                onBlur={handleBlur}
                            />
                        </div>
                        {errors.email && <p className="btn dangerInput">{errors.email}</p>}
                        <div className="formControl">
                            <label htmlFor="exampleInputPassword1">Password</label>
                            <input
                                type="password"
                                className="input"
                                id="exampleInputPassword1"
                                name="password"
                                placeholder="Password"
                                onChange={handleChange}
                                value={password}
                                onBlur={handleBlur}
                            />
                        </div>
                        {errors.password && <p className="btn dangerInput">{errors.password}</p>}
                        <button
                            type="submit"
                            className="btn btnPrimary formControl"
                        >Aceptar
                </button>
                        <span>Tiene una cuenta y desea loguearse.</span>
                        <Link href="/login">
                            <a>Click Aquí</a>
                        </Link>

                    </form>
                }
                {error ? <p className="alert danger">{error}</p> : null}
            </div>
        </div>
    );
}


export default signin;