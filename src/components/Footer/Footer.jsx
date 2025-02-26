// src/components/Footer/Footer.jsx
import React, { useState } from 'react';
import './Footer.scss';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica de suscripción
    setIsSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section company-info">
          <h3>TuEmpresa</h3>
          <p>Transformando ideas en soluciones digitales innovadoras.</p>
          <div className="social-links">
            <a href="#" className="social-link">LinkedIn</a>
            <a href="#" className="social-link">Twitter</a>
            <a href="#" className="social-link">GitHub</a>
          </div>
        </div>

        <div className="footer-section links">
          <h4>Enlaces Rápidos</h4>
          <ul>
            <li><a href="#inicio">Inicio</a></li>
            <li><a href="#servicios">Servicios</a></li>
            <li><a href="#proyectos">Proyectos</a></li>
            <li><a href="#sobre-nosotros">Sobre Nosotros</a></li>
            <li><a href="#contacto">Contacto</a></li>
          </ul>
        </div>

        <div className="footer-section services">
          <h4>Servicios</h4>
          <ul>
            <li><a href="#desarrollo-web">Desarrollo Web</a></li>
            <li><a href="#apps-moviles">Apps Móviles</a></li>
            <li><a href="#consultoria">Consultoría IT</a></li>
            <li><a href="#cloud">Cloud Solutions</a></li>
          </ul>
        </div>

        <div className="footer-section newsletter">
          <h4>Newsletter</h4>
          <p>Suscríbete para recibir las últimas novedades</p>
          {!isSubscribed ? (
            <form onSubmit={handleSubmit} className="newsletter-form">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Tu email"
                required
              />
              <button type="submit">Suscribirse</button>
            </form>
          ) : (
            <p className="success-message">¡Gracias por suscribirte!</p>
          )}
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} TuEmpresa. Todos los derechos reservados.</p>
          <div className="legal-links">
            <a href="#privacidad">Política de Privacidad</a>
            <a href="#terminos">Términos y Condiciones</a>
            <a href="#cookies">Política de Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;