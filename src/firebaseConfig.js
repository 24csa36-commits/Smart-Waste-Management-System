import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Replace with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyCBqnHH0oK4FtBRVOYsrc9eKLlNweSCaUM",
  authDomain: "smart-waste-management-123a2.firebaseapp.com",
  projectId: "smart-waste-management-123a2",
  storageBucket: "smart-waste-management-123a2.firebasestorage.app",
  messagingSenderId: "517865690785",
  appId: "1:517865690785:web:f8167ac29aa1aebc6c82e0",
  measurementId: "G-JJGRRSF4HM"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
