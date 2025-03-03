// src/utils/intersectionObserver.js
/**
 * Utilidad para detectar cuando un elemento entra en el viewport
 * y aplicar una clase de animación
 */
export const setupIntersectionObserver = () => {
    // Verificar si IntersectionObserver está disponible
    if (!('IntersectionObserver' in window)) {
      // Fallback para navegadores que no soportan IntersectionObserver
      const sections = document.querySelectorAll('.about-us-section');
      sections.forEach(section => {
        section.classList.add('animate');
      });
      return;
    }
  
    // Configurar el observador
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // Cuando el elemento entra en el viewport
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          // Dejar de observar después de añadir la clase
          observer.unobserve(entry.target);
        }
      });
    }, {
      // Opciones del observador: el elemento debe estar 20% visible
      threshold: 0.2
    });
  
    // Observar todos los elementos con la clase about-us-section
    const sections = document.querySelectorAll('.about-us-section');
    sections.forEach(section => {
      observer.observe(section);
    });
  };