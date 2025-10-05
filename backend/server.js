require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectdb = require("./config/dbConnection");
const errorHandler = require("./middleWare/errorHandler");

connectdb();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// --- START CORS FIX ---
const allowedOrigins = [
    // 1. **REQUIRED:** Add your Vercel Frontend URL here (MUST BE HTTPS)
    "https://e-commercefrontend-kappa.vercel.app/", 
    // 2. Keep localhost for local development testing
    "http://localhost:5173"
];

// Routes
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/order", require("./routes/orderRoutes"));

// --- ADD THIS TEMPORARY HEALTH CHECK ---
app.get("/", (req, res) => {
  res.status(200).json({ message: "API is running successfully!" });
});
// ----------------------------------------

// Error handler middleware (must be after all routes)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
