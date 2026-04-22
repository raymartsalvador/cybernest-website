import './App.css'
import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";


import Footer from "./components/Footer";

import Hero from './pages/Hero'
import NavBar from './components/Navbar'
import FeaturedProduct from "./pages/FeaturedProduct";
import Team from "./pages/Team";
import Partners from "./pages/Partners";
import Testimonials from "./pages/Testimonials";
import Products from "./pages/Products";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Cookies from "./pages/Cookies";
import Accessibility from "./pages/Accessibility";
import { HomeSkeleton } from "./components/Skeleton";
import Seo from "./components/Seo";
import ConsentBanner from "./components/ConsentBanner";
import ScrollToTop from "./components/ScrollToTop";

function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 650);
    return () => clearTimeout(t);
  }, []);

  const seo = (
    <Seo
      title="Cybernest Solutions — Workflow Automation & Digital Transformation"
      description="Cybernest streamlines traditional workflows with AI-powered queueing, appointment, and certification systems for Philippine businesses and government offices."
      path="/"
    />
  );

  if (loading) return <>{seo}<HomeSkeleton /></>;

  return (
    <div className="font-montserrat text-gray-900 scroll-smooth">
      {seo}
      <NavBar />

      <main id="main" tabIndex={-1} className="outline-none">
        <section id="hero">
          <Hero />
        </section>

        <section id="partners">
          <Partners />
        </section>

        <section id="products">
          <FeaturedProduct />
        </section>

        {/* <section id="team">
          <Team />
        </section> */}

        <section id="testimonials">
          <Testimonials />
        </section>
      </main>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/cookies" element={<Cookies />} />
        <Route path="/accessibility" element={<Accessibility />} />
      </Routes>
      <ConsentBanner />
    </>
  )
}

export default App
