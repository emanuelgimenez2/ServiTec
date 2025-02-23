// components/ServicesSection/ServicesSection.jsx
import React from 'react';
import { Laptop, Globe, Wifi, Shield, Cloud, Terminal } from 'lucide-react';
import './ServicesSection.scss';

const ServicesSection = () => {
  const services = [
    {
      icon: <Laptop />,
      title: "Mantenimiento de Equipos",
      description: "Servicio técnico especializado para PCs y notebooks con diagnóstico profesional.",
      features: ["Reparación de hardware", "Actualización de componentes", "Limpieza y optimización"]
    },
    {
      icon: <Globe />,
      title: "Desarrollo Web",
      description: "Creación de sitios web modernos y aplicaciones personalizadas para tu negocio.",
      features: ["Diseño responsive", "E-commerce", "Aplicaciones web"]
    },
    {
      icon: <Wifi />,
      title: "Conectividad Starlink",
      description: "Internet satelital de alta velocidad para zonas urbanas y rurales.",
      features: ["Alta velocidad", "Baja latencia", "Cobertura global"]
    },
    {
      icon: <Shield />,
      title: "Seguridad Digital",
      description: "Protección integral para tus equipos y datos empresariales.",
      features: ["Antivirus empresarial", "Backup en la nube", "Firewall dedicado"]
    },
    {
      icon: <Cloud />,
      title: "Servicios Cloud",
      description: "Soluciones en la nube para optimizar tus operaciones diarias.",
      features: ["Almacenamiento", "Servidores virtuales", "Backup automático"]
    },
    {
      icon: <Terminal />,
      title: "Soporte Técnico",
      description: "Asistencia técnica especializada 24/7 para tu tranquilidad.",
      features: ["Soporte remoto", "Mantenimiento preventivo", "Consultoría IT"]
    }
  ];

  return (
    <section className="services" id="services">
      <div className="services__container">
        <div className="services__header">
          <h2 className="services__title">Nuestros Servicios</h2>
          <p className="services__subtitle">
            Soluciones integrales adaptadas a tus necesidades tecnológicas
          </p>
        </div>

        <div className="services__grid">
          {services.map((service, index) => (
            <div 
              className="service-card" 
              key={index}
              style={{"--delay": `${index * 0.1}s`}}
            >
              <div className="service-card__icon">
                {service.icon}
              </div>
              <h3 className="service-card__title">{service.title}</h3>
              <p className="service-card__description">{service.description}</p>
              <ul className="service-card__features">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="service-card__feature">
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="service-card__hover"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;