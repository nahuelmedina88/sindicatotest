import React from 'react';
import Header from "./Header";
// import 'bootstrap/dist/css/bootstrap.css';

const Layout2 = (props) => {
    return (<>
        <Header />
        <main>
            {props.children}
        </main>
    </>);
}

export default Layout2;