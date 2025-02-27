const mongoose = require('mongoose');

const avisSchema = new mongoose.Schema({
  produit: { type: mongoose.Schema.Types.ObjectId, ref: 'Produit', required: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  note: { type: Number, required: true, min: 1, max: 5 },
  commentaire: { type: String, required: true },
}, { timestamps: true });

const Avis = mongoose.model('Avis', avisSchema);
module.exports = Avis;
