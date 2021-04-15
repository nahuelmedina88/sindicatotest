import React, { useContext, useEffect } from 'react';
import Header from "./Header";
// import 'bootstrap/dist/css/bootstrap.css';
import Sidebar from './Sidebar';
// import { FirebaseContext } from "../../firebase";
import styles from "../css/Layout.module.scss"
import { useDispatch, useSelector } from "react-redux";

const Layout = (props) => {
    // const { user } = useContext(FirebaseContext);
    const buttonPressed = useSelector(state => state.general.buttonPressed);
    return (<>
        <Header />
        <div className={buttonPressed ? styles.containerFlexButton : styles.containerFlex}>
            {/* {user ? <Sidebar /> : null} */}
            <Sidebar />
            {props.homepage ?
                <main className={styles.homepage}>
                    {props.children}
                </main> :
                <main className={styles.content}>
                    {props.children}
                </main>
            }
        </div>
    </>);
}

export default Layout;