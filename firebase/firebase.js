// firebase/firebase.js
// Adaptador simple al SDK modular ya configurado

import { auth, db, storage } from "../lib/firebaseClient";
import { registrar, iniciarSesion, cerrarSesion } from "../services/auth";

// Exportamos un objeto con la "forma" que el resto del código espera
const firebase = {
  auth,
  db,
  storage,
  registrar,
  iniciarSesion,
  cerrarSesion,
};

export default firebase;
