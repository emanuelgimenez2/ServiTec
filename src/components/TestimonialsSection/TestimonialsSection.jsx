// src/components/TestimonialsSection/TestimonialsSection.jsx
import React from 'react';
import './TestimonialsSection.scss';

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: "Lucia",
      position: "Cliente",
      content: "Muy buena atención.",
      image: "https://lh3.googleusercontent.com/a-/ALV-UjXHMHmVDU940KdoNu4pTySQHPx4C4jkdW3OqGhrCu6pJopxhpI=w60-h60-p-rp-mo-br100"
    },
    {
      id: 3,
      name: "angel colombo",
      position: "Propietario del Mangrullo",
      content: "Muy buen trabajo de los chicos, colocaron una antena Starlink mini en mi complejo “El Mangrullo“ en Federacion El servicio original no era de buena calidad. Desde que instalamos starlink, no sólo tenemos señal continua, sin interrupciones, sino que, además, se amplió muchísimo el ancho de banda.",
      image: "https://lh3.googleusercontent.com/a-/ALV-UjWd4s058y-fJaEqoltMIZZ3mso7BFQ7G3pLZgjUpoafYIBUQPFuVA=w60-h60-p-rp-mo-ba4-br100"
    },
    {
      id: 2,
      name: "Luciono Ojeda",
      position: "Cliente",
      content: "muy buena atención la de los chicos , saben explicarte hasta el mínimo detalle 💯",
      image: "https://lh3.googleusercontent.com/a-/ALV-UjWHxdSG8-7dFZlLS3P-ZFpNPB7coIuPrPUnNEvYdBjhsY0rYfs=w60-h60-p-rp-mo-br100"
    },
   
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
                  alt={testimonial.name && testimonial.name} 
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