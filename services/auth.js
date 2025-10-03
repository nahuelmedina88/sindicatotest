import { auth } from "../lib/firebaseClient";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";

export async function registrar(nombre, email, password) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName: nombre });
  return cred.user;
}

export function iniciarSesion(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function cerrarSesion() {
  return signOut(auth);
}
