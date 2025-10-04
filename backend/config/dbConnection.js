const mongoose = require("mongoose");

const connectdb = async () => {
  try {
    const connect = await mongoose.connect(process.env.CONNECTION_STRING);
    console.log(
      `Database connected successfully to ${connect.connection.host}/${connect.connection.name}`
    );
  } catch (err) {
    console.error("Database connection error:", err);
    throw new Error("Database connection failed");
  }
};

module.exports = connectdb;
