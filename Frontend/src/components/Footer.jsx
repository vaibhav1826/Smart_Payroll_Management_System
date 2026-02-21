import React from 'react'
import Logo from './Logo'

export default function Footer({ setPage }) {
  const currentYear = new Date().getFullYear()

  const handleNavClick = (e, pageName) => {
    e.preventDefault()
    if (setPage) {
      setPage(pageName)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <div className="footer-brand">
            <Logo width={50} height={50} />
            <h3 className="footer-title">Shiv Enterprises</h3>
          </div>
          <p className="footer-description">
            Excellence in every endeavor. Building trust through quality and innovation.
          </p>
        </div>
        
        <div className="footer-section">
          <h4 className="footer-heading">Quick Links</h4>
          <ul className="footer-links">
            <li><a href="#home" onClick={(e) => handleNavClick(e, 'home')}>Home</a></li>
            <li><a href="#about" onClick={(e) => handleNavClick(e, 'about')}>About</a></li>
            <li><a href="#contact" onClick={(e) => handleNavClick(e, 'contact')}>Contact</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4 className="footer-heading">Contact Info</h4>
          <ul className="footer-contact">
            <li>Email: info@shivent.com</li>
            <li>Phone: +1 (555) 123-4567</li>
            <li>Address: Your Business Address</li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4 className="footer-heading">Follow Us</h4>
          <div className="footer-social">
            <a href="#" aria-label="Facebook">Facebook</a>
            <a href="#" aria-label="Twitter">Twitter</a>
            <a href="#" aria-label="LinkedIn">LinkedIn</a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {currentYear} Shiv Enterprises. All rights reserved.</p>
      </div>
    </footer>
  )
}

