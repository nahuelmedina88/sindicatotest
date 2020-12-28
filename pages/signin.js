import React, { useState } from 'react';
import Layout2 from "../components/layout/Layout2";
import Router from "next/router";

//validation
import useValidation from "../hooks/useValidation";
import signinValidate from "../validation/signinValidate";

import firebase from "../firebase/firebase";

const signin = () => {

    const [error, setError] = useState(false);

    const initialState = {
        nombre: "",
        email: "",
        password: ""
    }

    const crearCuenta = async () => {
        try {
            await firebase.registrar(nombre, email, password);
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
    } = useValidation(initialState, signinValidate, crearCuenta);

    const { nombre, email, password } = values



    return (
        <Layout2>
            <div className="container">
                <div className="d-flex flex-column align-items-center">
                    <h1 className="p-3">Registrar cuenta</h1>
                    <form onSubmit={handleSubmit} >
                        <div className="form-group">
                            <label htmlFor="exampleInputText1">Nombre</label>
                            <input
                                type="text"
                                className="form-control"
                                id="exampleInputText1"
                                name="nombre"
                                placeholder="Enter email"
                                onChange={handleChange}
                                value={nombre}
                            />
                        </div>
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
                </div>
            </div>
        </Layout2>
    );
}


export default signin;