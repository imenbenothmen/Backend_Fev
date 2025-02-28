const mongoose = require('mongoose');

const produitSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  description: { type: String, required: true },
  prix: { type: Number, required: true },
  stock: { type: Number, required: true },
  image: { type: String },
  categorie: { type: mongoose.Schema.Types.ObjectId, ref: 'Categorie' },  // Référence à la catégorie
  materiau: { type: String },
  type: { type: String },
  poids: { type: Number },
  //Un produit appartient à une seule catégorie, mais une catégorie peut contenir plusieurs produits.
  categorie: { type: mongoose.Schema.Types.ObjectId, ref: 'Categorie' } ,// Relation plusieurs-à-un


  //Un produit peut avoir plusieurs avis, et chaque avis est associé à un seul produit.
  Avis: [{ type: mongoose.Schema.Types.ObjectId, ref: 'avis' }] ,// Relation un-à-plusieurs

  //Un utilisateur peut avoir plusieurs produits favoris, et chaque produit peut être favori de plusieurs utilisateurs.
  favoris: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Produit' }] // Relation plusieurs-à-plusieurs


}, { timestamps: true });


const Produit = mongoose.models.Produit || mongoose.model('Produit', produitSchema);

module.exports = Produit;

