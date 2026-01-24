/*----*/

import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCMS7nburh-BYLAcKRMLC6EA_SWgvYhAV8",
  authDomain: "menu-general.firebaseapp.com",
  databaseURL: "https://menu-general-default-rtdb.firebaseio.com",
  projectId: "menu-general",
  storageBucket: "menu-general.firebasestorage.app",
  messagingSenderId: "476031312159",
  appId: "1:476031312159:web:2423f2b435e93bc2ebd02a"
};

const app = initializeApp(firebaseConfig);

// 👇 هذا هو المهم
export const db = getDatabase(app);
export const auth = getAuth(app);
