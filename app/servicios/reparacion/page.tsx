"use client"

import React, { useState } from "react"


import { Monitor, Shield, Star, Wrench, Cpu, HardDrive, Download, X, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const services = [
  {
    title: "Limpieza Completa",
    description: "Limpieza interna y externa, cambio de pasta térmica",
    price: "",
    duration: "",
    icon: <Wrench className="w-6 h-6" />,
  },
  {
    title: "Cambio de Componentes",
    description: "RAM, disco duro, teclado, pantalla, batería",
    price: "",
    duration: "",
    icon: <Cpu className="w-6 h-6" />,
  },
  {
    title: "Reparación de Software",
    description: "Eliminación de virus, optimización del sistema",
    price: "",
    duration: "",
    icon: <Monitor className="w-6 h-6" />,
  },
  {
    title: "Formateo e Instalación",
    description: "Windows 11, drivers, programas básicos",
    price: "",
    duration: "",
    icon: <HardDrive className="w-6 h-6" />,
  },
  {
    title: "Recuperación de Datos",
    description: "Recuperación de archivos perdidos o dañados",
    price: "",
    duration: "",
    icon: <Shield className="w-6 h-6" />,
  },
  {
    title: "Instalación de Programas",
    description: "Office, antivirus, programas específicos con licencia",
    price: "",
    duration: "",
    icon: <Download className="w-6 h-6" />,
  },
]

const portfolio = [
  {
    id: 1,
    title: "Notebook HP - Limpieza Completa",
    description: [
      "Desarme completo y limpieza interna profunda ",
      "Cambio de pasta térmica ",
      "Reemplazo del disco mecánico por un SSD (¡más velocidad y durabilidad!) ",
      "Ampliación de memoria RAM ",
      "Formateo completo ",
      "Instalación de todos los programas esenciales "
    ],
    shortDescription: [
      "Desarme completo y limpieza interna profunda",
    ],
    image: "/pc1.jpg",
    before: "Sobrecalentamiento constante",
    after: "Temperatura normal, rendimiento óptimo",
  },
  {
    id: 2,
    title: "Notebook Dell - Cambio de disco duro por un SSD",
    description: [
      "Cambio de disco duro por un SSD ",
      "Cambio de teclado ",
      "Instalación de Windows nuevo y original ",
      "Formateo completo ",
      "Limpieza interna y revisión de todos los componentes "
    ],
    shortDescription: [
      "Cambio de disco duro por un SSD ",
    ],
    image: "/pc2.jpg",
    before: "Lentitud extrema",
    after: "Rendimiento como nueva",
  },
  {
    id: 3,
    title: "Notebook EXO - Cambio de disco duro por un SSD",
    description: [
      "Cambio de disco por SSD ",
      "Instalación y configuración de Windows ",
      "Limpieza interna ",
      "Revisión completa de hardware "
    ],
    shortDescription: [
      "Instalación y configuración de Windows"
    ],
    image: "/pc3.jpg",
    before: "Disco duro dañado",
    after: "Funcionamiento perfecto",
  },
]

const process = [
  { step: 1, title: "Diagnóstico Gratuito", description: "Evaluamos el problema y te damos un presupuesto sin costo" },
  {
    step: 2,
    title: "Presupuesto Detallado",
    description: "Te explicamos qué necesita tu equipo y los costos involucrados",
  },
  { step: 3, title: "Reparación", description: "Realizamos el trabajo con repuestos originales y garantía" },
  {
    step: 4,
    title: "Pruebas y Entrega",
    description: "Probamos todo funcione correctamente antes de entregarte tu equipo",
  },
]

const testimonials = [
  {
    name: "Carlos Rodríguez",
    comment:
      "Mi notebook tenía problemas graves y pensé que no tenía arreglo. Los chicos de ServiTec la dejaron como nueva.",
    rating: 5,
    service: "Reparación completa",
  },
  {
    name: "María González",
    comment: "Excelente servicio, muy profesionales. Recuperaron todos mis archivos importantes.",
    rating: 5,
    service: "Recuperación de datos",
  },
  {
    name: "Roberto Silva",
    comment: "Rápido y eficiente. El precio fue muy justo y la garantía me dio mucha tranquilidad.",
    rating: 5,
    service: "Cambio de componentes",
  },
]

// Modal Component
const PortfolioModal = ({ work, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-lg max-w-xs sm:max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-2 sm:p-4 flex justify-between items-center">
          <h3 className="text-xs sm:text-lg font-semibold text-gray-900 pr-1 sm:pr-2 leading-tight">{work.title}</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
          >
            <X className="w-3 h-3 sm:w-5 sm:h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="p-2 sm:p-4">
          <div className="aspect-square w-1/2 mx-auto relative mb-2 sm:mb-4 rounded-lg overflow-hidden">
            <img src={work.image || "/placeholder.svg"} alt={work.title} className="w-full h-full object-cover" />
          </div>
          
          <div className="space-y-2 sm:space-y-4">
            <div>
              <h4 className="text-xs sm:text-base font-medium text-gray-900 mb-1 sm:mb-2">Descripción completa:</h4>
              <ul className="text-xs sm:text-sm text-gray-600 leading-tight sm:leading-relaxed space-y-0.5 sm:space-y-1">
                {work.description.map((item, index) => (
                  <li key={index} className="flex items-start">
                    {index === 0 ? (
                      <span>{item}</span>
                    ) : (
                      <>
                        <span className="text-orange-500 mr-1 sm:mr-2 flex-shrink-0">•</span>
                        <span>{item}</span>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="grid grid-cols-1 gap-2 sm:gap-4">
              <div className="bg-red-50 p-1.5 sm:p-3 rounded-lg">
                <span className="text-xs font-medium text-red-600">Antes:</span>
                <p className="text-xs text-gray-700 mt-0.5 sm:mt-1">{work.before}</p>
              </div>
              <div className="bg-green-50 p-1.5 sm:p-3 rounded-lg">
                <span className="text-xs font-medium text-green-600">Después:</span>
                <p className="text-xs text-gray-700 mt-0.5 sm:mt-1">{work.after}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ReparacionPage() {
  const [selectedWork, setSelectedWork] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (work) => {
    setSelectedWork(work);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedWork(null);
  };

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-900 via-green-800 to-teal-900 text-white">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=600&width=1200')] opacity-10" />
        <div className="relative container mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8 lg:py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-full p-3 sm:p-4">
                <Monitor className="w-8 h-8 sm:w-12 sm:h-12 text-teal-300" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white to-teal-200 bg-clip-text text-transparent">
              Servicio técnico especializado
            </h1>
            <p className="text-base sm:text-lg lg:text-xl xl:text-2xl mb-6 sm:mb-8 text-teal-100 leading-relaxed px-2">
              En notebooks y PCs de escritorio.
            </p>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-6 sm:mb-8 px-2">
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30 px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm">
                <Wrench className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Limpieza Completa
              </Badge>
              <Badge className="bg-teal-500/20 text-teal-300 border-teal-500/30 px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm">
                <Cpu className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Cambio de Componentes
              </Badge>
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm">
                <HardDrive className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Formateo
              </Badge>
            </div>
            <Button
              size="sm"
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 text-sm sm:text-base lg:text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => (window.location.href = "/contacto")}
            >
              Solicitar Información
              <Monitor className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-8 sm:py-12 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
              Nuestros Servicios
            </h2>
            <p className="text-sm sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
              Soluciones completas para todos los problemas de tu equipo
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 border-0 shadow-md group">
                <CardContent className="p-3 sm:p-4 lg:p-6">
                  <div className="flex items-start mb-3 sm:mb-4">
                    <div className="bg-gradient-to-r from-purple-600 to-orange-500 text-white p-2 sm:p-3 rounded-lg mr-2 sm:mr-4 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                      {React.cloneElement(service.icon, { className: "w-4 h-4 sm:w-6 sm:h-6" })}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 mb-1 sm:mb-2 line-clamp-2">
                        {service.title}
                      </h3>
                      <p className="text-xs sm:text-sm lg:text-base text-gray-600 line-clamp-3">
                        {service.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Shield className="w-4 h-4 sm:w-6 sm:h-6 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-8 sm:py-12 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">Nuestro Proceso</h2>
            <p className="text-sm sm:text-lg lg:text-xl text-gray-600">
              Así trabajamos para garantizar la mejor experiencia
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {process.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-600 to-orange-500 rounded-full flex items-center justify-center text-white text-lg sm:text-2xl font-bold mx-auto mb-2 sm:mb-4">
                  {item.step}
                </div>
                <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 mb-1 sm:mb-2 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm lg:text-base text-gray-600 line-clamp-3">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio - Más Compacto */}
      <section className="py-8 sm:py-12 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
              Trabajos Realizados
            </h2>
            <p className="text-sm sm:text-lg lg:text-xl text-gray-600">Algunos de nuestros casos de éxito</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
            {portfolio.map((work) => (
              <Card key={work.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="aspect-square relative overflow-hidden">
                  <img src={work.image || "/placeholder.svg"} alt={work.title} className="w-full h-full object-cover" />
                </div>
                <CardContent className="p-3 sm:p-4">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 line-clamp-2">
                    {work.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2">
                    {work.shortDescription}
                  </p>
                  {/* Antes y Después - Solo visible en desktop */}
                  <div className="space-y-1 mb-3 hidden sm:block">
                    <div className="flex items-start text-xs">
                      <span className="font-medium text-red-600 mr-1 flex-shrink-0">Antes:</span>
                      <span className="text-gray-600 line-clamp-1">{work.before}</span>
                    </div>
                    <div className="flex items-start text-xs">
                      <span className="font-medium text-green-600 mr-1 flex-shrink-0">Después:</span>
                      <span className="text-gray-600 line-clamp-1">{work.after}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openModal(work)}
                    className="w-full text-xs sm:text-sm text-orange-600 hover:text-orange-700 hover:bg-orange-50 p-1"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    Ver más
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-8 sm:py-12 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
              Lo que dicen nuestros clientes
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-md">
                <CardContent className="p-3 sm:p-4 lg:p-6">
                  <div className="flex items-center mb-2 sm:mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-3 sm:mb-4 line-clamp-4">
                    "{testimonial.comment}"
                  </p>
                  <div>
                    <p className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-1">{testimonial.name}</p>
                    <p className="text-xs sm:text-sm text-gray-500 line-clamp-1">{testimonial.service}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      <PortfolioModal
        work={selectedWork}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  )
}