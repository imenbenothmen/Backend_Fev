const mongoose = require('mongoose');


const categorieSchema = new mongoose.Schema({
  nom: { type: String, required: true, unique: true },
  description: { type: String },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Categorie', default: null },// Sous-catégories


//Un produit appartient à une seule catégorie, mais une catégorie peut contenir plusieurs produits.
produits: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Produit' }] // Relation un-à-plusieurs


},
{ timestamps: true });

const Categorie = mongoose.model('Categorie', categorieSchema);
module.exports = Categorie;
