import React, { useState } from 'react'
import Home from './pages/Home'
import About from './pages/About'
import Projects from './pages/Projects'
import Contact from './pages/Contact'
import Logo from './components/Logo'
import Footer from './components/Footer'

export default function App() {
  const [page, setPage] = useState('home')

  return (
    <div className="app-container">
      <header className="navbar">
        <div className="brand" onClick={() => setPage('home')}>
          <Logo width={60} height={60} />
          <div className="company-name">Shiv Enterprises</div>
        </div>
        <nav className="nav-menu">
          <button
            className={`nav-button ${page === 'home' ? 'active' : ''}`}
            onClick={() => setPage('home')}
          >
            Home
          </button>
          <button
            className={`nav-button ${page === 'about' ? 'active' : ''}`}
            onClick={() => setPage('about')}
          >
            About
          </button>
          <button
            className={`nav-button ${page === 'projects' ? 'active' : ''}`}
            onClick={() => setPage('projects')}
          >
            Projects
          </button>
          <button
            className={`nav-button ${page === 'contact' ? 'active' : ''}`}
            onClick={() => setPage('contact')}
          >
            Contact
          </button>
        </nav>
      </header>

      <main className="main-content">
        {page === 'home' && <Home />}
        {page === 'about' && <About />}
        {page === 'projects' && <Projects />}
        {page === 'contact' && <Contact />}
      </main>
      <Footer setPage={setPage} />
    </div>
  )
}
