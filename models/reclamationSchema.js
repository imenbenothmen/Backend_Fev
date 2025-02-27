const mongoose = require('mongoose');

const reclamationSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  produit: { type: mongoose.Schema.Types.ObjectId, ref: 'Produit', required: true },
  commande: { type: mongoose.Schema.Types.ObjectId, ref: 'Commande', required: true },
  description: { type: String, required: true },
  statut: { type: String, enum: ['En cours', 'Résolue', 'Archivée'], default: 'En cours' },
}, { timestamps: true });

// Méthodes de gestion des réclamations
reclamationSchema.methods.soumettreReclamation = function(description, produit, commande) {
  this.description = description;
  this.produit = produit;
  this.commande = commande;
  this.statut = 'En cours';
};

reclamationSchema.methods.getStatutReclamation = function() {
  return this.statut;
};

reclamationSchema.methods.mettreAJourStatut = function(statut) {
  if (['En cours', 'Résolue', 'Archivée'].includes(statut)) {
    this.statut = statut;
  }
};

reclamationSchema.methods.getDetailsReclamation = function() {
  return this.description;
};

reclamationSchema.methods.resoudreReclamation = function() {
  this.statut = 'Résolue';
};

reclamationSchema.methods.archiverReclamation = function() {
  this.statut = 'Archivée';
};

reclamationSchema.methods.supprimerReclamation = async function() {
  await this.remove();
};

const Reclamation = mongoose.model('Reclamation', reclamationSchema);
module.exports = Reclamation;
