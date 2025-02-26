// src/components/TestimonialsSection/TestimonialsSection.jsx
import React from 'react';
import './TestimonialsSection.scss';

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: "María García",
      position: "CEO, TechStart",
      content: "Un servicio excepcional que transformó completamente nuestra presencia digital.",
      image: "/api/placeholder/64/64"
    },
    {
      id: 2,
      name: "Carlos Rodríguez",
      position: "Director de Marketing, InnovateSoft",
      content: "La mejor decisión que tomamos fue trabajar con este equipo. Los resultados hablan por sí solos.",
      image: "/api/placeholder/64/64"
    },
    {
      id: 3,
      name: "Laura Martínez",
      position: "Fundadora, DigitalCraft",
      content: "Profesionalismo y creatividad en cada proyecto. Superaron todas nuestras expectativas.",
      image: "/api/placeholder/64/64"
    }
  ];

  return (
    <section className="testimonials-section" id="testimonials">
      <div className="container">
        <h2>Lo que dicen nuestros clientes</h2>
        <p className="section-subtitle">Descubre por qué las empresas confían en nosotros</p>
        
        <div className="testimonials-grid">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="testimonial-card">
              <div className="testimonial-content">
                <p>"{testimonial.content}"</p>
              </div>
              <div className="testimonial-author">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  className="author-image"
                />
                <div className="author-info">
                  <h4>{testimonial.name}</h4>
                  <p>{testimonial.position}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;