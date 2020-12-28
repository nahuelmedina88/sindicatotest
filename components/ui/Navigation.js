import React, { useContext } from 'react';
import Link from "next/link";
import { FirebaseContext } from "../../firebase";
import styles from "../css/Navigation.module.scss"


const Navigation = () => {

    const { user, firebase } = useContext(FirebaseContext);

    return (
        <nav className={styles.nav}>
            <Link href="/" ><a>Sindicato de la Carne</a></Link>
            {/* <Link href="/employees/add">Agregar Empleado</Link> */}
            {/* <Link className="nav-item" href="/">Inicio</Link>
            <Link href="/employee/add">Agregar Empleado</Link>
            <Link href="/company/add">Agregar Empresa</Link> */}
            {user ?
                <form className={styles.form}>
                    <span>{user.displayName}</span>

                    <button

                        type="button"
                        className="btn btnPrimary"
                        onClick={() => firebase.cerrarSesion()}
                    >
                        Cerrar Sesion
                        </button>

                </form>
                :
                <form >
                    <Link href="/login">
                        <button type="button">Login</button>
                    </Link>
                    <Link href="/signin">
                        <button type="button">Crear cuenta</button>
                    </Link>
                </form>
            }
        </nav >

        // <nav className="navbar navbar-dark bg-dark">
        //     <Link href="/" className="navbar-brand"><a className={styles.a}>Sindicato de la Carne</a></Link>
        //     {/* <Link href="/employees/add">Agregar Empleado</Link> */}
        //     {/* <Link className="nav-item" href="/">Inicio</Link>
        //     <Link href="/employee/add">Agregar Empleado</Link>
        //     <Link href="/company/add">Agregar Empresa</Link> */}
        //     {user ?
        //         <form className="form-inline my-2 my-lg-0">
        //             <span className="badge badge-pill badge-light">{user.displayName}</span>

        //             <button
        //                 className="btn btn-outline-success my-2 my-sm-0"
        //                 type="button"
        //                 onClick={() => firebase.cerrarSesion()}
        //             >
        //                 Cerrar Sesion
        //                 </button>

        //         </form>
        //         :
        //         <form className="form-inline my-2 my-lg-0">
        //             <Link href="/login">
        //                 <button className="btn btn-info" type="button">Login</button>
        //             </Link>
        //             <Link href="/signin">
        //                 <button className="btn btn-danger" type="button">Crear cuenta</button>
        //             </Link>
        //         </form>
        //     }
        // </nav >
    );
}

export default Navigation;