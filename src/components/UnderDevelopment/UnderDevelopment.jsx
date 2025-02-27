// components/UnderDevelopment/UnderDevelopment.jsx
import React from 'react';
import { X, Construction, Clock } from 'lucide-react';
import './UnderDevelopment.scss';

const UnderDevelopment = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="under-development">
      <div className="under-development__overlay" onClick={onClose}></div>
      <div className="under-development__modal">
        <button className="under-development__close" onClick={onClose}>
          <X size={24} />
        </button>
        
        <div className="under-development__content">
          <Construction size={64} className="under-development__icon" />
          <h2 className="under-development__title">¡Estamos trabajando en ello!</h2>
          <p className="under-development__message">
            Nuestro catálogo de productos está en desarrollo. 
            Muy pronto podrás explorar nuestra amplia gama de soluciones tecnológicas.
          </p>
          <div className="under-development__info">
            <div className="under-development__info-item">
              <Clock size={20} />
              <span>Disponible próximamente</span>
            </div>
          </div>
          <button className="under-development__button" onClick={onClose}>
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnderDevelopment;