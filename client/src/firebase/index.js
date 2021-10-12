// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCIm1abZwgB2zVQ-EUaLmSVROi4gKJHbE8",
  authDomain: "somo-china-test.firebaseapp.com",
  databaseURL: "https://somo-china-test-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "somo-china-test",
  storageBucket: "somo-china-test.appspot.com",
  messagingSenderId: "838343016928",
  appId: "1:838343016928:web:523f25046a71b5bbd46b85",
  measurementId: "G-HJ3VXLJZM8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics }