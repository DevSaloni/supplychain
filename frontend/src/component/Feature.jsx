import React from 'react'
import { FaMapMarkedAlt, FaCertificate, FaMoneyCheckAlt, FaUserShield } from 'react-icons/fa'
import "./Feature.css";

const Feature = () => {
  return (
    <div className='feature-container'>
      <h2>Features & Benefits</h2>
      <div className='feature-card-container'>

        <div className='feature-card'>
          <FaMapMarkedAlt className='feature-icon'/>
          <h4>Real-Time Tracking</h4>
          <p>Track every stage of the product journey with live updates.</p>
        </div>

        <div className='feature-card'>
          <FaCertificate className='feature-icon'/>
          <h4>Verified Authenticity</h4>
          <p>Ensure products are genuine with blockchain-backed verification.</p>
        </div>

        <div className='feature-card'>
          <FaMoneyCheckAlt className='feature-icon'/>
          <h4>Transparent Pricing</h4>
          <p>Get fair and clear pricing without hidden charges or disputes.</p>
        </div>

        <div className='feature-card'>
          <FaUserShield className='feature-icon'/>
          <h4>Role-Based Access</h4>
          <p>Secure access control for manufacturers, transporters, and retailers.</p>
        </div>

      </div>
    </div>
  )
}

export default Feature
