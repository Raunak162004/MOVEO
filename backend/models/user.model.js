const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: {
    firstName: {
      type: String,
      minLength: [3, "First name must be at least 3 characters long"],
      required: true,
    },
    lastName: {
      type: String,
      minLength: [3, "Last name must be at least 3 characters long"],
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minLength: [5, "Email must be at least 5 characters long"],
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  socketId: {
    type: String,
  },
});


const User = mongoose.model("User", userSchema);

module.exports = User;
