const mongoose = require('mongoose');

const commandeSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
  produits: [{
    produit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Produit',
      required: true,
    },
    quantite: {
      type: Number,
      required: true,
    },
    prix: {
      type: Number,
      required: true,
    },
  }],
  total: {
    type: Number,
    required: true,
  },
  statut: {
    type: String,
    enum: ['en attente', 'validée', 'expédiée', 'livrée', 'annulée'],
    default: 'en attente',
  },
  dateCreation: {
    type: Date,
    default: Date.now,
  },
  dateModification: {
    type: Date,
  },
    // Un utilisateur peut passer plusieurs commandes, mais chaque commande appartient à un seul utilisateur.
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Relation plusieurs-à-un
    //Une commande peut avoir une ou plusieurs livraisons, et chaque livraison est associée à une commande.
    livraisons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Livraison' }] // Relation un-à-plusieurs
},

{ timestamps: true }
);

const Commande = mongoose.model('Commande', commandeSchema);
module.exports = Commande;
