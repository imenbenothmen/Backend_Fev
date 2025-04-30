const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  image: { type: String },
  
  // A product belongs to one category, a category can have many products
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },

  material: { type: String },
  type: { type: String },

  // A product can have multiple reviews, and each review belongs to one product
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],

  // A product can be favored by multiple users (many-to-many)
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

module.exports = Product;


