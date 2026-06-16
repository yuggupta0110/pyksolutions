import React, { useEffect } from 'react';
import Header from './components/Header';
import IntegrationSimulator from './components/IntegrationSimulator';
import BentoGrid from './components/BentoGrid';
import ContactForm from './components/ContactForm';

function App() {
  // Intersection Observer for scroll entrance animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before it is fully in view
      }
    );

    const revealElements = document.querySelectorAll('.scroll-reveal');
    revealElements.forEach((el) => observer.observe(el));

    return () => {
      revealElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const handleScrollTo = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      {/* Background aesthetics */}
      <div className="bg-mesh-container">
        <div className="bg-orb bg-orb-1"></div>
        <div className="bg-orb bg-orb-2"></div>
      </div>
      <div className="bg-grid-overlay"></div>
      <div className="bg-noise-overlay"></div>

      {/* Floating navigation bar */}
      <Header />

      {/* Main Content */}
      <main className="container" style={{ position: 'relative', zIndex: 10 }}>
        
        {/* Hero Section */}
        <section id="hero" style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="hero-content scroll-reveal revealed">
            <span className="eyebrow">
              SAP Certified Integration Professional
            </span>
            <h1 className="hero-title">
              Architecting Connected<br />
              Enterprise Ecosystems
            </h1>
            <p className="hero-subtitle">
              Passionate SAP &amp; Cloud Integration Consultant with 8+ years of experience engineering secure, automated pipelines across SAP BTP, SuccessFactors, S/4HANA, Azure Services, and Custom AI Agents.
            </p>
            <div className="hero-ctas">
              <a href="#simulator" className="btn-pill btn-primary" onClick={(e) => handleScrollTo(e, 'simulator')}>
                Deploy Simulator
                <span className="btn-arrow-wrapper">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </span>
              </a>
              <a href="#contact" className="btn-pill btn-secondary" onClick={(e) => handleScrollTo(e, 'contact')}>
                Discuss Project
              </a>
            </div>
          </div>
        </section>

        {/* Integration Simulator */}
        <section style={{ paddingTop: 0 }}>
          <div className="scroll-reveal">
            <IntegrationSimulator />
          </div>
        </section>

        {/* Bento Grid (Summary, Experience, Skills, Certs, Projects) */}
        <section style={{ paddingTop: 0 }}>
          <BentoGrid />
        </section>

        {/* Contact Form Section */}
        <section style={{ paddingTop: 0, paddingBottom: '160px' }}>
          <ContactForm />
        </section>

      </main>

      {/* Footer */}
      <footer className="footer-wrap">
        <div className="container">
          <ul className="social-links">
            <li>
              <a href="mailto:pyksolutions2026@gmail.com" className="social-link" aria-label="Email Address">
                pyksolutions2026@gmail.com
              </a>
            </li>
            <li>
              <span style={{ color: 'var(--text-muted)' }}>|</span>
            </li>
            <li>
              <a href="tel:+919340203372" className="social-link" aria-label="Phone Number">
                +91-9340203372
              </a>
            </li>
          </ul>
          <p>© {new Date().getFullYear()} PYK Solutions. SAP &amp; Cloud Integration Consultant. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}

export default App;
