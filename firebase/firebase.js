import app from "firebase/app";
import firebaseConfig from "./config";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
// import { useRouter } from 'next/router'
// import 'firebase/analytics';


class Firebase {
    constructor() {
        // const { initializeApp } = require('firestore-export-import')

        // const serviceAccount = require('./serviceAccountKey.json')
        // const router = useRouter();
        // const hostname = router.pathname;
        // if (hostname === 'localhost') {
        //     firebaseConfig.databaseURL = "http://localhost:9000/?ns=beef-app-11fbe"
        // }


        if (!app.apps.length) {
            app.initializeApp(firebaseConfig);
            this.auth = app.auth();
            this.db = app.firestore();
            this.storage = app.storage();
        }

        // Check that `window` is in scope for the analytics module!
        //if (typeof window !== 'undefined' && !app.apps.length) {
        //  if ('measurementId' in firebaseConfig) this.analytics = app.analytics();
        // this.db = app.firestore();
        // if (process.env.NEXT_PUBLIC_DB_HOST === 'localhost') {
        // this.db.useEmulator('localhost', 8080);
        // }
        //}

    }

    async registrar(nombre, email, password) {
        const nuevoUsuario = await this.auth.createUserWithEmailAndPassword(email, password);
        return await nuevoUsuario.user.updateProfile({
            displayName: nombre
        })
    }

    async iniciarSesion(email, password) {
        return this.auth.signInWithEmailAndPassword(email, password);
    }
    async cerrarSesion() {
        await this.auth.signOut();
    }
}
const firebase = new Firebase();

export default firebase;