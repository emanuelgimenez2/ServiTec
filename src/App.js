// App.jsx
import React from 'react';
import Navbar from './components/Navbar/Navbar';
import HeroSection from './components/HeroSection/HeroSection';
import './App.scss';
import ServicesSection from './components/ServicesSection/ServicesSection';
import TestimonialsSection from './components/TestimonialsSection/TestimonialsSection';

const App = () => {
  return (
    <div className="app">
      <Navbar />
      <main className="main">
        <HeroSection />
        <ServicesSection/>
        <TestimonialsSection/>
      </main>
    </div>
  );
};

export default App;
