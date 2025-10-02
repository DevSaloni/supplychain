import React from 'react'
import { Link } from 'react-router-dom';
import { FaTelegram, FaInstagram, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import "./Footer.css";

const Footer = () => {
  return (
    <footer className='footer-container'>
      
      {/* Platform Info */}
      <div className="platform-info">
        <h2>SupplyChain</h2>
        <p>
          A decentralized platform to track product history, 
          ensure authenticity, and resolve disputes transparently.
        </p>
      </div>

      {/* Address */}
      <div className="address">
        <h4>Office</h4>
        <p>Andheri Road, <span>Pune, Maharashtra</span></p>
        <p>PIN: 415539</p>
        <p>India </p>
        <p className='email'>Email: <a href="mailto:supply29service@gmail.com">supply29service@gmail.com</a></p>
        <p>Contact: +91 98263 745364</p>
      </div>

      {/* Quick Links */}
      <div className='quick-links'>
        <h4>Quick Links</h4>
        <Link to="/home">Home</Link>
        <Link to="/product-search">Products</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact Us</Link>
      </div>

      {/* Social Links */}
      <div className='social-links'>
        <h4>Follow Us</h4>
        <a href="#" aria-label="Instagram"><FaInstagram /></a>
        <a href="#" aria-label="Telegram"><FaTelegram /></a>
        <a href="#" aria-label="Twitter"><FaTwitter /></a>
        <a href="#" aria-label="Whatsapp"><FaWhatsapp /></a>
      </div>

    </footer>
  )
}

export default Footer
