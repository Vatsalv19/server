// src/TopProducts.js
import React, { useEffect, useState } from 'react';

const TopProducts = () => {
  const [products, setProducts] = useState([]); // To store products
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3000/top-products");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data.slice(0, 2)); // Get only the top 3 products
      } catch (err) {
        console.error("Fetch error:", err.message);
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchProducts();
  }, []);
  

  if (loading) {
    return <p>Loading recommended products...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Recommended Products</h2>

      {/* Product List */}
      {products.length > 0 ? (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {products.map((product, index) => (
            <li
              key={index}
              style={{
                padding: "10px",
                marginBottom: "10px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
              }}
            >
              <strong>#{index + 1}</strong> - Product: <strong>{product.cropName}</strong>, Sales:{" "}
              <strong>{product.quantity}</strong>
            </li>
          ))}
        </ul>
      ) : (
        <p>No recommended products found.</p>
      )}
    </div>
  );
};

export default TopProducts;
