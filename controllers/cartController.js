const cartModel = require('../models/cartSchema');
const Product = require('../models/productSchema'); 
const userModel = require('../models/userSchema');

// Créer un nouveau panier
exports.createCart = async (req, res) => {
  try {
    const { client, products } = req.body;

    // Vérifier l'existence des produits dans la base de données
    const existingProducts = await Product.find({ '_id': { $in: products.map(p => p.product) } });
    if (existingProducts.length !== products.length) {
      return res.status(400).json({ message: 'Certains produits n\'existent pas.' });
    }

    const cart = new cartModel({
      client,
      products
    });

    await cart.save();
    res.status(201).json({ message: 'Panier créé avec succès', cart });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création du panier', error });
  }
};

// Récupérer le panier d'un utilisateur par ID
exports.getCartByClient = async (req, res) => {
  try {
    const cart = await cartModel.findOne({ client: req.params.clientId }).populate('products.product');

    if (!cart) {
      return res.status(404).json({ message: 'Panier non trouvé pour ce client' });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du panier', error });
  }
};

// Ajouter un produit au panier
exports.addProductToCart = async (req, res) => {
  try {
    const { clientId, productId, quantity } = req.body;

    const cart = await cartModel.findOne({ client: clientId });

    if (!cart) {
      return res.status(404).json({ message: 'Panier non trouvé' });
    }

    const productExist = await Product.findById(productId);  // Vérifier si le produit existe dans la base
    if (!productExist) {
      return res.status(400).json({ message: 'Produit non valide' });
    }

    const productIndex = cart.products.findIndex(p => p.product.toString() === productId);

    if (productIndex === -1) {
      cart.products.push({ product: productId, quantity });
    } else {
      cart.products[productIndex].quantity += quantity;
    }

    await cart.save();
    res.status(200).json({ message: 'Produit ajouté au panier', cart });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'ajout du produit', error });
  }
};

// Supprimer un produit du panier
exports.removeProductFromCart = async (req, res) => {
  try {
    const { clientId, productId } = req.params;

    const cart = await cartModel.findOne({ client: clientId });

    if (!cart) {
      return res.status(404).json({ message: 'Panier non trouvé' });
    }

    cart.products = cart.products.filter(p => p.product.toString() !== productId);

    await cart.save();
    res.status(200).json({ message: 'Produit supprimé du panier', cart });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression du produit', error });
  }
};

// Mettre à jour la quantité d'un produit dans le panier
exports.updateQuantityProduct = async (req, res) => {
  try {
    const { clientId, productId, quantity } = req.body;

    if (quantity <= 0) {
      return res.status(400).json({ message: 'La quantité doit être supérieure à zéro' });
    }

    const cart = await cartModel.findOne({ client: clientId });

    if (!cart) {
      return res.status(404).json({ message: 'Panier non trouvé' });
    }

    const productIndex = cart.products.findIndex(p => p.product.toString() === productId);

    if (productIndex === -1) {
      return res.status(404).json({ message: 'Produit non trouvé dans le panier' });
    }

    cart.products[productIndex].quantity = quantity;

    await cart.save();
    res.status(200).json({ message: 'Quantité du produit mise à jour', cart });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la quantité', error });
  }
};

// Supprimer le panier
exports.deleteCart = async (req, res) => {
  try {
    const cart = await cartModel.findOneAndDelete({ client: req.params.clientId });

    if (!cart) {
      return res.status(404).json({ message: 'Panier non trouvé pour ce client' });
    }

    res.status(200).json({ message: 'Panier supprimé', cart });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression du panier', error });
  }
};

// Valider la commande et vider le panier
exports.validateOrder = async (req, res) => {
  try {
    const { clientId } = req.body;

    const cart = await cartModel.findOne({ client: clientId });

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: 'Panier vide ou non trouvé' });
    }

    // Traitement de la commande (ex: enregistrer la commande dans une base de données de commandes)

    // Supprimer les produits du panier après validation
    cart.products = [];
    await cart.save();

    res.status(200).json({ message: 'Commande validée et panier vidé', cart });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la validation de la commande', error });
  }
};

// Afficher le panier d'un client
exports.showCart = async (req, res) => {
  try {
    const cart = await cartModel.findOne({ client: req.params.clientId }).populate('products.product');

    if (!cart) {
      return res.status(404).json({ message: 'Panier non trouvé' });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'affichage du panier', error });
  }
};

// Créer ou mettre à jour le panier à la connexion
exports.createOrUpdateCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const cartData = req.body.cart; // Contient les produits à ajouter ou mettre à jour

    // Vérifier si l'utilisateur a un panier existant
    let cart = await cartModel.findOne({ userId });

    if (cart) {
      // Mettre à jour le panier existant avec les nouveaux produits
      cart.products = cartData.products;
    } else {
      // Créer un nouveau panier
      cart = new cartModel({ userId, products: cartData.products });
    }

    await cart.save();
    res.status(200).json({ message: 'Panier mis à jour avec succès', cart });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du panier', error });
  }
};

// Récupérer le panier d'un utilisateur
exports.getCartByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const cart = await cartModel.findOne({ userId }).populate('products.productId'); // Populate pour obtenir les détails des produits
    if (!cart) {
      return res.status(404).json({ message: 'Aucun panier trouvé pour cet utilisateur' });
    }
    
    res.status(200).json({ cart });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du panier', error });
  }
};

// Vérifier la disponibilité du stock avant d'ajouter un produit au panier
exports.addProductToCartWithStockCheck = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    // Vérifier si le produit existe dans la base de données
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    // Vérifier si la quantité demandée est disponible en stock
    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Stock insuffisant pour ce produit' });
    }

    // Récupérer le panier de l'utilisateur
    let cart = await cartModel.findOne({ userId });

    if (!cart) {
      // Créer un nouveau panier si l'utilisateur n'en a pas
      cart = new cartModel({ userId, products: [] });
    }

    // Vérifier si le produit est déjà dans le panier
    const existingProduct = cart.products.find(item => item.productId.toString() === productId);

    if (existingProduct) {
      // Si le produit est déjà dans le panier, mettre à jour la quantité
      existingProduct.quantity += quantity;
    } else {
      // Ajouter un nouveau produit au panier
      cart.products.push({ productId, quantity });
    }

    await cart.save();
    res.status(200).json({ message: 'Produit ajouté au panier avec succès', cart });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'ajout du produit au panier', error });
  }
};

// Vérifier la disponibilité du stock en temps réel pour plusieurs produits
exports.checkStockForCartProducts = async (req, res) => {
  try {
    const { cartProducts } = req.body; // Un tableau avec { productId, quantity }

    // Vérifier la disponibilité du stock pour chaque produit
    for (let item of cartProducts) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Produit ${item.productId} non trouvé` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Stock insuffisant pour le produit ${product.name}` });
      }
    }

    res.status(200).json({ message: 'Tous les produits sont disponibles en stock' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la vérification du stock', error });
  }
};

// Mettre à jour le panier si le stock d'un produit change
exports.updateCartWithStockChanges = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await cartModel.findOne({ userId }).populate('products.productId');

    if (!cart) {
      return res.status(404).json({ message: 'Aucun panier trouvé' });
    }

    // Vérifier les stocks des produits dans le panier
    for (let item of cart.products) {
      const product = await Product.findById(item.productId);
      if (product.stock < item.quantity) {
        item.quantity = product.stock; // Réduire la quantité au stock disponible
      }
    }

    await cart.save();
    res.status(200).json({ message: 'Panier mis à jour avec les nouveaux stocks', cart });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du panier', error });
  }
};
