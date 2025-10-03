// pages/_app.js
import '../styles/globals.scss'
import '../lib/chartjs-register'  // ⬅️ este import sin asignación
import Router from 'next/router'
import Head from 'next/head'
import NProgress from 'nprogress'
import './css/nprogress.scss'

// Redux
import { Provider as ReduxProvider } from 'react-redux'
import { useStore } from '../components/redux/store'

// Firebase (nuevo provider)
import FirebaseProvider from '../firebase/FirebaseProvider'

// MUI (v5/v6)
import * as React from 'react'
import { ThemeProvider, CssBaseline } from '@mui/material'
import theme from '../components/theme' // asegurate de migrar el theme a @mui

// NProgress bindings
Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

export default function MyApp({ Component, pageProps }) {
  const store = useStore(pageProps.initialReduxState)

  React.useEffect(() => {
    // si tenías inyección JSS del lado servidor en MUI v4, ya no aplica en v5/v6
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) jssStyles.parentElement.removeChild(jssStyles)
  }, [])

  return (
    <React.Fragment>
      <Head>
        <title>Sindicato de la Carne Zona Oeste</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <FirebaseProvider>
          <ReduxProvider store={store}>
            <Component {...pageProps} />
          </ReduxProvider>
        </FirebaseProvider>
      </ThemeProvider>
    </React.Fragment>
  )
}