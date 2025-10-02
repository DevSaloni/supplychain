import React from 'react';
import "./HeroSection.css";
import getContract from "../utils/getContract";
import { toast } from 'react-toastify';


const HeroSection = () => {
  const registerRole = async (role) => {
    // Create instance of contract
    const contract = await getContract();

    if (!contract) return; // Exit if contract not connected

    try {
      let tx;
      if (role === "manufacturer") {
        tx = await contract.registerAsManufacturer();
      } else if (role === "transporter") {
        tx = await contract.registerAsTransporter();
      } else if (role === "retailer") {
        tx = await contract.registerAsRetailer();
      }

      await tx.wait(); // Wait for transaction confirmation
      toast.success(`${role} registered successfully`);
    } catch (error) {
      console.error("Error registering role:", error);
      toast.error("Transaction failed. Check console for details.");
    }
  };

  return (
    <div className='hero-container'>
      <div className='hero-head'>
        <img src="/supplyChain1.jpeg" alt="Supply Chain"/>
        <h2>Supply Chain, Simplified & Secured</h2>
        <p>
          From manufacturing to retail, monitor product journeys, resolve disputes, 
          and build trust with transparent supply chain tracking
        </p>
      </div>
      <div className="register-btn">
        <button onClick={() => registerRole("manufacturer")}>Register Manufacturer</button>
        <button onClick={() => registerRole("transporter")}>Register Transporter</button>
        <button onClick={() => registerRole("retailer")}>Register Retailer</button>
      </div>
    </div>
  );
};

export default HeroSection;
