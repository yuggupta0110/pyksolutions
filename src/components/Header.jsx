import React, { useState } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLinkClick = (e, id) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <nav className="floating-nav">
        <a href="#" className="nav-brand" onClick={(e) => handleLinkClick(e, 'hero')}>
          <span className="nav-brand-dot"></span>
          PYK SOLUTIONS
        </a>

        {/* Desktop Links */}
        <ul className="nav-links">
          <li>
            <a href="#simulator" className="nav-link" onClick={(e) => handleLinkClick(e, 'simulator')}>
              iFlow Simulator
            </a>
          </li>
          <li>
            <a href="#about" className="nav-link" onClick={(e) => handleLinkClick(e, 'about')}>
              About
            </a>
          </li>
          <li>
            <a href="#skills" className="nav-link" onClick={(e) => handleLinkClick(e, 'skills')}>
              Skills
            </a>
          </li>
          <li>
            <a href="#projects" className="nav-link" onClick={(e) => handleLinkClick(e, 'projects')}>
              Projects
            </a>
          </li>
        </ul>

        <a href="#contact" className="nav-cta" onClick={(e) => handleLinkClick(e, 'contact')}>
          Contact
        </a>

        {/* Hamburger Menu Toggle (Mobile) */}
        <button 
          className="nav-toggle" 
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
        >
          <span className="nav-toggle-line" style={{ transform: mobileMenuOpen ? 'rotate(45deg) translateY(8px)' : 'none' }}></span>
          <span className="nav-toggle-line" style={{ opacity: mobileMenuOpen ? 0 : 1 }}></span>
          <span className="nav-toggle-line" style={{ transform: mobileMenuOpen ? 'rotate(-45deg) translateY(-8px)' : 'none' }}></span>
        </button>
      </nav>

      {/* Mobile Nav Overlay */}
      <div className={`mobile-nav-overlay ${mobileMenuOpen ? 'open' : ''}`}>
        <ul className="mobile-nav-links">
          <li>
            <a href="#hero" className="mobile-nav-link" onClick={(e) => handleLinkClick(e, 'hero')}>
              Home
            </a>
          </li>
          <li>
            <a href="#simulator" className="mobile-nav-link" onClick={(e) => handleLinkClick(e, 'simulator')}>
              iFlow Simulator
            </a>
          </li>
          <li>
            <a href="#about" className="mobile-nav-link" onClick={(e) => handleLinkClick(e, 'about')}>
              About Summary
            </a>
          </li>
          <li>
            <a href="#skills" className="mobile-nav-link" onClick={(e) => handleLinkClick(e, 'skills')}>
              Skills
            </a>
          </li>
          <li>
            <a href="#projects" className="mobile-nav-link" onClick={(e) => handleLinkClick(e, 'projects')}>
              Projects
            </a>
          </li>
          <li>
            <a href="#contact" className="mobile-nav-link" onClick={(e) => handleLinkClick(e, 'contact')}>
              Contact
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}
