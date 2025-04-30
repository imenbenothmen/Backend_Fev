const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  nom: { type: String, required: true, unique: true },
  description: { type: String },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null }, // Sous-catégories

  // Un produit appartient à une seule catégorie, mais une catégorie peut contenir plusieurs produits.
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'product' }] // Relation un-à-plusieurs

}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
