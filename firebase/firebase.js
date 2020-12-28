import app from "firebase/app";
import firebaseConfig from "./config";
import "firebase/auth";
import "firebase/firestore";

class Firebase {
    constructor() {
        if (!app.apps.length) {
            app.initializeApp(firebaseConfig);
            this.auth = app.auth();
            this.db = app.firestore();
        }
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