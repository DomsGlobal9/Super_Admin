// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import { getFirestore } from "firebase/firestore";
// import { getStorage } from "firebase/storage";
// import { getAuth } from "firebase/auth"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCwlxdZKM8dagbu43v7NVFclex4QsTO4hw",
  authDomain: "dvyb-8b572.firebaseapp.com",
  databaseURL: "https://dvyb-8b572-default-rtdb.firebaseio.com",
  projectId: "dvyb-8b572",
  storageBucket: "dvyb-8b572.firebasestorage.app",
  messagingSenderId: "288498435019",
  appId: "1:288498435019:web:a20bce56f823c0ddad6c4e",
  measurementId: "G-4GFNR7HKFS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app); //

export { app, analytics, db, storage, auth };