import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCxPl_PhomBt3gmArRWtFGXf5tjzQAxsr8",
  authDomain: "tally-95e33.firebaseapp.com",
  projectId: "tally-95e33",
  storageBucket: "tally-95e33.appspot.com",
  messagingSenderId: "974923371619",
  appId: "1:974923371619:web:c9747f2416d4f973f81456",
  measurementId: "G-BHH2FEPXY1",
};

const firebaseApp = initializeApp(firebaseConfig);

export const db = getFirestore(firebaseApp);
