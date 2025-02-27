const mongoose = require('mongoose');

const panierSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  produits: [{
    produit: { type: mongoose.Schema.Types.ObjectId, ref: 'Produit', required: true },
    quantite: { type: Number, required: true }
  }]
}, { timestamps: true });

const Panier = mongoose.model('Panier', panierSchema);
module.exports = Panier;
