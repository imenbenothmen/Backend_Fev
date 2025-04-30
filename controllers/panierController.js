const panierModel = require('../models/panierSchema');
const Produit = require('../models/productSchema'); 
const userModel = require('../models/userSchema');
// Créer un nouveau panier
exports.createPanier = async (req, res) => {
  try {
    const { client, produits } = req.body;

    // Vérifier l'existence des produits dans la base de données
    const produitsExistants = await Produit.find({ '_id': { $in: produits.map(p => p.produit) } });
    if (produitsExistants.length !== produits.length) {
      return res.status(400).json({ message: 'Certains produits n\'existent pas.' });
    }

    const panier = new panierModel({
      client,
      produits
    });

    await panier.save();
    res.status(201).json({ message: 'Panier créé avec succès', panier });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création du panier', error });
  }
};

// Récupérer le panier d'un utilisateur par ID
exports.getPanierByClient = async (req, res) => {
  try {
    const panier = await panierModel.findOne({ client: req.params.clientId }).populate('produits.produit');

    if (!panier) {
      return res.status(404).json({ message: 'Panier non trouvé pour ce client' });
    }

    res.status(200).json(panier);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du panier', error });
  }
};

// Ajouter un produit au panier
exports.addProduitToPanier = async (req, res) => {
  try {
    const { clientId, produitId, quantite } = req.body;

    const panier = await panierModel.findOne({ client: clientId });

    if (!panier) {
      return res.status(404).json({ message: 'Panier non trouvé' });
    }

    const produitExist = await Produit.findById(produitId);  // Vérifier si le produit existe dans la base
    if (!produitExist) {
      return res.status(400).json({ message: 'Produit non valide' });
    }

    const produitIndex = panier.produits.findIndex(p => p.produit.toString() === produitId);

    if (produitIndex === -1) {
      panier.produits.push({ produit: produitId, quantite });
    } else {
      panier.produits[produitIndex].quantite += quantite;
    }

    await panier.save();
    res.status(200).json({ message: 'Produit ajouté au panier', panier });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'ajout du produit', error });
  }
};

// Supprimer un produit du panier
exports.removeProduitFromPanier = async (req, res) => {
  try {
    const { clientId, produitId } = req.params;

    const panier = await panierModel.findOne({ client: clientId });

    if (!panier) {
      return res.status(404).json({ message: 'Panier non trouvé' });
    }

    panier.produits = panier.produits.filter(p => p.produit.toString() !== produitId);

    await panier.save();
    res.status(200).json({ message: 'Produit supprimé du panier', panier });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression du produit', error });
  }
};

// Mettre à jour la quantité d'un produit dans le panier
exports.updateQuantiteProduit = async (req, res) => {
  try {
    const { clientId, produitId, quantite } = req.body;

    if (quantite <= 0) {
      return res.status(400).json({ message: 'La quantité doit être supérieure à zéro' });
    }

    const panier = await panierModel.findOne({ client: clientId });

    if (!panier) {
      return res.status(404).json({ message: 'Panier non trouvé' });
    }

    const produitIndex = panier.produits.findIndex(p => p.produit.toString() === produitId);

    if (produitIndex === -1) {
      return res.status(404).json({ message: 'Produit non trouvé dans le panier' });
    }

    panier.produits[produitIndex].quantite = quantite;

    await panier.save();
    res.status(200).json({ message: 'Quantité du produit mise à jour', panier });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la quantité', error });
  }
};

//c
exports.deletePanier = async (req, res) => {
  try {
    const panier = await panierModel.findOneAndDelete({ client: req.params.clientId });

    if (!panier) {
      return res.status(404).json({ message: 'Panier non trouvé pour ce client' });
    }

    res.status(200).json({ message: 'Panier supprimé', panier });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression du panier', error });
  }
};

// Valider la commande et vider le panier
exports.validerCommande = async (req, res) => {
  try {
    const { clientId } = req.body;

    const panier = await panierModel.findOne({ client: clientId });

    if (!panier || panier.produits.length === 0) {
      return res.status(400).json({ message: 'Panier vide ou non trouvé' });
    }

    // Traitement de la commande (ex: enregistrer la commande dans une base de données de commandes)

    // Supprimer les produits du panier après validation
    panier.produits = [];
    await panier.save();

    res.status(200).json({ message: 'Commande validée et panier vidé', panier });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la validation de la commande', error });
  }
};

