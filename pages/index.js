import React, { useContext, useEffect } from 'react';
import Homepage from "./Homepage";
import { FirebaseContext } from "../firebase";
import Login from "./login";

export default function Home() {

  useEffect(() => {
    if (!user) {
      window.location.href = "/login";
    }
  }, []);

  const { user } = useContext(FirebaseContext);
  return (
    <>
      {<Homepage />}
    </>
  )
}
