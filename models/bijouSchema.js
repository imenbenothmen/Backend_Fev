const mongoose = require('mongoose');
const bijouSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true },
    description: { type: String, required: true },
    prix: { type: Number, required: true },
    stock: { type: Number, required: true },
    images: [{ type: String }], // Tableau d'URLs des images du bijou
    categorie: { type: mongoose.Schema.Types.ObjectId, ref: 'Categorie', required: true },
    materiau: {
      type: String,
      required: true,
      enum: ['Acier inoxydable', 'Titane', 'Or', 'Argent', 'Autre'] // Matériau du bijou (or, argent, etc.) 
    },
    type: { type: String, required: true }, // Type de bijou (bague, collier, etc.)
    poids: { type: Number, required: true }, // Poids du bijou en grammes
    dimensions: {
      longueur: { type: Number }, // en millimètres
      largeur: { type: Number },  // en millimètres
      hauteur: { type: Number }   // en millimètres
    },
    pierres: [{ // Informations sur les pierres précieuses ou semi-précieuses
      nom: { type: String },
      couleur: { type: String },
      carat: { type: Number }
    }],
    dateAjout: { type: Date, default: Date.now }, // Date d'ajout du bijou au catalogue
    enVedette: { type: Boolean, default: false }, // Indique si le bijou est en vedette
    userbijou : {type : mongoose.Schema.Types.ObjectId,ref: 'User'}, // many to one
    //userbijoux : {type : mongoose.Schema.Types.ObjectId,ref: 'User'} // many to many
  },
  { timestamps: true }
);

const bijou = mongoose.model('bijou', bijouSchema);
module.exports = bijou;
