const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "please enter username"],
    },
    email: {
      type: String,
      required: [true, "please enter your email address"],
      unique: [true, "email must be unique"],
    },
    password: {
      type: String,
      required: [true, "please enter your password"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
