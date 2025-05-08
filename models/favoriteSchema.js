const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  // L'utilisateur qui a ajouté des produits aux favoris (un seul utilisateur par document)
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // Tableau des produits favoris (un tableau d'ObjectIds de produits)
  products: [
    { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Product', 
      required: true 
    }
  ]
}, { timestamps: true });

const favorite = mongoose.model('favorites', favoriteSchema);
module.exports = favorite;
