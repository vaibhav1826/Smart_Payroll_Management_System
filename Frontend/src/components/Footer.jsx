import React from 'react'
import { Link } from 'react-router-dom'
import Logo from './Logo'

export default function Footer() {
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
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Contact Info</h4>
          <ul className="footer-contact">
            <li>Email: vaibhavbhatt145@gmail.com</li>
            <li>Phone: 9058065003</li>
            <li>Address: Rudrapur, Udham Singh Nagar District, Uttarakhand, India</li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Platform</h4>
          <ul className="footer-links">
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/payroll">Payroll</Link></li>
            <li><Link to="/reports">Reports</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Shiv Enterprises. All rights reserved.</p>
      </div>
    </footer>
  )
}
