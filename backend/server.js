require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectdb = require("./config/dbConnection");
const errorHandler = require("./middleWare/errorHandler");

connectdb();
const app = express();
const PORT = process.env.PORT || 5000;

// --- START ROBUST CORS FIX ---
// The CLIENT_URL environment variable will hold the Vercel domain.
const CLIENT_URL = process.env.CLIENT_URL;

const corsOptions = {
    origin: CLIENT_URL,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Crucial for sending cookies/headers/tokens
};

// Replace the simple app.use(cors()); with the secure, explicit options
app.use(cors(corsOptions)); 
// --- END ROBUST CORS FIX ---

// Middleware
app.use(express.json());

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