// Afficher le panier d'un client
exports.afficherPanier = async (req, res) => {
  try {
    const panier = await panierModel.findOne({ client: req.params.clientId }).populate('produits.produit');

    if (!panier) {
      return res.status(404).json({ message: 'Panier non trouvé' });
    }

    res.status(200).json(panier);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'affichage du panier', error });
  }
};

//Cela implique de stocker les informations du panier dans la base de données
// , et d'afficher ce panier chaque fois qu'un utilisateur se connecte.
// Créer ou mettre à jour le panier à la connexion
exports.creerOuMettreAJourPanier = async (req, res) => {
  try {
    const { userId } = req.params;
    const panierData = req.body.panier; // Contient les produits à ajouter ou mettre à jour

    // Vérifier si l'utilisateur a un panier existant
    let panier = await Panier.findOne({ userId });

    if (panier) {
      // Mettre à jour le panier existant avec les nouveaux produits
      panier.produits = panierData.produits;
    } else {
      // Créer un nouveau panier
      panier = new Panier({ userId, produits: panierData.produits });
    }

    await panier.save();
    res.status(200).json({ message: 'Panier mis à jour avec succès', panier });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du panier', error });
  }
};
//Récupérer le panier de l'utilisateur à chaque connexion :
//  Cette opération permet de charger le panier de l'utilisateur depuis la base de données lors de la connexion.
// Récupérer le panier d'un utilisateur
exports.getPanierUtilisateur = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const panier = await Panier.findOne({ userId }).populate('produits.produitId'); // Populate pour obtenir les détails des produits
    if (!panier) {
      return res.status(404).json({ message: 'Aucun panier trouvé pour cet utilisateur' });
    }
    
    res.status(200).json({ panier });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du panier', error });
  }
};


//Vérifier la disponibilité du stock avant d'ajouter un produit au panier :
// Ajouter un produit au panier en vérifiant la disponibilité du stock
exports.ajouterProduitAuPanier = async (req, res) => {
  try {
    const { userId, produitId, quantite } = req.body;

    // Vérifier si le produit existe dans la base de données
    const produit = await Produit.findById(produitId);
    if (!produit) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    // Vérifier si la quantité demandée est disponible en stock
    if (produit.stock < quantite) {
      return res.status(400).json({ message: 'Stock insuffisant pour ce produit' });
    }

    // Récupérer le panier de l'utilisateur
    let panier = await Panier.findOne({ userId });

    if (!panier) {
      // Créer un nouveau panier si l'utilisateur n'en a pas
      panier = new Panier({ userId, produits: [] });
    }

    // Vérifier si le produit est déjà dans le panier
    const produitExistant = panier.produits.find(item => item.produitId.toString() === produitId);

    if (produitExistant) {
      // Si le produit est déjà dans le panier, mettre à jour la quantité
      produitExistant.quantite += quantite;
    } else {
      // Ajouter un nouveau produit au panier
      panier.produits.push({ produitId, quantite });
    }

    await panier.save();
    res.status(200).json({ message: 'Produit ajouté au panier avec succès', panier });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'ajout du produit au panier', error });
  }
};
//Vérifier la disponibilité du stock en temps réel pendant l'ajout au panier
// Vérifier la disponibilité du stock en temps réel pour plusieurs produits
exports.verifierStockPanier = async (req, res) => {
  try {
    const { produitsPanier } = req.body; // Un tableau avec { produitId, quantite }

    // Vérifier la disponibilité du stock pour chaque produit
    for (let item of produitsPanier) {
      const produit = await Produit.findById(item.produitId);
      if (!produit) {
        return res.status(404).json({ message: `Produit ${item.produitId} non trouvé` });
      }

      if (produit.stock < item.quantite) {
        return res.status(400).json({ message: `Stock insuffisant pour le produit ${produit.nom}` });
      }
    }

    res.status(200).json({ message: 'Tous les produits sont disponibles en stock' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la vérification du stock', error });
  }
};

// Mettre à jour le panier si le stock d'un produit change
exports.mettreAJourStockPanier = async (req, res) => {
  try {
    const { userId } = req.params;
    const panier = await Panier.findOne({ userId }).populate('produits.produitId');

    if (!panier) {
      return res.status(404).json({ message: 'Aucun panier trouvé' });
    }

    // Vérifier les stocks des produits dans le panier
    for (let item of panier.produits) {
      const produit = await Produit.findById(item.produitId);
      if (produit.stock < item.quantite) {
        item.quantite = produit.stock; // Réduire la quantité au stock disponible
      }
    }

    await panier.save();
    res.status(200).json({ message: 'Panier mis à jour avec les nouveaux stocks', panier });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du panier', error });
  }
};
