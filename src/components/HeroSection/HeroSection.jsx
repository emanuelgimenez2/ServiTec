// components/HeroSection/HeroSection.jsx
import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import './HeroSection.scss';
import img from "../../img/una notebook más de cerca o un operación realizando una instalación de Starlink (1).png";
import UnderDevelopment from '../UnderDevelopment/UnderDevelopment';

const HeroSection = () => {
  const [showDevelopmentModal, setShowDevelopmentModal] = useState(false);

  const handleShowProducts = () => {
    setShowDevelopmentModal(true);
  };

  const handleCloseModal = () => {
    setShowDevelopmentModal(false);
  };

  return (
    <section className="hero">
      <div className="hero__container">
        <div className="hero__content">
          <h1 className="hero__title">
            Transformamos tu
            <span className="hero__title-highlight"> Mundo Digital</span>
          </h1>
          <p className="hero__description">
            Soluciones tecnológicas de vanguardia que impulsan el futuro de tu negocio. 
            Desde hardware hasta conectividad Starlink.
          </p>
          <div className="hero__cta-group">
            <button 
              className="hero__cta-primary"
              onClick={handleShowProducts}
            >
              Ver nuestros Productos <ArrowRight className="hero__cta-icon" />
            </button>
          </div>
          <div className="hero__stats">
            <div className="hero__stat">
              <span className="hero__stat-number">500+</span>
              <span className="hero__stat-label">Clientes</span>
            </div>
            <div className="hero__stat">
              <span className="hero__stat-number">98%</span>
              <span className="hero__stat-label">Satisfacción</span>
            </div>
          </div>
        </div>
        <div className="hero__image-container">
          <img 
            src={img} 
            alt="Tech Innovation" 
            className="hero__image hero__image--main" 
          />
        
        </div>
      </div>

      {/* Modal de "En Desarrollo" */}
      <UnderDevelopment 
        isOpen={showDevelopmentModal} 
        onClose={handleCloseModal} 
      />
    </section>
  );
};

export default HeroSection;