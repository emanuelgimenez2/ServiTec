// components/ContactForm/ContactForm.jsx
import React, { useState } from "react";
import { X } from "lucide-react";
import "./ContactForm.scss";

const ContactForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Limpiar error cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "El nombre es obligatorio";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "El email es obligatorio";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email no válido";
    }
    
    if (!formData.message.trim()) {
      newErrors.message = "El mensaje es obligatorio";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Aquí iría la llamada a tu API o servicio para enviar los datos
      // Por ejemplo: await axios.post('/api/contact', formData);
      
      // Simulamos una respuesta exitosa después de 1 segundo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitSuccess(true);
      // Reset form after successful submission
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
      
      // Opcionalmente, cerrar el modal después de unos segundos
      setTimeout(() => {
        onClose();
      }, 3000);
      
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      setErrors({
        ...errors,
        submit: "Error al enviar el formulario. Inténtalo de nuevo más tarde."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-modal">
      <div className="contact-modal__overlay" onClick={onClose}></div>
      <div className="contact-modal__content">
        <button 
          className="contact-modal__close" 
          onClick={onClose}
          aria-label="Cerrar"
        >
          <X size={24} />
        </button>
        
        <div className="contact-form">
          <h2 className="contact-form__title">Contáctanos</h2>
          
          {submitSuccess ? (
            <div className="contact-form__success">
              <p>¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form__form">
              <div className="contact-form__group">
                <label htmlFor="name" className="contact-form__label">Nombre *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className={`contact-form__input ${errors.name ? 'contact-form__input--error' : ''}`}
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Tu nombre"
                />
                {errors.name && <p className="contact-form__error">{errors.name}</p>}
              </div>
              
              <div className="contact-form__group">
                <label htmlFor="email" className="contact-form__label">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`contact-form__input ${errors.email ? 'contact-form__input--error' : ''}`}
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tucorreo@ejemplo.com"
                />
                {errors.email && <p className="contact-form__error">{errors.email}</p>}
              </div>
              
              <div className="contact-form__group">
                <label htmlFor="phone" className="contact-form__label">Teléfono</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="contact-form__input"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Tu número de teléfono (opcional)"
                />
              </div>
              
              <div className="contact-form__group">
                <label htmlFor="subject" className="contact-form__label">Asunto</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  className="contact-form__input"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Asunto de tu mensaje (opcional)"
                />
              </div>
              
              <div className="contact-form__group">
                <label htmlFor="message" className="contact-form__label">Mensaje *</label>
                <textarea
                  id="message"
                  name="message"
                  className={`contact-form__textarea ${errors.message ? 'contact-form__textarea--error' : ''}`}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Escribe tu mensaje aquí..."
                  rows={5}
                />
                {errors.message && <p className="contact-form__error">{errors.message}</p>}
              </div>
              
              {errors.submit && <p className="contact-form__submit-error">{errors.submit}</p>}
              
              <button 
                type="submit" 
                className="contact-form__submit" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar mensaje'}
              </button>
            </form>
          )}
          
          <p className="contact-form__info">
            También puedes contactarnos directamente en <a href="mailto:info@tuempresa.com" className="contact-form__link">info@tuempresa.com</a> o llamar al <a href="tel:+34600000000" className="contact-form__link">600 000 000</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;