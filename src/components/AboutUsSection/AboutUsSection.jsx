// src/components/AboutUsSection/AboutUsSection.jsx
import React from "react";
import "./AboutUsSection.scss";
import pc from "../../img/pc.jpg";
import starlink from "../../img/starlink.jpg";
import ip from "../../img/ip.jpg";

const AboutUsSection = () => {
  // Array de imágenes con las referencias correctas
  const images = [
    {
      id: 1,
      src: pc, // Referencia directa a la imagen importada
      alt: "Nuestras primeras oficinas",
      className: "about-image about-image--1",
    },
    {
      id: 2, // Corregido: debe ser un número, no un objeto
      src: ip, // Referencia directa a la imagen importada
      alt: "Nuestro equipo fundador",
      className: "about-image about-image--2",
    },
    {
      id: 3, // Corregido: debe ser un número, no un objeto
      src: starlink, // Referencia directa a la imagen importada
      alt: "Primer proyecto completado",
      className: "about-image about-image--3",
    },
    {
      id: 4,
      src:ip, // Mantenemos los placeholders para estas imágenes
      alt: "Instalación de equipos",
      className: "about-image about-image--4",
    },
    {
      id: 5,
      src:starlink, // Mantenemos los placeholders para estas imágenes
      alt: "Certificación Starlink",
      className: "about-image about-image--5",
    },
  ];

  return (
    <section className="about-us-section" id="about">
      <div className="container">
        <div className="about-content">
          <div className="about-text">
            <h2>Nuestra Historia</h2>
            <p className="subtitle">
              Una trayectoria de innovación y excelencia
            </p>

            <div className="about-story">
              <p>
                Nuestra historia es sencilla pero apasionante. En 2025, dos
                estudiantes de sistemas y automatización se unieron con un sueño
                en común: crear algo que marcara la diferencia en el mundo
                tecnológico.
              </p>

              <p>
                Comenzamos como un pequeño proyecto entre compañeros de
                universidad, pero rápidamente descubrimos que nuestras
                habilidades complementarias y pasión compartida podían
                convertirse en algo más grande.
              </p>

              <p>
                Con determinación y muchas noches de trabajo, transformamos
                nuestra idea inicial en el emprendimiento que ves hoy. Nuestro
                enfoque siempre ha sido claro: desarrollar soluciones
                tecnológicas accesibles y efectivas que resuelvan problemas
                reales.
              </p>

              <p>
                Aunque somos jóvenes en el mercado, nuestro conocimiento
                actualizado y enfoque innovador nos permite ofrecer servicios
                que combinan las últimas tendencias con una atención
                personalizada que las grandes empresas no pueden igualar.
              </p>

              <p>
                Cada día seguimos aprendiendo y creciendo, manteniendo vivo el
                espíritu emprendedor que nos impulsó desde el primer momento.
              </p>
            </div>

            <div className="about-values">
              <div className="value-item">
                <h3>Innovación</h3>
                <p>
                  Buscamos constantemente las soluciones más avanzadas para
                  nuestros clientes
                </p>
              </div>
              <div className="value-item">
                <h3>Excelencia</h3>
                <p>
                  Nos comprometemos con los más altos estándares de calidad en
                  cada proyecto
                </p>
              </div>
              <div className="value-item">
                <h3>Integridad</h3>
                <p>
                  Actuamos con honestidad y transparencia en todas nuestras
                  relaciones
                </p>
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