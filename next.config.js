const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");

module.exports = {
    // env: {
    //     NEXT_PUBLIC_FIREBASE_API_KEY: "AIzaSyAEJ4ptAAwy6dJWQ4PxE2M9gtZpGyGBx_k",
    //     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "beef-app-11fbe.firebaseapp.com",
    //     NEXT_PUBLIC_FIREBASE_PROJECT_ID: "beef-app-dev",
    //     NEXT_PUBLIC_FIREBASE_DATABASE_URL: "https://beef-app-dev-default-rtdb.firebaseio.com/",
    //     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: "beef-app-dev.appspot.com",
    //     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: "425102888972",
    //     NEXT_PUBLIC_FIREBASE_APP_ID: "1:425102888972:web:2c56e606c377ebe20c9e29",
    //     NEXT_PUBLIC_FIREBASE_MEASURE_ID: "G-SDPXC5HMXG",
    // }
    env: {
        NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        NEXT_PUBLIC_FIREBASE_DATABASE_URL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        NEXT_PUBLIC_FIREBASE_MEASURE_ID: process.env.NEXT_PUBLIC_FIREBASE_MEASURE_ID,
    }
    // console.log(phase);
    // if (phase === PHASE_DEVELOPMENT_SERVER) {
    //     return {
    //         images: {
    //             domains: ['firebasestorage.googleapis.com'],
    //         },
    //         env: {
    //             NEXT_PUBLIC_FIREBASE_API_KEY: "AIzaSyAEJ4ptAAwy6dJWQ4PxE2M9gtZpGyGBx_k",
    //             NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "beef-app-11fbe.firebaseapp.com",
    //             NEXT_PUBLIC_FIREBASE_PROJECT_ID: "beef-app-dev",
    //             NEXT_PUBLIC_FIREBASE_DATABASE_URL: "https://beef-app-dev-default-rtdb.firebaseio.com/",
    //             NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: "beef-app-dev.appspot.com",
    //             NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: "425102888972",
    //             NEXT_PUBLIC_FIREBASE_APP_ID: "1:425102888972:web:2c56e606c377ebe20c9e29",
    //             NEXT_PUBLIC_FIREBASE_MEASURE_ID: "G-SDPXC5HMXG"
    //         }
    //     }
    // } else {
    //     return {
    //         images: {
    //             domains: ['firebasestorage.googleapis.com'],
    //         },
    //         env: {
    //             NEXT_PUBLIC_FIREBASE_API_KEY: "AIzaSyB1m4y5cAySMoGGiFQqmQkFEpUvculhLSk",
    //             NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "beef-app-11fbe.firebaseapp.com",
    //             NEXT_PUBLIC_FIREBASE_PROJECT_ID: "beef-app-11fbe",
    //             NEXT_PUBLIC_FIREBASE_DATABASE_URL: "https://beef-app-11fbe.firebaseio.com/",
    //             NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: "beef-app-11fbe.appspot.com",
    //             NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: "579756680200",
    //             NEXT_PUBLIC_FIREBASE_APP_ID: "1:579756680200:web:29a9bccf10fc2f206c9dbd",
    //             NEXT_PUBLIC_FIREBASE_MEASURE_ID: "G-WG4FH7HB85"
    //         }
    //     }
    // }
}