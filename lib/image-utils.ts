// Utilidades para manejo de imágenes en base64

export const imageUtils = {
  // Convertir archivo a base64
  fileToBase64: (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = () => reject(new Error("Error al leer el archivo"))
      reader.readAsDataURL(file)
    })
  },

  // Redimensionar imagen manteniendo proporción
  resizeImage: (file: File, maxWidth = 800, maxHeight = 600, quality = 0.8): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      const img = new Image()

      img.onload = () => {
        // Calcular nuevas dimensiones
        let { width, height } = img

        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height
            height = maxHeight
          }
        }

        canvas.width = width
        canvas.height = height

        // Dibujar imagen redimensionada
        ctx?.drawImage(img, 0, 0, width, height)

        // Convertir a base64 con compresión
        const base64 = canvas.toDataURL("image/jpeg", quality)
        resolve(base64)
      }

      img.onerror = () => reject(new Error("Error al procesar la imagen"))
      img.src = URL.createObjectURL(file)
    })
  },

  // Calcular tamaño de base64 en KB
  getBase64Size: (base64: string): number => {
    return (base64.length * 3) / 4 / 1024
  },

  // Validar si es una imagen base64
  isBase64Image: (str: string): boolean => {
    return str.startsWith("data:image/")
  },

  // Comprimir imagen si es muy grande
  compressIfNeeded: async (file: File, maxSizeKB = 500): Promise<string> => {
    let quality = 0.8
    let base64 = await imageUtils.resizeImage(file, 800, 600, quality)

    while (imageUtils.getBase64Size(base64) > maxSizeKB && quality > 0.1) {
      quality -= 0.1
      base64 = await imageUtils.resizeImage(file, 600, 400, quality)
    }

    return base64
  },
}
