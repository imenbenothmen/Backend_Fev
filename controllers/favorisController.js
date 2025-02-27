const favorisModel = require('../models/favorisSchema');
const ProduitModel = require('../models/ProduitSchema');  

// Ajouter un produit aux favoris
exports.ajouter_au_favoris = async (req, res) => {
  try {
    const { clientId, produitId } = req.body;

    // Trouver ou créer les favoris de l'utilisateur
    const favoris = await favorisModel.findOne({ client: clientId });

    if (favoris) {
      if (favoris.produits.includes(produitId)) {
        return res.status(400).json({ message: 'Ce produit est déjà dans vos favoris.' });
      }

      favoris.produits.push(produitId);
      await favoris.save();
      return res.status(200).json({ message: 'Produit ajouté aux favoris.', favoris });
    } else {
      const newFavoris = new favorisModel({
        client: clientId,
        produits: [produitId],
      });

      await newFavoris.save();
      return res.status(201).json({ message: 'Favoris créés et produit ajouté.', favoris: newFavoris });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Retirer un produit des favoris
exports.retirer_du_favoris = async (req, res) => {
  try {
    const { clientId, produitId } = req.body;

    const favoris = await favorisModel.findOne({ client: clientId });
    if (!favoris) {
      return res.status(404).json({ message: 'Aucun favoris trouvé pour cet utilisateur.' });
    }

    favoris.produits = favoris.produits.filter(produit => !produit.equals(produitId));
    await favoris.save();
    return res.status(200).json({ message: 'Produit supprimé des favoris.', favoris });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Afficher tous les produits favoris
exports.afficher_favoris = async (req, res) => {
  try {
    const { clientId } = req.params;

    const favoris = await favorisModel.findOne({ client: clientId }).populate('produits');
    if (!favoris) {
      return res.status(404).json({ message: 'Aucun favoris trouvé pour cet utilisateur.' });
    }

    return res.status(200).json({ favoris });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Vérifier si un produit est déjà dans les favoris
exports.verifier_si_favori = async (req, res) => {
  try {
    const { clientId, produitId } = req.body;

    const favoris = await favorisModel.findOne({ client: clientId });
    if (!favoris) {
      return res.status(404).json({ message: 'Aucun favoris trouvé pour cet utilisateur.' });
    }

    const estFavori = favoris.produits.includes(produitId);
    return res.status(200).json({ estFavori });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Vider les favoris d'un utilisateur
exports.vider_favoris = async (req, res) => {
  try {
    const { clientId } = req.body;

    const favoris = await favorisModel.findOne({ client: clientId });
    if (!favoris) {
      return res.status(404).json({ message: 'Aucun favoris trouvé pour cet utilisateur.' });
    }

    favoris.produits = [];
    await favoris.save();
    return res.status(200).json({ message: 'Tous les produits ont été supprimés des favoris.', favoris });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Nombre de produits dans les favoris
exports.nombre_favoris = async (req, res) => {
  try {
    const { clientId } = req.params;

    const favoris = await favorisModel.findOne({ client: clientId });
    if (!favoris) {
      return res.status(404).json({ message: 'Aucun favoris trouvé pour cet utilisateur.' });
    }

    const nombre = favoris.produits.length;
    return res.status(200).json({ nombre });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};
