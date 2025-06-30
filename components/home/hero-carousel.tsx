"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Monitor, Satellite, Camera, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"

const slides = [
  {
    id: 1,
    title: "Reparación de Computadoras",
    subtitle: "Servicio técnico especializado",
    description: "Reparamos notebooks, PCs de escritorio, instalamos software y recuperamos datos",
    icon: Monitor,
    buttonText: "Ver Servicios",
    buttonLink: "/servicios/reparacion",
    desktopImage: "/foto 1 pc.png",
    mobileImage: "/foto 1 cel.png",
    gradient: "from-blue-600 via-purple-600 to-orange-500",
  },
  {
    id: 2,
    title: "Instalación Starlink",
    subtitle: "Internet satelital de alta velocidad",
    description: "Instalamos y configuramos tu antena Starlink con garantía completa",
    icon: Satellite,
    buttonText: "Contactar",
    buttonLink: "/contacto",
    desktopImage: "/foto 1 pc.png",
    mobileImage: "/foto 1 cel.png",
    gradient: "from-orange-500 via-red-500 to-purple-600",
  },
  {
    id: 3,
    title: "Cámaras de Seguridad",
    subtitle: "Protege lo que más importa",
    description: "Instalación y configuración de sistemas de videovigilancia",
    icon: Camera,
    buttonText: "Ver Instalaciones",
    buttonLink: "/servicios/camaras",
    desktopImage: "/foto 1 pc.png",
    mobileImage: "/foto 1 cel.png",
    gradient: "from-purple-600 via-blue-600 to-cyan-500",
  },
  {
    id: 4,
    title: "Catálogo de Productos",
    subtitle: "Tecnología al mejor precio",
    description: "Notebooks, celulares, parlantes y más productos tecnológicos",
    icon: Globe,
    buttonText: "Ver Catálogo",
    buttonLink: "/tienda",
    desktopImage: "/foto 1 pc.png",
    mobileImage: "/foto 1 cel.png",
    gradient: "from-cyan-500 via-blue-500 to-purple-600",
  },
]

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const currentSlideData = slides[currentSlide]
  const IconComponent = currentSlideData.icon

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Background with gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${currentSlideData.gradient} transition-all duration-1000`}>
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Background Images - Desktop */}
      <div className="absolute inset-0 hidden md:block">
        <Image
          src={currentSlideData.desktopImage || "/placeholder.svg"}
          alt={currentSlideData.title}
          fill
          className="object-cover opacity-20"
          priority
        />
      </div>

      {/* Background Images - Mobile */}
      <div className="absolute inset-0 block md:hidden">
        <Image
          src={currentSlideData.mobileImage || "/placeholder.svg"}
          alt={currentSlideData.title}
          fill
          className="object-cover opacity-20"
          priority
        />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl text-center md:text-left">
            {/* Icon */}
            <div className="mb-4 md:mb-6 flex justify-center md:justify-start">
              <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-white/10 backdrop-blur-sm rounded-full">
                <IconComponent className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl md:text-7xl font-bold text-white mb-2 md:mb-4 leading-tight">ServiTec</h1>

            {/* Subtitle */}
            <p className="text-lg md:text-2xl text-white/90 mb-3 md:mb-2">Soluciones tecnológicas a tu alcance</p>

            {/* Slide Title */}
            <h2 className="text-xl md:text-4xl font-bold text-white mb-2 md:mb-4">{currentSlideData.title}</h2>

            {/* Slide Subtitle */}
            <p className="text-base md:text-xl text-orange-300 mb-3 md:mb-4">{currentSlideData.subtitle}</p>

            {/* Description */}
            <p className="text-sm md:text-lg text-white/80 mb-6 md:mb-8 max-w-2xl mx-auto md:mx-0 px-4 md:px-0">{currentSlideData.description}</p>

            {/* CTA Button */}
            <Button
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-6 py-3 md:px-8 md:py-4 text-base md:text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              {currentSlideData.buttonText}
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full p-3 transition-all duration-300"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full p-3 transition-all duration-300"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75"
            }`}
          />
        ))}
      </div>

      {/* Scroll Indicator - Hidden on mobile */}
      <div className="absolute bottom-8 right-8 z-20 text-white/70 text-sm hidden md:block">
        <div className="flex items-center space-x-2">
          <span>Desliza para ver más</span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  )
}