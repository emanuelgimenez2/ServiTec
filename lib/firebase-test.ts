import { db } from "./firebase"
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore"

export async function testFirebaseConnection() {
  console.log("🔥 === INICIANDO PRUEBA DE FIREBASE ===")

  try {
    // 1. Verificar conexión básica
    console.log("📡 Verificando conexión a Firebase...")

    // 2. Intentar leer la colección productos
    console.log('📦 Intentando leer colección "productos"...')
    const productosRef = collection(db, "productos")
    const productosSnapshot = await getDocs(productosRef)

    console.log(`✅ Colección "productos" leída exitosamente`)
    console.log(`📊 Documentos encontrados: ${productosSnapshot.size}`)

    // 3. Intentar crear un documento de prueba
    console.log("🧪 Creando documento de prueba...")
    const testDoc = {
      name: "Producto de Prueba",
      price: 1000,
      category: "Test",
      createdAt: new Date().toISOString(),
      isTest: true,
    }

    const docRef = await addDoc(productosRef, testDoc)
    console.log(`✅ Documento de prueba creado con ID: ${docRef.id}`)

    // 4. Eliminar el documento de prueba
    console.log("🗑️ Eliminando documento de prueba...")
    await deleteDoc(doc(db, "productos", docRef.id))
    console.log("✅ Documento de prueba eliminado")

    // 5. Verificar colecciones existentes
    const collections = ["productos", "usuarios", "mensajes", "turnos", "servicios", "ventas"]
    const results = {}

    for (const collectionName of collections) {
      try {
        const snapshot = await getDocs(collection(db, collectionName))
        results[collectionName] = snapshot.size
        console.log(`📋 Colección "${collectionName}": ${snapshot.size} documentos`)
      } catch (error) {
        console.error(`❌ Error en colección "${collectionName}":`, error)
        results[collectionName] = "Error"
      }
    }

    console.log("🎉 === PRUEBA DE FIREBASE COMPLETADA EXITOSAMENTE ===")

    return {
      success: true,
      documentsCount: productosSnapshot.size,
      collections: results,
      message: "Firebase está funcionando correctamente",
    }
  } catch (error) {
    console.error("💥 === ERROR EN PRUEBA DE FIREBASE ===")
    console.error("Error completo:", error)
    console.error("Código de error:", error.code)
    console.error("Mensaje de error:", error.message)

    return {
      success: false,
      error: error.message,
      code: error.code,
    }
  }
}
