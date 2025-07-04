import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Verificar que las variables de entorno estén configuradas
if (!firebaseConfig.apiKey) {
  console.error("❌ Variables de entorno de Firebase no configuradas")
  throw new Error("Variables de entorno de Firebase no configuradas")
}

console.log("🔥 Inicializando Firebase con proyecto:", firebaseConfig.projectId)

// Inicializar Firebase
const app = initializeApp(firebaseConfig)

// Inicializar servicios
export const db = getFirestore(app)
export const auth = getAuth(app)

console.log("✅ Firebase inicializado correctamente")

export default app
