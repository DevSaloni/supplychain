import React, { useState, useEffect } from "react";
import getContract from "../utils/getContract";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const TransporterDashboard = () => {
  const navigate = useNavigate();
  
  const [products, setProducts] = useState([]);

  const [formData, setFormData] = useState({
    productID: "",
    status: "",
    location: "",
    transportFee: "",
  });

  const stageNames = ["None", "Manufactured", "InTransit", "ReceivedForSale"];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // handle submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const contract = await getContract();
    if (!contract) return;

    try {
      const tx = await contract.updateStatus(
        formData.productID,
        formData.status,
        formData.location,
        ethers.toBigInt(formData.transportFee || 0)
      );

      await tx.wait();
      toast.success("Product updated successfully");

      // reset form
      setFormData({
        productID: "",
        status: "",
        location: "",
        transportFee: "",
      });

      loadProducts();
    } catch (err) {
      console.log("Error to Update the product status", err);
      toast.error("Error to Update the Status");
    }
  };

  //load product
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


  useEffect(() => {
    loadProducts();
  }, []);

  // summary card
  const totalAssigned = products.length;
  const inTransit = products.filter((p) => p.stage === 2).length;
  const delivered = products.filter((p) => p.stage === 3).length;

  return (
    <div className="manufacture-container">

      {/* Title */}
      <h2>| Transporter Dashboard |</h2>

      {/* Summary Cards */}
      <div className="summary-card-container">
        <div className="summary-card">
          <h3>{totalAssigned}</h3>
          <p>Total Assigned Products</p>
        </div>
        <div className="summary-card">
          <h3>{inTransit}</h3>
          <p>In Transit</p>
        </div>
        <div className="summary-card">
          <h3>{delivered}</h3>
          <p>Delivered to Retailer</p>
        </div>
      </div>

      {/* Update Status Form */}
      <div className="product-container">
        <div className="product-form">
          <h3>Update Status Form</h3>
          <form onSubmit={handleSubmit}>
            <label>Product ID:</label>
            <input
              type="text"
              name="productID"
              value={formData.productID}
              onChange={handleChange}
              placeholder="Enter Product ID"
              required
            />

            <label>Transport Price:</label>
            <input
              type="number"
              name="transportFee"
              value={formData.transportFee}
              onChange={handleChange}
              placeholder="Enter Transport Price"
              required
            />

            <label>Status:</label>
            <input
              type="text"
              name="status"
              value={formData.status}
              onChange={handleChange}
              placeholder="ex: InTransit / Delivered"
              required
            />

            <label>Current Location:</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter The Current Location"
              required
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
              <th>View History</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="5">No product Assigned</td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>{stageNames[p.stage] || "Unknown"}</td>
                  <td>{p.isVerified ? "Yes" : "No"}</td>
                  <td>
                    <button onClick={() => navigate("/product-detail")}>View</button>
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

export default TransporterDashboard;
