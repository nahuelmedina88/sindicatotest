import React, { useEffect } from 'react';
import Link from "next/link";

const Alert = () => {

    useEffect(() => {
        const timer = setTimeout(() => {
            setCount('Timeout called!');
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    return (<>
        <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">No tienes sesión iniciada!</h4>
            <p>Esto significa que debes iniciar sesión para utilizar esta aplicación.</p>
            <p>En el caso que no dispongas de cuenta, habla con el administrador del sitio.</p>
            <hr />
            <Link href="/login">
                <a className="btn btn-info">Iniciar Sesión</a>
            </Link>
        </div>
    </>);
}

export default Alert;
