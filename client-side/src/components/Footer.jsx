import React from 'react';
import { Link } from 'react-router-dom';
import { FaTelegram, FaYoutube, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import profileImage from '../../src/assets/moseb.jpg';

function Footer() {
  const isMobile = window.innerWidth <= 768;

  const containerStyle = {
    padding: '30px 15px',
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    justifyContent: 'space-between',
    alignItems: isMobile ? 'center' : 'flex-start',
    backgroundColor: '#f0f0f0',
    fontFamily: 'Arial, sans-serif',
    flexWrap: 'wrap',
    gap: '20px',
  };

  const sectionStyle = {
    flex: '1 1 300px',
    marginBottom: isMobile ? '20px' : '0',
    textAlign: isMobile ? 'center' : 'left',
  };

  const logoStyle = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    alignItems: 'center',
    gap: '15px',
  };

  const profileImgStyle = {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginBottom: isMobile ? '10px' : '0',
  };

  const socialIconsStyle = {
    display: 'flex',
    justifyContent: isMobile ? 'center' : 'flex-start',
    gap: '15px',
    marginTop: '10px',
    flexWrap: 'wrap',
  };

  const hrStyle = {
    width: '100%',
    border: 'none',
    borderTop: '1px solid #ccc',
    margin: '30px 0 15px',
  };

  const footerBottomStyle = {
    width: '100%',
    textAlign: 'center',
    fontSize: '14px',
    color: '#555',
  };

  return (
    <footer style={containerStyle}>
      {/* Logo & Header */}
      <div style={sectionStyle}>
        <div style={logoStyle}>
          <img src={profileImage} alt="Profile" style={profileImgStyle} />
          <div>
            <h2 style={{ margin: 0 }}>MENNA (መና)</h2>
            <p style={{ fontWeight: 'bold', fontSize: '15px', margin: 0 }}>
              Elderly & Mentally Challenging Support Center
            </p>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div style={sectionStyle}>
        <h3>📞 Contact</h3>
        <p>Phone:<a href="tel:+251934641309">+251 934641309</a></p>
        <p>Phone:<a href="tel:+251934641310">+251 9 34 64 13 10</a></p>
        <p>Phone:<a href="tel:+33664495674">+33664495674</a></p>
        <p>Phone:<a href="tel:+14257800316">+14257800316</a></p>
        <p>Phone:<a href="tel:+15713989298">+15713989298</a></p>
        <p>Email:<a href="mailto:asre45900@gmail.com">📩 asre45900@gmail.com</a></p>
        <p><a href="sms:+251943753120">📱 Send SMS</a></p>
        <p>WhatsApp
          <a href="https://wa.me/251943753120" target="_blank" rel="noopener noreferrer">
            💬 WhatsApp Chat
          </a>
        </p>
        <p>📍 Gondar City Kebele 15, Around Stadium</p>
      </div>

      {/* Social Media */}
      <div style={sectionStyle}>
        <h3>🌐 Social Media</h3>
        <div style={socialIconsStyle}>
          <a href="https://t.me/menacharity" target="_blank" rel="noopener noreferrer"><FaTelegram size={24} /></a>
          <a href="https://youtube.com/your_channel" target="_blank" rel="noopener noreferrer"><FaYoutube size={24} /></a>
          <a href="https://facebook.com/your_page" target="_blank" rel="noopener noreferrer"><FaFacebook size={24} /></a>
          <a href="https://twitter.com/your_page" target="_blank" rel="noopener noreferrer"><FaTwitter size={24} /></a>
          <a href="https://instagram.com/your_page" target="_blank" rel="noopener noreferrer"><FaInstagram size={24} /></a>
        </div>
      </div>

      <hr style={hrStyle} />

      {/* Footer Bottom */}
      <div style={footerBottomStyle}>
        <p>
          <span style={{ marginRight: '10px' }}>F.A.Q</span>|
          <span style={{ margin: '0 10px' }}>Privacy</span>|
          <span style={{ marginLeft: '10px' }}>Terms & Conditions</span>
        </p>
        <p>
          &copy; 2025 Menna Center. All rights reserved. Developed by{' '}
          <Link to="https://www.linkedin.com/in/asregide-firdie-as12?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" style={{ textDecoration: 'none', color: '#0077cc' }}>Aseregide Firdie</Link>.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
