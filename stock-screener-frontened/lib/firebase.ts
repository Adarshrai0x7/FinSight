import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // ✅ Add this

// Your Firebase config
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCMFUqmL3wNnl0rRp1n94oxQNS-ir5w7fg",
  authDomain: "finsight-7b199.firebaseapp.com",
  projectId: "finsight-7b199",
  storageBucket: "finsight-7b199.firebasestorage.app",
  messagingSenderId: "26950318537",
  appId: "1:26950318537:web:80da49a19bff6339669018",
  measurementId: "G-CC9TX2ZXHG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Add this
const db = getFirestore(app);

// Auth + Analytics
const auth = getAuth(app);
let analytics: ReturnType<typeof getAnalytics> | undefined;

isSupported().then((yes) => {
  if (yes) {
    analytics = getAnalytics(app);
  }
});

// ✅ Export db
export { app, auth, db, analytics };
