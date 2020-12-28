import React, { useEffect, useState } from 'react';
import firebase from "../firebase";

function useAuth() {
    const [userLogged, setUserLogged] = useState(null);

    useEffect(() => {
        const unsuscribe = firebase.auth.onAuthStateChanged(user => {
            if (user) {
                setUserLogged(user);
            } else {
                setUserLogged(null);
            }
        });
        return () => unsuscribe();
    }, []);

    return userLogged;
}

export default useAuth;
