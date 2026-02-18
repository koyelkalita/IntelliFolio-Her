import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCDQ1LSdZvK5oFGLU8oDC8tgAKAzA5J14E",
  authDomain: "intellifolio-her-a9ba1.firebaseapp.com",
  projectId: "intellifolio-her-a9ba1",
  storageBucket: "intellifolio-her-a9ba1.firebasestorage.app",
  messagingSenderId: "173989490590",
  appId: "1:173989490590:web:7e8c4506f1ee2e5cf0b08f",
  measurementId: "G-J6GL38WKR8"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
