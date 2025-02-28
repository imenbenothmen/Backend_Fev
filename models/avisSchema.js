const mongoose = require('mongoose');

const avisSchema = new mongoose.Schema({
  produit: { type: mongoose.Schema.Types.ObjectId, ref: 'Produit', required: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  note: { type: Number, required: true, min: 1, max: 5 },
  commentaire: { type: String, required: true },
  //Un produit peut avoir plusieurs avis, et chaque avis est associé à un seul produit.
  produit: { type: mongoose.Schema.Types.ObjectId, ref: 'Produit' }, // Relation plusieurs-à-un

  //// Un utilisateur peut laisser plusieurs avis, mais chaque avis est associé à un seul utilisateur (??????????????????????)
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Référence à l'utilisateur




}, { timestamps: true });

const Avis = mongoose.model('Avis', avisSchema);
module.exports = Avis;
