// firebase/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAZyOehtCuJDRw3bsJmjjHcJ7jgJW42GaE",
    authDomain: "whizzy-app-c74e9.firebaseapp.com",
    projectId: "whizzy-app-c74e9",
    storageBucket: "whizzy-app-c74e9.firebasestorage.app",
    messagingSenderId: "561136889316",
    appId: "1:561136889316:web:bc4350cfc283d5ae1dabf1"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
