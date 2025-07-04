import { useState } from 'react'
import './App.css'
import { Routes, Route } from "react-router-dom";


import Footer from "./components/Footer";

import Hero from './pages/Hero'
import NavBar from './components/Navbar'
import FeaturedProduct from "./pages/FeaturedProduct";
import AboutUs from "./pages/AboutUs";
import OurPurpose from "./pages/OurPurpose";
import Team from "./pages/Team";
import Contact from "./pages/Contact";

function App() {
  return (
      <div className="font-montserrat text-gray-900 scroll-smooth">
      <NavBar />

      <section id="hero">
        <Hero />
      </section>

      <section id="products">
        <FeaturedProduct />
      </section>

      <section id="about">
        <AboutUs />
      </section>

      <section id="purpose">
        <OurPurpose />
      </section>

      <section id="team">
        <Team />
      </section>

      <section id="contact">
        <Contact />
      </section>
      <Footer />
    </div>
    
  )
}

export default App
