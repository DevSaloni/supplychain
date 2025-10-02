import React, { useState, useEffect } from "react";
import "./ManufactureDashboard.css";
import getContract from "../utils/getContract";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import {toast} from "react-toastify";

const ManufactureDashboard = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    productID: "",
    batchNumber: "",
    name: "",
    origin: "",
    destination: "",
    basePrice: "",
    transporter: "",
    retailer: "",
  });

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Add product
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const contract = await getContract();
      if (!contract) return toast.error("Contract not found");

      const tx = await contract.addProduct(
        formData.productID,
        formData.batchNumber,
        formData.name,
        formData.origin,
        formData.destination,
        ethers.toBigInt(formData.basePrice || 0),
        formData.transporter,
        formData.retailer
      );

      await tx.wait();
      toast.success("Product added successfully");

      // Reset form
      setFormData({
        productID: "",
        batchNumber: "",
        name: "",
        origin: "",
        destination: "",
        basePrice: "",
        transporter: "",
        retailer: "",
      });

      loadProducts(); // reload products
    } catch (err) {
      console.error(err);
      toast.error("Failed to add product",err);
    }
  };

  // Load products from contract
  const loadProducts = async () => {
    try {
      const contract = await getContract();
      if (!contract) return;

      const count = await contract.getProductCount();
      const list = [];

      for (let i = 0; i < count; i++) {
        const id = await contract.productIDs(i);
        const product = await contract.products(id);
        const verifiedRoles = await contract.getVerifiedRoles(id);

        list.push({
          id: id.toString(),
          name: product.name,
          stage: Number(product.currentStage?.toString() || 0),
          isVerified: product.isVerified,
          manufacturer: product.roles.manufacturer,
          transporter: product.roles.transporter,
          retailer: product.roles.retailer,
          verifiedRoles: verifiedRoles.map((v) => v.toLowerCase()), // normalize
        });
      }

      setProducts(list);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load products");
    }
  };

  // Verify product
  const handleVerify = async (productID) => {
    try {
      const contract = await getContract();
      if (!contract) return;

      const tx = await contract.verifyProduct(productID);
      await tx.wait();

      toast.success("Product verified successfully");
      loadProducts(); // reload products
    } catch (err) {
      console.error(err);
      toast.error("Failed to verify product");
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // --- Summary Logic ---
  const added = products.length;
  const fullyVerified = products.filter((p) => p.isVerified).length;
  const partiallyVerified = products.filter(
    (p) => !p.isVerified && p.verifiedRoles.length > 0
  ).length;
  const inTransit = products.filter((p) => p.stage === 1).length;

  const stageNames = ["None", "Manufactured", "InTransit", "ReceivedForSale"];

  return (
    <div className="manufacture-container">
      <h2>| Manufacturer Dashboard |</h2>

      {/* Summary Cards */}
      <div className="summary-card-container">
        <div className="summary-card">
          <h3>{added}</h3>
          <p>Products Added</p>
        </div>
        <div className="summary-card">
          <h3>{fullyVerified}</h3>
          <p>Fully Verified</p>
        </div>
        <div className="summary-card">
          <h3>{partiallyVerified}</h3>
          <p>Partially Verified</p>
        </div>
       
        <div className="summary-card">
          <h3>{inTransit}</h3>
          <p>In Transit</p>
        </div>
      </div>

      {/* Add Product Form */}
      <div className="product-container">
        <div className="product-form">
          <h3>Add Product</h3>
          <form onSubmit={handleSubmit}>
            {[
              "productID",
              "batchNumber",
              "name",
              "origin",
              "destination",
              "basePrice",
              "transporter",
              "retailer",
            ].map((field) => (
              <div key={field}>
                <label>{field.replace(/([A-Z])/g, " $1")}</label>
                <input
                  type={field === "basePrice" ? "number" : "text"}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  placeholder={`Enter ${field.replace(/([A-Z])/g, " $1")}`}
                  required
                />
              </div>
            ))}
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>

      {/* Product Table */}
      <div className="product-lists">
        <h3>Product Records</h3>
        <table>
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Product Name</th>
              <th>Current Stage</th>
              <th>Manufacturer</th>
              <th>Transporter</th>
              <th>Retailer</th>
              <th>Fully Verified?</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>{stageNames[p.stage] || "Unknown"}</td>
                <td>
                  {p.verifiedRoles.includes(p.manufacturer.toLowerCase())
                    ? "✅"
                    : "❌"}
                </td>
                <td>
                  {p.verifiedRoles.includes(p.transporter.toLowerCase())
                    ? "✅"
                    : "❌"}
                </td>
                <td>
                  {p.verifiedRoles.includes(p.retailer.toLowerCase())
                    ? "✅"
                    : "❌"}
                </td>
                <td>{p.isVerified ? "Yes" : "No"}</td>
                <td>
                  {p.isVerified ? (
                    <button onClick={() => navigate("/product-detail")}>
                      View
                    </button>
                  ) : (
                    <button onClick={() => handleVerify(p.id)}>Verify</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManufactureDashboard;
