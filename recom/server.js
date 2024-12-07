const express = require("express");
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs } = require("firebase/firestore");

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyC1mU4cGi0kxGmAjzvA-zrkGVbXqfMQBtQ",
  authDomain: "krashak-setu-testing.firebaseapp.com",
  projectId: "krashak-setu-testing",
  storageBucket: "krashak-setu-testing.appspot.com",
  messagingSenderId: "730432132265",
  appId: "1:730432132265:web:5e54bcd42e570cd71705b8",
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);
const db = getFirestore(appFirebase);

const app = express();
app.use(express.json());

// Custom CORS Middleware
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow all origins
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  ); // Allowed methods
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  ); // Allowed headers
  next();
});

// API Endpoint: Get Top-Selling Products
app.get("/top-products", async (req, res) => {
  try {
    const ordersCollection = collection(db, "orders");
    const ordersSnapshot = await getDocs(ordersCollection);

    if (ordersSnapshot.empty) {
      return res.status(404).json({ error: "No orders found." });
    }

    const salesCount = {};

    ordersSnapshot.forEach((doc) => {
      const userOrders = doc.data().orders;
      if (Array.isArray(userOrders)) {
        userOrders.forEach(({ cropName, quantity }) => {
          if (cropName && quantity && !isNaN(quantity)) {
            salesCount[cropName] = (salesCount[cropName] || 0) + quantity;
          }
        });
      }
    });

    const sortedProducts = Object.entries(salesCount)
      .sort(([, qtyA], [, qtyB]) => qtyB - qtyA)
      .map(([cropName, quantity]) => ({ cropName, quantity }));

    res.status(200).json(sortedProducts);
  } catch (error) {
    console.error("Error fetching top products:", error);
    res.status(500).json({ error: "Failed to fetch top-selling products." });
  }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
