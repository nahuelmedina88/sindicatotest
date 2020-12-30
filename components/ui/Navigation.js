import React, { useContext } from 'react';
import Link from "next/link";
import { FirebaseContext } from "../../firebase";
import styles from "../css/Navigation.module.scss"

const Navigation = () => {

    const { user, firebase } = useContext(FirebaseContext);

    return (
        <nav className={styles.nav}>
            <Link href="/" ><a>Sindicato de la Carne</a></Link>
            {user ?
                <form className={styles.form}>
                    <span>{user.displayName}</span>

                    <button

                        type="button"
                        className="btn btnDanger"
                        onClick={() => firebase.cerrarSesion()}
                    >
                        Cerrar Sesion
                        </button>

                </form>
                :
                <form >
                    <Link href="/login">
                        <button className="btn btnExploring" type="button">Login</button>
                    </Link>
                    {/* <Link href="/signin">
                        <button type="button">Crear cuenta</button>
                    </Link> */}
                </form>
            }
        </nav >
    );
}

export default Navigation;