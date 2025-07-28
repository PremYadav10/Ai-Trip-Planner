// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBdCY46VID2CyokYTzzqP70N9BwBTJRMN4",
  authDomain: "ai-trip-planner-598b8.firebaseapp.com",
  projectId: "ai-trip-planner-598b8",
  storageBucket: "ai-trip-planner-598b8.firebasestorage.app",
  messagingSenderId: "598865438684",
  appId: "1:598865438684:web:db4ed6d0e9f96955d1d119"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);