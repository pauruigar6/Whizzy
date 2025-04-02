import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAZyOehtCuJDRw3bsJmjjHcJ7jgJW42GaE",
  authDomain: "whizzy-app-c74e9.firebaseapp.com",
  projectId: "whizzy-app-c74e9",
  storageBucket: "whizzy-app-c74e9.firebasestorage.app",
  messagingSenderId: "561136889316",
  appId: "1:561136889316:web:bc4350cfc283d5ae1dabf1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // ✅ sin persistencia nativa
const db = getFirestore(app);

export { app, auth, db };
