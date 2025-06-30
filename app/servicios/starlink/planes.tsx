
      {/* Pricing Section */}
      <section className="py-8 sm:py-12 lg:py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-3 sm:px-4 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">Planes y Precios</h2>
            <p className="text-sm sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-2">
              Opciones flexibles para hogares y empresas, con la mejor relación calidad-precio del mercado
            </p>
          </div>

          {/* Tipos de Antena */}
          <div className="mb-8 sm:mb-12">
            <h3 className="text-xl sm:text-2xl font-bold text-center mb-6 text-gray-900">Tipos de Antena</h3>
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-6 max-w-4xl mx-auto">
              <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg h-full">
                <CardHeader className="text-center pb-2 sm:pb-4 p-3 sm:p-4">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-2 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Satellite className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <CardTitle className="text-sm sm:text-lg font-bold mb-2">Starlink Mini</CardTitle>
                  <div className="text-xl sm:text-2xl font-bold text-blue-600 mb-2">$190.000</div>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 pt-0">
                  <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                    <li className="flex items-start">
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Tamaño:</strong> Compacto y ligero
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Router:</strong> Wi-Fi integrado
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Cobertura:</strong> 112 m²
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Dispositivos:</strong> 128 conexiones
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg h-full">
                <CardHeader className="text-center pb-2 sm:pb-4 p-3 sm:p-4">
                  <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-2 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Satellite className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <CardTitle className="text-sm sm:text-lg font-bold mb-2">Starlink Estándar</CardTitle>
                  <div className="text-xl sm:text-2xl font-bold text-green-600 mb-2">$500.000</div>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 pt-0">
                  <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                    <li className="flex items-start">
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Tamaño:</strong> Más grande, fijo/portátil
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Router:</strong> Wi-Fi Gen 3 separado
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Cobertura:</strong> 297 m²
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Dispositivos:</strong> Más conexiones
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Planes Principales */}
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-6 max-w-4xl mx-auto mb-8">
            {/* Plan Residencial */}
            <Card className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 ring-2 ring-orange-500 h-full">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 sm:px-3 py-1 rounded-b-lg text-xs font-semibold">
                Más Popular
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-3 sm:p-4 mt-4 sm:mt-6">
                <div className="text-center mb-3 sm:mb-4">
                  <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Residencial</h3>
                  <div className="flex bg-white/20 rounded-lg p-1">
                    <button
                      className={`flex-1 py-1 sm:py-2 px-2 sm:px-3 rounded-md text-xs sm:text-sm font-medium transition-all ${
                        residentialPlan === "lite" ? "bg-white/30 text-white" : "text-white/70 hover:bg-white/20"
                      }`}
                      onClick={() => setResidentialPlan("lite")}
                    >
                      Lite
                    </button>
                    <button
                      className={`flex-1 py-1 sm:py-2 px-2 sm:px-3 rounded-md text-xs sm:text-sm font-medium transition-all ${
                        residentialPlan === "comun" ? "bg-white/30 text-white" : "text-white/70 hover:bg-white/20"
                      }`}
                      onClick={() => setResidentialPlan("comun")}
                    >
                      Común
                    </button>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">
                    {residentialData[residentialPlan].price}
                  </div>
                  <p className="text-blue-100 text-xs sm:text-sm">por mes</p>
                </div>
              </div>
              <CardContent className="p-3 sm:p-4">
                <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                  {residentialData[residentialPlan].specs.map((spec, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Plan Itinerante */}
            <Card className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 h-full">
              <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white p-3 sm:p-4">
                <div className="text-center mb-3 sm:mb-4">
                  <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Itinerante</h3>
                  <div className="flex bg-white/20 rounded-lg p-1">
                    <button
                      className={`flex-1 py-1 px-1 sm:px-2 rounded-md text-xs font-medium transition-all ${
                        itinerantePlan === "10gb" ? "bg-white/30 text-white" : "text-white/70 hover:bg-white/20"
                      }`}
                      onClick={() => setItinerantePlan("10gb")}
                    >
                      10GB
                    </button>
                    <button
                      className={`flex-1 py-1 px-1 sm:px-2 rounded-md text-xs font-medium transition-all ${
                        itinerantePlan === "50gb" ? "bg-white/30 text-white" : "text-white/70 hover:bg-white/20"
                      }`}
                      onClick={() => setItinerantePlan("50gb")}
                    >
                      50GB
                    </button>
                    <button
                      className={`flex-1 py-1 px-1 sm:px-2 rounded-md text-xs font-medium transition-all ${
                        itinerantePlan === "ilimitado" ? "bg-white/30 text-white" : "text-white/70 hover:bg-white/20"
                      }`}
                      onClick={() => setItinerantePlan("ilimitado")}
                    >
                      Ilimitado
                    </button>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">
                    {itineranteData[itinerantePlan].price}
                  </div>
                  <p className="text-orange-100 text-xs sm:text-sm">por mes</p>
                </div>
              </div>
              <CardContent className="p-3 sm:p-4">
                <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                  {itineranteData[itinerantePlan].specs.map((spec, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mb-8 sm:mb-12">
            <Button
              variant="outline"
              size="sm"
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white bg-transparent text-xs sm:text-sm lg:text-base"
              onClick={() => setShowAllPlans(!showAllPlans)}
            >
              {showAllPlans ? "Ocultar planes" : "Ver todos los planes"}
            </Button>
          </div>

          {/* Todos los planes */}
          {showAllPlans && (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8 max-w-6xl mx-auto mb-8">
              {/* Itinerante Global */}
              <Card className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-3 sm:p-6">
                  <div className="flex items-center justify-between mb-2 sm:mb-4">
                    <h3 className="text-sm sm:text-xl font-bold">Itinerante Global</h3>
                    <div className="bg-white/20 rounded-full p-1 sm:p-2">
                      <Award className="w-4 h-4 sm:w-6 sm:h-6" />
                    </div>
                  </div>
                  <div className="text-xl sm:text-3xl font-bold mb-1 sm:mb-2">$412.000</div>
                  <p className="text-purple-100 text-xs sm:text-sm">por mes</p>
                </div>
                <CardContent className="p-3 sm:p-6">
                  <ul className="space-y-1 sm:space-y-2 mb-4 sm:mb-6 text-xs sm:text-sm">
                    <li className="flex items-center">
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>Hasta 280 Mbps descarga</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>Hasta 30 Mbps carga</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>25-60ms tierra, &gt;100ms altamar</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>Datos ilimitados + bloques GB</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Prioridad Local */}
              <Card className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="bg-gradient-to-br from-teal-500 to-teal-600 text-white p-3 sm:p-6">
                  <div className="flex items-center justify-between mb-2 sm:mb-4">
                    <h3 className="text-sm sm:text-xl font-bold">Prioridad Local</h3>
                    <div className="bg-white/20 rounded-full p-1 sm:p-2">
                      <Shield className="w-4 h-4 sm:w-6 sm:h-6" />
                    </div>
                  </div>
                  <div className="text-xl sm:text-3xl font-bold mb-1 sm:mb-2">$38.000</div>
                  <p className="text-teal-100 text-xs sm:text-sm">por mes</p>
                </div>
                <CardContent className="p-3 sm:p-6">
                  <ul className="space-y-1 sm:space-y-2 mb-4 sm:mb-6 text-xs sm:text-sm">
                    <li className="flex items-center">
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>45-230 Mbps descarga</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>10-25 Mbps carga</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>25-60ms latencia</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>Ilimitados + bloques 50/500 GB</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Prioridad Global */}
              <Card className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 col-span-2 lg:col-span-1">
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-3 sm:p-6">
                  <div className="flex items-center justify-between mb-2 sm:mb-4">
                    <h3 className="text-sm sm:text-xl font-bold">Prioridad Global</h3>
                    <div className="bg-white/20 rounded-full p-1 sm:p-2">
                      <Globe className="w-4 h-4 sm:w-6 sm:h-6" />
                    </div>
                  </div>
                  <div className="text-xl sm:text-3xl font-bold mb-1 sm:mb-2">$219.000</div>
                  <p className="text-indigo-100 text-xs sm:text-sm">por mes</p>
                </div>
                <CardContent className="p-3 sm:p-6">
                  <ul className="space-y-1 sm:space-y-2 mb-4 sm:mb-6 text-xs sm:text-sm">
                    <li className="flex items-center">
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>Hasta 230 Mbps descarga</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>Hasta 30 Mbps carga</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>25-60ms latencia</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>Datos ilimitados</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>
