import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import profileImage from '../../src/assets/moseb.jpg';

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Update `isMobile` when window is resized
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header style={{
      backgroundColor: 'hsla(261, 85.00%, 55.70%, 0.10)',
      padding: '0.5rem 1.5rem',
      boxShadow: '0 4px 8px rgba(236, 227, 227, 0.1)',
      position: 'sticky',
      top: 0,
    zIndex: 3000,
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.8rem',
          color: 'black',
          fontWeight: 'bold',
          fontSize: '1.5rem',
          userSelect: 'none',
        }}>
          <img
            src={profileImage}
            alt="Profile"
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              objectFit: 'cover',
              boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
            }}
          />
          <h2>Menna Center</h2>
        </div>

        {isMobile && (
          <button
            className="menu-toggle"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            style={{
              fontSize: '1.8rem',
              color: 'black',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {isOpen ? '✕' : '☰'}
          </button>
        )}

        <nav className={`navbar ${isMobile ? (isOpen ? 'open' : '') : ''}`}>
          {[
            { to: '/', label: 'Home' },
            { to: '/about', label: 'About' },
            { to: '/our cause', label: 'Our Cause' },
            // { to: '/news', label: 'News' },
            { to: '/contact', label: 'Contact Us' },
            { to: '/gallery', label: 'Gallery' },
            { to: '/donate', label: 'Donate' },
          ].map(({ to, label }, i) => (
            <Link
              key={label}
              to={to}
              onClick={() => setIsOpen(false)}
              onMouseEnter={() => setHoverIndex(i)}
              onMouseLeave={() => setHoverIndex(null)}
              style={{
                color: hoverIndex === i ? 'rgb(50,233,139)' : 'black',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '1rem',
                padding: '0.5rem 1.5rem',
                display: 'block',
              }}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>

      <style>{`
        .navbar {
          display: flex;
          gap: 1.5rem;
        }

        @media (max-width: 768px) {
          .navbar {
            display: none;
            flex-direction: column;
            width: 100%;
            background-color:hsl(241, 79.90%, 62.90%);
            padding: 1rem 0;
            border-radius: 0 0 12px 12px;
          }

          .navbar.open {
            display: flex;
          }

          .navbar a {
            padding-left: 1.5rem;
          }

          .menu-toggle {
            display: block;
          }
        }
      `}</style>
    </header>
  );
}

export default Header;
