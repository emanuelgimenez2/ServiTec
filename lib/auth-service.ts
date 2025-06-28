import { signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut, type User } from "firebase/auth"
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore"
import { auth, db } from "./firebase"

const googleProvider = new GoogleAuthProvider()

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    const user = result.user

    // Crear o actualizar documento del usuario
    const userDoc = await createUserDocument(user)

    // Guardar en localStorage para el navbar
    const userData = {
      id: user.uid,
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      role: userDoc?.role || "usuario",
    }

    localStorage.setItem("servitec_user", JSON.stringify(userData))

    return user
  } catch (error) {
    console.error("Error signing in with Google:", error)
    throw error
  }
}

export const createUserDocument = async (user: User, additionalData = {}) => {
  if (!user) return

  const userRef = doc(db, "usuario", user.uid)
  const userSnap = await getDoc(userRef)

  if (!userSnap.exists()) {
    const { displayName, email, photoURL } = user

    try {
      await setDoc(userRef, {
        name: displayName,
        email,
        photoURL,
        role: email === "admin@servitec.com" ? "administrador" : "usuario",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        ...additionalData,
      })

      return {
        name: displayName,
        email,
        photoURL,
        role: email === "admin@servitec.com" ? "administrador" : "usuario",
        ...additionalData,
      }
    } catch (error) {
      console.error("Error creating user document:", error)
      throw error
    }
  } else {
    return userSnap.data()
  }
}

export const signOut = async () => {
  try {
    await firebaseSignOut(auth)
    localStorage.removeItem("servitec_user")
  } catch (error) {
    console.error("Error signing out:", error)
    throw error
  }
}

export const getUserDocument = async (userId: string) => {
  if (!userId) return null

  try {
    const userRef = doc(db, "usuario", userId)
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
      return {
        id: userSnap.id,
        ...userSnap.data(),
      }
    } else {
      return null
    }
  } catch (error) {
    console.error("Error fetching user document:", error)
    return null
  }
}

// Función para sincronizar el estado de autenticación
export const syncAuthState = (user: User | null) => {
  if (user) {
    // Usuario logueado - obtener datos de Firestore y guardar en localStorage
    getUserDocument(user.uid).then((userDoc) => {
      const userData = {
        id: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        role: userDoc?.role || (user.email === "admin@servitec.com" ? "administrador" : "usuario"),
      }

      localStorage.setItem("servitec_user", JSON.stringify(userData))

      // Disparar evento para actualizar navbar
      window.dispatchEvent(new CustomEvent("userUpdated"))
    })
  } else {
    // Usuario no logueado - limpiar localStorage
    localStorage.removeItem("servitec_user")

    // Disparar evento para actualizar navbar
    window.dispatchEvent(new CustomEvent("userUpdated"))
  }
}
