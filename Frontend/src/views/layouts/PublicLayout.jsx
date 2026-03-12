import React from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Logo from '../components/Logo';

export default function PublicLayout() {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <nav className="public-nav">
                <div className="public-nav-inner">
                    <Link to="/" className="public-nav-brand" style={{ textDecoration: 'none' }}>
                        <Logo width={38} height={38} />
                        <span className="public-nav-brand-name">
                            Shiv <span>Enterprises</span>
                        </span>
                    </Link>

                    <div className="public-nav-links">
                        <NavLink to="/" end className={({ isActive }) => 'public-nav-link' + (isActive ? ' active' : '')}>Home</NavLink>
                        <NavLink to="/about" className={({ isActive }) => 'public-nav-link' + (isActive ? ' active' : '')}>About</NavLink>
                        <NavLink to="/contact" className={({ isActive }) => 'public-nav-link' + (isActive ? ' active' : '')}>Contact</NavLink>
                    </div>

                    <div className="public-nav-cta">
                        <Link to="/register" className="btn btn-secondary btn-sm">Register</Link>
                        <Link to="/login" className="btn btn-primary btn-sm">Login</Link>
                    </div>
                </div>
            </nav>

            <main style={{ flex: 1 }}>
                <Outlet />
            </main>

            <Footer />
        </div>
    );
}
