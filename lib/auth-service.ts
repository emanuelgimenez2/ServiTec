import { signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut, type User } from "firebase/auth"
import { doc, setDoc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore"
import { auth, db } from "./firebase"
import { perfilService } from "./firebase-services"

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
      isProfileComplete: userDoc?.isProfileComplete || false,
      isNewUser: userDoc?.isNewUser || false,
    }

    localStorage.setItem("servitec_user", JSON.stringify(userData))

    return { user, userDoc }
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
        isProfileComplete: false, // New field to track profile completion
        ...additionalData,
      })

      return {
        name: displayName,
        email,
        photoURL,
        role: email === "admin@servitec.com" ? "administrador" : "usuario",
        isProfileComplete: false,
        isNewUser: true, // Flag to indicate this is a new user
        ...additionalData,
      }
    } catch (error) {
      console.error("Error creating user document:", error)
      throw error
    }
  } else {
    const userData = userSnap.data()
    return {
      ...userData,
      isNewUser: false, // Existing user
    }
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

export const completeUserProfile = async (
  userId: string,
  profileData: { name: string; phone: string; address?: string },
) => {
  try {
    console.log("🔄 Completing user profile:", { userId, profileData })

    // Get user email from localStorage
    const currentUser = JSON.parse(localStorage.getItem("servitec_user") || "{}")
    const userEmail = currentUser.email || ""

    // Update usuario collection
    const userRef = doc(db, "usuario", userId)
    await updateDoc(userRef, {
      name: profileData.name,
      phone: profileData.phone,
      address: profileData.address || "",
      isProfileComplete: true,
      updatedAt: serverTimestamp(),
    })

    // Create/update perfil collection
    await perfilService.updateProfile(userId, {
      name: profileData.name,
      phone: profileData.phone,
      address: profileData.address || "",
      email: userEmail,
    })

    // Update localStorage
    const updatedUser = {
      ...currentUser,
      name: profileData.name,
      phone: profileData.phone,
      address: profileData.address || "",
      isProfileComplete: true,
    }
    localStorage.setItem("servitec_user", JSON.stringify(updatedUser))

    console.log("✅ User profile completed successfully")
  } catch (error) {
    console.error("❌ Error completing user profile:", error)
    throw error
  }
}
