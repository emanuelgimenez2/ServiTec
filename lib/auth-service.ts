import { signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut, type User } from "firebase/auth"
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore"
import { auth, db } from "./firebase"

const googleProvider = new GoogleAuthProvider()

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    const user = result.user

    // Crear o actualizar documento del usuario
    await createUserDocument(user)

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
        role: "usuario",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        ...additionalData,
      })
    } catch (error) {
      console.error("Error creating user document:", error)
      throw error
    }
  }
}

export const signOut = async () => {
  try {
    await firebaseSignOut(auth)
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
