// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBh1Os2e4fwnloy5XXe8z1TGjS-HBXRDWA",
  authDomain: "mentiring-votes.firebaseapp.com",
  projectId: "mentiring-votes",
  storageBucket: "mentiring-votes.appspot.com",
  messagingSenderId: "976727497572",
  appId: "1:976727497572:web:083abe4e2b1c1f6c12b871",
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp); // Aquí usamos getFirestore para obtener una referencia a Firestore

export default db;
