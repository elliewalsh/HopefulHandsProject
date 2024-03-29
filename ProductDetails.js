const mongoose = require('mongoose');

const ProductDetailsSchema = new mongoose.Schema({
  product: String,
  description: String,
  category: String,
  imageUrls: [String], // Array to store multiple image URLs
  donatedBy: String, // Add the 'donatedBy' field to store the user's email
}, {
  collection: 'ProductInfo',
});

mongoose.model('ProductInfo', ProductDetailsSchema);