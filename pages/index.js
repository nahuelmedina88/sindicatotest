import React, { useContext, useEffect } from 'react';
import Layout from "../components/layout/Layout";
import Employees from "./employees";

import { FirebaseContext } from "../firebase";
import Login from "./login";


export default function Home() {
  const { user } = useContext(FirebaseContext);


  return (
    <>
      {user ? <Employees /> : <Login />}
      {/* {user ? <Graph data={empleados} /> : <Login />} */}

    </>
  )
}
