// components/Navbar/Navbar.jsx
import React, { useState } from "react";
import { Star, Menu, X } from "lucide-react";
import "./Navbar.scss";
import logo from "../../img/logo2.png"; 
import ContactForm from "../ContactForm/ContactForm";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const handleContactClick = () => {
    setIsContactModalOpen(true);
    setIsMenuOpen(false); // Cierra el menú móvil si está abierto
  };

  return (
    <nav className="navbar">
      <div className="navbar__container">
        
        <img src={logo} alt="Logo" className="navbar__icon" />
        
        <button
          className="navbar__mobile-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X size={10} className="navbar__menu-icon" />
          ) : (
            <Menu size={24} className="navbar__menu-icon" />
          )}
        </button>

        <div
          className={`navbar__menu ${isMenuOpen ? "navbar__menu--open" : ""}`}
        >
          <a href="#services" className="navbar__link">
            Servicios
          </a>
          <a href="#about" className="navbar__link">
            Nosotros
          </a>
          <a href="#testimonials" className="navbar__link">
            Testimonios
          </a>
          <button className="navbar__cta" onClick={handleContactClick}>
            Contactar
          </button>
        </div>
      </div>

      {/* Modal de Contacto */}
      {isContactModalOpen && (
        <ContactForm onClose={() => setIsContactModalOpen(false)} />
      )}
    </nav>
  );
};

export default Navbar;