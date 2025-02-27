const mongoose = require('mongoose');


const categorieSchema = new mongoose.Schema({
  nom: { type: String, required: true, unique: true },
  description: { type: String },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Categorie', default: null },// Sous-catégories



// Categorie → Bijou : One-to-Many (une catégorie peut avoir plusieurs bijoux).
bijoux: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bijou' }] //one to many
},
{ timestamps: true });

const Categorie = mongoose.model('Categorie', categorieSchema);
module.exports = Categorie;
