const mongoose = require('mongoose');

const favorisSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  produits: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Produit' }],
}, { timestamps: true });

const Favoris = mongoose.model('Favoris', favorisSchema);
module.exports = Favoris;
