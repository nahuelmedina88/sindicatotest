import '../styles/globals.scss'
import { Provider } from "react-redux";
import store from "../components/redux/store";
import FirebaseContext from "../firebase/context";
import firebase from "../firebase/firebase";
import useAuth from "../hooks/useAuth";

const MyApp = ({ Component, pageProps }) => {
  const user = useAuth();

  return (
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
  );
}
export default MyApp
