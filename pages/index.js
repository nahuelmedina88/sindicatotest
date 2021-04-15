import React, { useContext } from 'react';
import Homepage from "./Homepage";
import { FirebaseContext } from "../firebase";
import Login from "./login";

export default function Home() {
  const { user } = useContext(FirebaseContext);
  return (
    <>
      {user ? <Homepage /> : <Login />}
    </>
  )
}
