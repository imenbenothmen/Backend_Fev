const mongoose = require('mongoose');

const favorisSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  produits: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Produit' }],
 
  //Un utilisateur peut avoir plusieurs produits favoris, et chaque produit peut être favori de plusieurs utilisateurs.
  user: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Relation plusieurs-à-plusieurs
}, { timestamps: true });

const Favoris = mongoose.model('Favoris', favorisSchema);
module.exports = Favoris;
