import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBT19EFPcX_3qpGagqll6A8tXnL5h0dCwo",
  authDomain: "project-1-95b65.firebaseapp.com",
  projectId: "project-1-95b65",
  storageBucket: "project-1-95b65.appspot.com", // fixed typo
  messagingSenderId: "21656083932",
  appId: "1:21656083932:web:0168dd117f7953e3dd8319",
  measurementId: "G-17HJBMEG96"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
const auth = getAuth(app);

// Initialize Analytics only if supported (avoids SSR/Node errors)
let analytics: ReturnType<typeof getAnalytics> | undefined;
isSupported().then((yes) => {
  if (yes) {
    analytics = getAnalytics(app);
  }
});

export { app, auth, analytics };