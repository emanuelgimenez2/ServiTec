import React from 'react';
import { ArrowRight, Star, Wifi, Laptop, Globe } from 'lucide-react';
import './ModernLanding.scss';

const ModernLanding = () => {
  return (
    <div className="landing">
      <nav className="nav">
        <div className="nav__logo">
          <Star className="nav__icon" />
          <span className="nav__brand">TechConnect</span>
        </div>
        <div className="nav__menu">
          <a href="#" className="nav__link">Servicios</a>
          <a href="#" className="nav__link">Nosotros</a>
          <button className="button button--primary">Contacto</button>
        </div>
      </nav>

      <main className="main">
        <div className="hero">
          <div className="hero__content">
            <h1 className="hero__title">
              Conectividad del Futuro
            </h1>
            <p className="hero__description">
              Soluciones tecnológicas integrales para tu negocio: PC, notebooks, servicios web y conectividad Starlink.
            </p>
            <button className="button button--primary button--with-icon">
              Comenzar ahora
              <ArrowRight className="button__icon" />
            </button>
          </div>

          <div className="services-grid">
            <div className="service-card">
              <Laptop className="service-card__icon" />
              <h3 className="service-card__title">Revisión de Equipos</h3>
              <p className="service-card__description">Mantenimiento profesional de PCs y notebooks</p>
            </div>

            <div className="service-card">
              <Globe className="service-card__icon" />
              <h3 className="service-card__title">Servicios Web</h3>
              <p className="service-card__description">Desarrollo web moderno y responsive</p>
            </div>

            <div className="service-card">
              <Wifi className="service-card__icon" />
              <h3 className="service-card__title">Starlink</h3>
              <p className="service-card__description">Internet satelital de alta velocidad</p>
            </div>

            <div className="service-card">
              <Star className="service-card__icon" />
              <h3 className="service-card__title">Soporte Premium</h3>
              <p className="service-card__description">Atención personalizada 24/7</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ModernLanding;