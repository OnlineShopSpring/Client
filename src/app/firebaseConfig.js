// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getStorage} from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyArz61-f3sAmj3_Vq5x4QEAlwLc6UW7NiY",
  authDomain: "uploadingfile-49405.firebaseapp.com",
  projectId: "uploadingfile-49405",
  storageBucket: "uploadingfile-49405.appspot.com",
  messagingSenderId: "72606891459",
  appId: "1:72606891459:web:4e6617901900076f9f1176",
  measurementId: "G-WP501JG5WT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
// const analytics = getAnalytics(app);