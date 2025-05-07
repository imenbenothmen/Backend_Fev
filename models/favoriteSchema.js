const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  
  // Produit ajouté en favori par l'utilisateur (un seul produit par document)
product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product'
  // Si tu veux tester sans contrainte pour le moment 
//Tu peux temporairement supprimer required: true juste pour debug, mais :
//, required: true
} ,

 
  //// L'utilisateur qui a ajouté le produit aux favoris (un seul utilisateur par document)
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' 
    //, required: true
   }
}, { timestamps: true });

const favorite = mongoose.model('favorites', favoriteSchema);
module.exports = favorite;
