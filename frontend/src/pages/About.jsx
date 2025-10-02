import React from 'react';
import { FaPhone, FaEnvelope } from "react-icons/fa";
import { Link } from 'react-router-dom';
import "./About.css";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="about-container">
      
      {/* Top Image with Button */}
      <div className="about-image">
        <img src="about.jpeg" alt="About Us" />
        <button className="about-btn" onClick={() => navigate("/product-search")}>Get in Touch</button>
      </div>

      {/* Info Section */}
      <div className="about-content">
        <h2>About Us</h2>
        <p>
          We are a decentralized supply chain platform that helps customers
          track products with full transparency and trust using blockchain technology.
        </p>

        <h2>Our Mission</h2>
        <p>
          Our mission is to bring trust and transparency in supply chains
          using blockchain technology.
        </p>
        <ul>
          <li>Transparency at every step</li>
          <li>Empowering businesses & customers</li>
          <li>Secure and reliable product tracking</li>
        </ul>

        <h2>Why Choose Us?</h2>
        <ul>
          <li>Track every stage of the product journey with live updates.</li>
          <li>Ensure products are genuine with blockchain-backed verification.</li>
          <li>Get fair and clear pricing without hidden charges or disputes.</li>
          <li>Secure access control for manufacturers, transporters, and retailers.</li>
        </ul>

        <h2>Get in Touch</h2>
        <p>We’d love to hear from you!</p>
        <p><FaEnvelope className="icon" /> supply@gmail.com</p>
        <p><FaPhone className="icon" /> +91 234364536</p>
        
        <Link to="/contact" className="contact-link">CONTACT US</Link>
      </div>
    </div>
  );
};

export default About;
