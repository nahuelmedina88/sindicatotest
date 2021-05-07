
let firebaseConfig = "";
if (process.env.NODE_ENV === 'development') {
    // everything in here gets removed 
    firebaseConfig = {
        apiKey: "AIzaSyAEJ4ptAAwy6dJWQ4PxE2M9gtZpGyGBx_k",
        authDomain: "beef-app-dev.firebaseapp.com",
        databaseURL: "https://beef-app-dev-default-rtdb.firebaseio.com",
        projectId: "beef-app-dev",
        storageBucket: "beef-app-dev.appspot.com",
        messagingSenderId: "425102888972",
        appId: "1:425102888972:web:2c56e606c377ebe20c9e29",
        measurementId: "G-SDPXC5HMXG"
    };
} else { //Production
    firebaseConfig = {
        apiKey: "AIzaSyB1m4y5cAySMoGGiFQqmQkFEpUvculhLSk",
        authDomain: "beef-app-11fbe.firebaseapp.com",
        projectId: "beef-app-11fbe",
        databaseURL: "https://beef-app-11fbe.firebaseio.com/",
        storageBucket: "beef-app-11fbe.appspot.com",
        messagingSenderId: "579756680200",
        appId: "1:579756680200:web:29a9bccf10fc2f206c9dbd",
        measurementId: "G-WG4FH7HB85"
    }
}

// let firebaseConfig = {
//     apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY_DEV,
//     authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN_DEV,
//     databaseURL: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID_DEV,
//     projectId: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL_DEV,
//     storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET_DEV,
//     messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID_DEV,
//     appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID_DEV,
//     measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASURE_ID_DEV
// };

export default firebaseConfig;