const favoriteModel = require('../models/favoriteSchema');
const ProductModel = require('../models/productSchema');

// Add a product to favorites
exports.add_to_favorites = async (req, res) => {
  try {
    const { clientId, productId } = req.body;

    // Find or create the user's favorites
    const favorites = await favoriteModel.findOne({ client: clientId });

    if (favorites) {
      if (favorites.products.includes(productId)) {
        return res.status(400).json({ message: 'This product is already in your favorites.' });
      }

      favorites.products.push(productId);
      await favorites.save();
      return res.status(200).json({ message: 'Product added to favorites.', favorites });
    } else {
      const newFavorites = new favoriteModel({
        client: clientId,
        products: [productId],
      });

      await newFavorites.save();
      return res.status(201).json({ message: 'Favorites created and product added.', favorites: newFavorites });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Remove a product from favorites
exports.remove_from_favorites = async (req, res) => {
  try {
    const { clientId, productId } = req.body;

    const favorites = await favoriteModel.findOne({ client: clientId });
    if (!favorites) {
      return res.status(404).json({ message: 'No favorites found for this user.' });
    }

    favorites.products = favorites.products.filter(product => !product.equals(productId));
    await favorites.save();
    return res.status(200).json({ message: 'Product removed from favorites.', favorites });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Show all favorite products
exports.show_favorites = async (req, res) => {
  try {
    const { clientId } = req.params;

    const favorites = await favoriteModel.findOne({ client: clientId }).populate('products');
    if (!favorites) {
      return res.status(404).json({ message: 'No favorites found for this user.' });
    }

    return res.status(200).json({ favorites });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Check if a product is already in favorites
exports.check_if_favorite = async (req, res) => {
  try {
    const { clientId, productId } = req.body;

    const favorites = await favoriteModel.findOne({ client: clientId });
    if (!favorites) {
      return res.status(404).json({ message: 'No favorites found for this user.' });
    }

    const isFavorite = favorites.products.includes(productId);
    return res.status(200).json({ isFavorite });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Clear all favorites for a user
exports.clear_favorites = async (req, res) => {
  try {
    const { clientId } = req.body;

    const favorites = await favoriteModel.findOne({ client: clientId });
    if (!favorites) {
      return res.status(404).json({ message: 'No favorites found for this user.' });
    }

    favorites.products = [];
    await favorites.save();
    return res.status(200).json({ message: 'All products have been removed from favorites.', favorites });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Count the number of products in favorites
exports.count_favorites = async (req, res) => {
  try {
    const { clientId } = req.params;

    const favorites = await favoriteModel.findOne({ client: clientId });
    if (!favorites) {
      return res.status(404).json({ message: 'No favorites found for this user.' });
    }

    const count = favorites.products.length;
    return res.status(200).json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};
