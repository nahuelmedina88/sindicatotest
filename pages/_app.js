// import '../styles/globals.scss'
// import { Provider } from "react-redux";
// import store from "../components/redux/store";
// import FirebaseContext from "../firebase/context";
// import firebase from "../firebase/firebase";
// import useAuth from "../hooks/useAuth";

// const MyApp = ({ Component, pageProps }) => {
//   const user = useAuth();

//   return (
//     <FirebaseContext.Provider
//       value={{
//         firebase,
//         user
//       }}
//     >
//       <Provider store={store}>
//         <Component {...pageProps} />
//       </Provider>
//     </FirebaseContext.Provider>
//   );
// }
// export default MyApp

import '../styles/globals.scss'
import { Provider } from "react-redux";
import store from "../components/redux/store";
import FirebaseContext from "../firebase/context";
import firebase from "../firebase/firebase";
import useAuth from "../hooks/useAuth";

import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../components/theme';


import Router from 'next/router';
import NProgress from 'nprogress';
import "./css/nprogress.scss";

//Binding events. 
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

export default function MyApp(props) {
  const { Component, pageProps } = props;
  const user = useAuth();
  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);



  return (
    <React.Fragment>
      <Head>
        <title>My page</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <FirebaseContext.Provider
          value={{
            firebase,
            user
          }}
        >
          <Provider store={store}>
            <Component {...pageProps} />
          </Provider>
        </FirebaseContext.Provider>
      </ThemeProvider>
    </React.Fragment>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};
