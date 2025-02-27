const mongoose = require('mongoose');

const livraisonSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  adresse: { type: String, required: true },
  dateLivraison: { type: Date, required: true },
  statut: { type: String, enum: ['En préparation', 'Expédiée', 'Livrée'], required: true },
}, { timestamps: true });

const Livraison = mongoose.model('Livraison', livraisonSchema);
module.exports = Livraison;
