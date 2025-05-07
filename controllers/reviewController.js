const Review = require('../models/reviewSchema');
const Product = require('../models/productSchema');

// Ajouter un avis pour un produit
exports.addReview = async (req, res) => {
  try {
    //const { userId, productId, rating, comment } = req.body;
    const { productId, rating, comment } = req.body;
    const userId = req.user.id;  // L'ID de l'utilisateur qui a fait l'avis (assurez-vous d'être authentifié)

    // Créer un nouveau avis
    const newReview = new Review({
      user: userId,
      product: productId,
      rating,
      comment
    });

    await newReview.save();

    // Ajouter cet avis au produit
    const product = await Product.findById(productId);
    product.reviews.push(newReview._id);
    await product.save();

    res.status(201).json({ message: "Review added successfully", review: newReview });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// Récupérer les avis d'un produit
exports.getReviewsByProduct = async (req, res) => {
  try {
    const productId = req.params.productId;

    // Trouver le produit et peupler ses avis
    const product = await Product.findById(productId).populate('reviews');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product.reviews);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
