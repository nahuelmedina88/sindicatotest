import React, { useContext } from 'react';
import Employees from "./employees";
import { FirebaseContext } from "../firebase";
import Login from "./login";

export default function Home() {
  const { user } = useContext(FirebaseContext);
  return (
    <>
      {user ? <Employees /> : <Login />}
    </>
  )
}
