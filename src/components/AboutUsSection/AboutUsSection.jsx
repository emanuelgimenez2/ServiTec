// src/components/AboutUsSection/AboutUsSection.jsx
import React from 'react';
import './AboutUsSection.scss';

const AboutUsSection = () => {
  // Aquí normalmente importarías tus imágenes reales
  // Para este ejemplo, usaré placeholders
  const images = [
    {
      id: 1,
      src: "/api/placeholder/400/300",
      alt: "Nuestras primeras oficinas",
      className: "about-image about-image--1"
    },
    {
      id: 2,
      src: "/api/placeholder/300/400",
      alt: "Nuestro equipo fundador",
      className: "about-image about-image--2"
    },
    {
      id: 3,
      src: "/api/placeholder/350/250",
      alt: "Primer proyecto completado",
      className: "about-image about-image--3"
    },
    {
      id: 4,
      src: "/api/placeholder/250/350",
      alt: "Instalación de equipos",
      className: "about-image about-image--4"
    },
    {
      id: 5,
      src: "/api/placeholder/320/320",
      alt: "Certificación Starlink",
      className: "about-image about-image--5"
    }
  ];

  return (
    <section className="about-us-section" id="about">
      <div className="container">
        <div className="about-content">
          <div className="about-text">
            <h2>Nuestra Historia</h2>
            <p className="subtitle">Una trayectoria de innovación y excelencia</p>
            
            <div className="about-story">
              <p>
                Fundada en 2015, nuestra empresa nació con una visión clara: transformar el panorama tecnológico para empresas y particulares en nuestra región. Lo que comenzó como un pequeño servicio de reparación de equipos en un modesto local, rápidamente evolucionó hacia soluciones tecnológicas integrales.
              </p>
              
              <p>
                Los primeros años fueron de aprendizaje y crecimiento constante. Con cada cliente satisfecho, nuestra reputación se fortalecía y nuestro catálogo de servicios se expandía. En 2018, dimos un paso decisivo al convertirnos en proveedores certificados de hardware empresarial, atendiendo a nuestros primeros clientes corporativos.
              </p>
              
              <p>
                El verdadero punto de inflexión llegó en 2021, cuando nos convertimos en uno de los primeros instaladores autorizados de Starlink en la región. Esta alianza estratégica nos permitió llevar conectividad de alta velocidad a zonas anteriormente desatendidas, revolucionando la manera en que nuestros clientes rurales y remotos acceden al mundo digital.
              </p>
              
              <p>
                Hoy, con un equipo de especialistas certificados y más de 500 clientes satisfechos, seguimos comprometidos con nuestra misión original: ofrecer soluciones tecnológicas personalizadas que impulsen el éxito de quienes confían en nosotros.
              </p>
            </div>
            
            <div className="about-values">
              <div className="value-item">
                <h3>Innovación</h3>
                <p>Buscamos constantemente las soluciones más avanzadas para nuestros clientes</p>
              </div>
              <div className="value-item">
                <h3>Excelencia</h3>
                <p>Nos comprometemos con los más altos estándares de calidad en cada proyecto</p>
              </div>
              <div className="value-item">
                <h3>Integridad</h3>
                <p>Actuamos con honestidad y transparencia en todas nuestras relaciones</p>
              </div>
            </div>
          </div>
          
          <div className="about-images-collage">
            {images.map((image) => (
              <div key={image.id} className={image.className}>
                <img src={image.src} alt={image.alt} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;