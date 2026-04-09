const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  fullname: {
    firstname: {
      type: String,
      minLength: [3, "First name must be at least 3 characters long"],
      required: true,
    },
    lastname: {
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


userSchema.pre('save', async function(){
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});  

const User = mongoose.model("User", userSchema);

module.exports = User;
