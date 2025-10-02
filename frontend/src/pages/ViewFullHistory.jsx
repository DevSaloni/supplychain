import React, { useState } from "react";
import "./ViewFullHistory.css";
import getContract from "../utils/getContract";
import { ethers } from "ethers";
import { toast } from "react-toastify";

const ViewFullHistory = () => {
  const [product, setProduct] = useState(null);

  // Load first product (for demo). Can be replaced with search.
  const loadProduct = async () => {
    try {
      const contract = await getContract();
      if (!contract) return;

      const count = await contract.getProductCount();
      if (Number(count) === 0) {
        alert("No products found");
        return;
      }

      let found = null;

      for (let i = 0; i < Number(count); i++) {
        const id = await contract.productIDs(i);
        const prod = await contract.products(id);
        const history = await contract.getProductHistory(id);

        found = {
          // product overview
          name: prod.name,
          productID: prod.productID,
          batchNumber: prod.batchNumber,
          status: prod.isVerified ? "Verified ✅" : "Not Verified ❌",
          basePrice: ethers.formatUnits(prod.basePrice, 0),
          transportFee: ethers.formatUnits(prod.transportFee, 0),
          retailerFee: ethers.formatUnits(prod.retailerFee, 0),
          origin: prod.origin,
          destination: prod.destination,

          // pricing breakdown
          totalPrice:
            Number(ethers.formatUnits(prod.basePrice, 0)) +
            Number(ethers.formatUnits(prod.transportFee, 0)) +
            Number(ethers.formatUnits(prod.retailerFee, 0)),
            
            // timeline
          timeline: history.map((h) => ({
            stage: h.stage,
            role: h.role,
            location: h.location,
            date: new Date(Number(h.timestamp) * 1000).toLocaleDateString(),
            price: ethers.formatUnits(h.priceAtStage, 0),
          })),
        };
      }

      if (!found) {
        setProduct(null);
        toast.error("Product not found");
      } else {
        setProduct(found);
      }
    } catch (err) {
      console.error("Error loading product", err);
      toast.error("Error loading product");
    }
  };

  return (
    <>
      <div className="product-detail-container">
        
      <button onClick={loadProduct} className="history-btn">
          Load Product History
        </button>

        {/* === Product Overview === */}
        {product && (
          <div className="product-overview">
  <h2 className="section-title">Product Overview</h2>
  <div className="product-card">
    <div className="product-row">
      <strong>Name:</strong>
      <p>{product.name}</p>
    </div>
    <div className="product-row">
      <strong>ID:</strong>
      <p>{product.productID}</p>
    </div>
    <div className="product-row">
      <strong>Batch:</strong>
      <p>{product.batchNumber}</p>
    </div>
    <div className="product-row">
      <strong>Status:</strong>
      <p>{product.status}</p>
    </div>
    <div className="product-row">
      <strong>Origin:</strong>
      <p>{product.origin}</p>
    </div>
    <div className="product-row">
      <strong>Destination:</strong>
      <p>{product.destination}</p>
    </div>
  </div>
</div>

        )}

        {/* === Pricing Breakdown === */}
        {product && (
          <div className="price-overview">
  <h2 className="section-title">Pricing Breakdown</h2>
  <div className="product-card">
    <div className="product-row">
      <strong>Base Price:</strong>
      <p>{product.basePrice}</p>
    </div>
    <div className="product-row">
      <strong>Transport Fee:</strong>
      <p>{product.transportFee}</p>
    </div>
    <div className="product-row">
      <strong>Retailer Fee:</strong>
      <p>{product.retailerFee}</p>
    </div>
    <div className="product-row total-price">
      <strong>Total:</strong>
      <p>{product.totalPrice}</p>
    </div>
  </div>
</div>

        )}

        {/* === Timeline === */}
        {product && (
          <div className="timeline-overview">
            <h2>| Supply Chain Timeline |</h2>
            <div className="timeline">
              {product.timeline.map((step, idx) => (
                <div key={idx} className="timeline-step">
                  {/* Dot color comes from role-based CSS (manufacturer, transporter, retailer) */}
                  <span className={`dot ${step.role.toLowerCase()}`}></span>
                  <div className="timeline-content">
                    <h4>{step.role}</h4>
                    <p>{step.stage} at {step.location}</p>
                    <p><strong>Date:</strong> {step.date}</p>
                    <p><strong>Price:</strong> {step.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ViewFullHistory;
