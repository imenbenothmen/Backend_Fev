const mongoose = require('mongoose');

const panierSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  produits: [{
    produit: { type: mongoose.Schema.Types.ObjectId, ref: 'Produit', required: true },
    quantite: { type: Number, required: true },
    
  }],

  //Un utilisateur a un seul panier, et chaque panier appartient à un seul utilisateur.
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Relation un-à-un
}, { timestamps: true });

const Panier = mongoose.model('Panier', panierSchema);
module.exports = Panier;
