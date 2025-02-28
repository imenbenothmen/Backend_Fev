const mongoose = require('mongoose');

const livraisonSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  adresse: { type: String, required: true },
  dateLivraison: { type: Date, required: true },
  statut: { type: String, enum: ['En préparation', 'Expédiée', 'Livrée'], required: true },

  //Une commande peut avoir une ou plusieurs livraisons, et chaque livraison est associée à une commande.
  commande: { type: mongoose.Schema.Types.ObjectId, ref: 'Commande' } // Relation plusieurs-à-un
  
}, { timestamps: true });

const Livraison = mongoose.model('Livraison', livraisonSchema);
module.exports = Livraison;
