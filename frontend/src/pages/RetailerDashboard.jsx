import React, { useState, useEffect } from "react";
import getContract from "../utils/getContract";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const RetailerDashboard = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);

  const [formData, setFormData] = useState({
    productID: "",
    location: "",
    retailerFee: "",
  });

  const stageNames = ["None", "Manufactured", "InTransit", "ReceivedForSale"];

  // Handle form change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const contract = await getContract();
      if (!contract) return;

      const tx = await contract.markReceived(
        formData.productID,
        formData.location,
        ethers.toBigInt(formData.retailerFee || 0)
      );

      await tx.wait();
      toast.success("Product status updated successfully");

      // Reset form
      setFormData({
        productID: "",
        location: "",
        retailerFee: "",
      });

      // Reload products after update
      loadProduct();
    } catch (err) {
      console.error("Error updating:", err);
      toast.error("Failed to update product status");
    }
  };

  // Load products
const loadProducts = async () => {
  try {
    const contract = await getContract();
    if (!contract) return;

    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    const currentAccount = accounts[0]?.toLowerCase();
    if (!currentAccount) return toast.error("No wallet connected");

    const count = Number(await contract.getProductCount());

    const ids = await Promise.all(
      Array.from({ length: count }, (_, i) => contract.productIDs(i))
    );

    const productsRaw = await Promise.all(ids.map(id => contract.products(id)));

    const list = ids.map((id, index) => {
      const product = productsRaw[index];
      if (product.roles.transporter.toLowerCase() === currentAccount) {
        return {
          id: id.toString(),
          name: product.name,
          stage: Number(product.currentStage?.toString() || 0),
          isVerified: product.isVerified,
        };
      }
      return null;
    }).filter(Boolean);

    setProducts(list);
  } catch (err) {
    console.log(err);
    toast.error("Failed to load products");
  }
};


  // Auto-load products on page load
  useEffect(() => {
    loadProducts();
  }, []);

  // Summary card values
  const totalAssigned = products.length;
  const received = products.filter((p) => p.stage === 3).length;
  const inTransit = products.filter((p) => p.stage === 3).length;

  return (
    <div className="manufacture-container">

      {/* Title */}
      <h2>| Retailer Dashboard |</h2>

      {/* Summary Cards */}
      <div className="summary-card-container">
        <div className="summary-card">
          <h3>{totalAssigned}</h3>
          <p>Total Assigned Products</p>
        </div>
        <div className="summary-card">
          <h3>{received}</h3>
          <p>Received & For Sale</p>
        </div>
        <div className="summary-card">
          <h3>{inTransit}</h3>
          <p>In Transit</p>
        </div>
      </div>

      {/* Add Product Form */}
      <div className="product-container">
        <div className="product-form">
          <h3>Received Form</h3>
          <form onSubmit={handleSubmit}>
            <label>Product ID:</label>
            <input
              type="text"
              value={formData.productID}
              name="productID"
              onChange={handleChange}
              placeholder="Enter Product ID"
            />

            <label>Retailer Price:</label>
            <input
              type="number"
              value={formData.retailerFee}
              name="retailerFee"
              onChange={handleChange}
              placeholder="Enter Retailer Price"
            />

            <label>Current Location:</label>
            <input
              type="text"
              value={formData.location}
              name="location"
              onChange={handleChange}
              placeholder="Enter The Current Location"
            />

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
              <th>Verified</th>
              <th>View History / Verify</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="5">No product assigned</td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>{stageNames[p.stage] || "Unknown"}</td>
                  <td>{p.isVerified ? "Yes" : "No"}</td>
                  <td>
                    <button onClick={() => navigate("/product-detail")}>
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RetailerDashboard;
