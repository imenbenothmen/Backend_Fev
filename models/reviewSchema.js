const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  //  Un utilisateur peut laisser plusieurs avis, mais chaque avis est associé à un seul utilisateur
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },  //Un produit peut avoir plusieurs avis, et chaque avis est associé à un seul produit.
  rating: { type: Number, required: true },  
  comment: { type: String, required: true },  
}, { timestamps: true });

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);

module.exports = Review;
