// firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBVlnDTixLP7B7o00Ju--amdTnJ86IZHvA",
  authDomain: "ventaconecta-76283.firebaseapp.com",
  projectId: "ventaconecta-76283",
  storageBucket: "ventaconecta-76283.firebasestorage.app",
  messagingSenderId: "812623879124",
  appId: "1:812623879124:web:10fdd4475097a572fc5441",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };

// Listener para detectar si hay usuario logueado (se ejecuta SIEMPRE)
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Usuario sigue logueado:", user.email);
  } else {
    console.log("Usuario NO logueado");
  }
});
