import React, { useState } from "react";
import "./ProductSearch.css";
import { useNavigate } from "react-router-dom";
import { ethers, toBigInt } from "ethers";
import getContract from "../utils/getContract";
import { toast } from "react-toastify";

const ProductSearch = () => {
  const navigate = useNavigate();

  const [searchInput, setSearchInput] = useState("");
  const [product, setProduct] = useState(null);

  // handle input change
  const handleChange = (e) => {
    setSearchInput(e.target.value);
  };

  // handle search
  const handleSearch = async () => {
    try {
      const contract = await getContract();
      if (!contract) return;

      const count = await contract.getProductCount();
      let found = null;

      for (let i = 0; i < count; i++) {
        // ✅ Get product ID from array
        const productId = await contract.productIDs(i);

        // ✅ Get product struct using mapping
        const prod = await contract.products(productId);

        //total price 
        const totalPrice = toBigInt(prod.basePrice)+toBigInt(prod.transportFee)+toBigInt(prod.retailerFee);

        // compare user input with productID or batchNumber
        if (
          productId.toLowerCase() === searchInput.toLowerCase() ||
          prod.batchNumber.toLowerCase() === searchInput.toLowerCase()
        ) {
          // ✅ Collect product details
          found = {
            productID: prod.productID,
            batchNumber: prod.batchNumber,
            name: prod.name,
            status: prod.isVerified ? "✅ Verified" : "❌ Not Verified",
            price: ethers.formatUnits(totalPrice, 0), // assuming price is stored as uint (no decimals)
            origin: prod.origin,
            destination: prod.destination,
          };
          break; // stop loop once found
        }
      }

      if (!found) {
        setProduct(null);
        toast.error("Product not found");
      } else {
        setProduct(found);
      }
    } catch (err) {
      console.error("Error fetching product", err);
      toast.error("Error Fetching Product");
    }
  };

  return (
    <div className="product-search">

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          value={searchInput}
          onChange={handleChange}
          placeholder="Product ID OR Batch Number"
        />
        <button type="button" onClick={handleSearch}>
          Search
        </button>
      </div>

      {/* Search Result */}
      {product && (
        <div className="search-result">
          <div className="result-card">
            <div className="result-row">
              <p>Product Name:</p>
              <strong>{product.name}</strong>
            </div>
            <div className="result-row">
              <p>Product ID:</p>
              <strong>{product.productID}</strong>
            </div>
            <div className="result-row">
              <p>Batch No:</p>
              <strong>{product.batchNumber}</strong>
            </div>
            <div className="result-row">
              <p>Verified Status:</p>
              <strong>{product.status}</strong>
            </div>
            <div className="result-row">
              <p>total Price:</p>
              <strong>{product.price}</strong>
            </div>
            <div className="result-row">
              <p>Origin:</p>
              <strong>{product.origin}</strong>
            </div>
            <div className="result-row">
              <p>Destination:</p>
              <strong>{product.destination}</strong>
            </div>

            <button
              className="history-btns"
              onClick={() => navigate("/product-detail")}
            >
              View Full History
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductSearch;
