const mongoose = require('mongoose');

// Define a user profile schema
const userProfileSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  phone: {
    type: Number, // You can use String to store phone numbers
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  // Add more fields as needed
});

// Create a model for the user profile
const UserProfile = mongoose.model('UserProfile', userProfileSchema);

module.exports = UserProfile;
