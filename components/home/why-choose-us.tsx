import { Award, Users, Clock, Shield } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const stats = [
  {
    icon: Award,
    number: "20+",
    label: "Antenas Starlink Instaladas",
    description: "",
  },
  {
    icon: Shield,
    number: "10+",
    label: "Sistemas de Cámaras",
    description: "",
  },
  {
    icon: Users,
    number: "100+",
    label: "Notebooks Reparadas",
    description: "",
  },
  {
    icon: Clock,
    number: "10+",
    label: "Páginas Web Creadas",
    description: "",
  },
]

const reasons = [
  {
    title: "Experiencia Comprobada",
    description: "Años de experiencia en el sector tecnológico nos respaldan",
  },
  {
    title: "Garantía Total",
    description: "Todos nuestros servicios incluyen garantía completa",
  },
  {
    title: "Precios Competitivos",
    description: "Los mejores precios del mercado sin comprometer la calidad",
  },
  {
    title: "Atención Personalizada",
    description: "Cada cliente recibe un trato personalizado y profesional",
  },
  {
    title: "Soporte Continuo",
    description: "Estamos disponibles para resolver cualquier consulta",
  },
  {
    title: "Tecnología Actualizada",
    description: "Trabajamos con las últimas tecnologías del mercado",
  },
]

export default function WhyChooseUs() {
  return (
    <section className="py-10 sm:py-14 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-2 sm:mb-4">¿Por qué elegir ServiTec?</h2>
          <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Nuestra trayectoria y compromiso nos convierten en la mejor opción para tus necesidades tecnológicas
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-12 sm:mb-16">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <Card
                key={index}
                className="text-center border-0 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <CardContent className="p-4 sm:p-8">
                  <div className="inline-flex items-center justify-center w-10 h-10 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-600 to-violet-600 rounded-full mb-2 sm:mb-4">
                    <IconComponent className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <div className="text-xl sm:text-4xl font-bold text-gray-900 mb-1">{stat.number}</div>
                  <div className="text-sm sm:text-lg font-semibold text-gray-800">{stat.label}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Reasons Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="flex items-start space-x-2 p-3 sm:p-5 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-purple-100 hover:border-purple-200"
            >
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-violet-400 rounded-full mt-2" />
              </div>
              <div>
                <h3 className="text-sm sm:text-lg font-semibold text-gray-900 mb-1">{reason.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600">{reason.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Historia Final */}
        <div className="mt-12 sm:mt-16 bg-gradient-to-r from-purple-900 via-violet-900 to-purple-800 rounded-2xl p-5 sm:p-12 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-xl sm:text-4xl font-bold mb-3 sm:mb-6">Nuestra Historia</h3>
            <p className="text-sm sm:text-lg leading-relaxed text-white/90">
              Iniciamos arreglando notebooks hasta que nos dimos cuenta de lo mucho que podíamos crecer...
            </p>
            <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-5 sm:gap-8 text-center">
              <div>
                <div className="text-xl sm:text-3xl font-bold text-violet-300">2019</div>
                <div className="text-white/80 text-xs sm:text-base">Año de inicio</div>
              </div>
              <div>
                <div className="text-xl sm:text-3xl font-bold text-violet-300">100%</div>
                <div className="text-white/80 text-xs sm:text-base">Clientes satisfechos</div>
              </div>
              <div>
                <div className="text-xl sm:text-3xl font-bold text-violet-300">24/7</div>
                <div className="text-white/80 text-xs sm:text-base">Soporte disponible</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
