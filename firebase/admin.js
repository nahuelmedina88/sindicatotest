const admin = require("firebase-admin");

const serviceAccount = require("/Users/Nahuel/Documents/beefAppKeyDevelopment.json");

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://beef-app-dev-default-rtdb.firebaseio.com"
    });
}
export const firebase = admin.firestore();
