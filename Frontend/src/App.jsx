import React, { useState } from 'react'
import Home from './pages/Home'
import About from './pages/About'
import Projects from './pages/Projects'
import Contact from './pages/Contact'

export default function App() {
  const [page, setPage] = useState('home')

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: 20 }}>
      <header style={{ marginBottom: 20 }}>
        <h1>My Personal Site</h1>
        <nav>
          <button onClick={() => setPage('home')}>Home</button>{' '}
          <button onClick={() => setPage('about')}>About</button>{' '}
          <button onClick={() => setPage('projects')}>Projects</button>{' '}
          <button onClick={() => setPage('contact')}>Contact</button>
        </nav>
      </header>

      <main>
        {page === 'home' && <Home />}
        {page === 'about' && <About />}
        {page === 'projects' && <Projects />}
        {page === 'contact' && <Contact />}
      </main>
    </div>
  )
}
