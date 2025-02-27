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
  poids: { type: Number }
}, { timestamps: true });

// Vérifie si le modèle existe déjà avant de le définir
const Produit = mongoose.models.Produit || mongoose.model('Produit', produitSchema);

module.exports = Produit;

