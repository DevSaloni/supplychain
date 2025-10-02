import React from 'react'
import { FaIndustry, FaTruck, FaStore } from "react-icons/fa";
import "./HowItWorkSection.css";

const HowItWorkSection = () => {
  return (
    <div className='process-container'>
      <h2>How It Works</h2>
      <div className='role-container'>
        
        <div className='role-card'>
          <FaIndustry className="role-icon"/>
          <h4>Manufacture</h4>
          <p>Manufacturer adds the product</p>
        </div>

        <div className='arrow'>➝</div>

        <div className='role-card'>
          <FaTruck className="role-icon"/>
            <h4>Transporter</h4>
          <p>Transporter moves the product</p>
        </div>
        
         <div className='arrow'>➝</div>
         
        <div className='role-card'>
          <FaStore className="role-icon"/>
            <h4>retailer</h4>
          <p>Retailer sells the product</p>
        </div>

      </div>
    </div>
  )
}

export default HowItWorkSection
