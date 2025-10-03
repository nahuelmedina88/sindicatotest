// pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document';
import theme from '../components/theme';

export default function Document() {
  return (
    <Html lang="es">
      <Head>
        {/* Color de la PWA / barra del navegador */}
        <meta name="theme-color" content={theme.palette.primary.main} />
        {/* Fuentes (opcional) */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}