const produitModel = require('../models/ProduitSchema');  

// Ajouter un produit
exports.ajouterProduit = async (req, res) => {
    try {
        const { nom, description, prix, stock, image, categorie, materiau, type, poids } = req.body;
        const produit = new produitModel({ nom, description, prix, stock, image, categorie, materiau, type, poids });
        await produit.save();
        res.status(201).json({ message: "Produit ajouté avec succès", produit });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'ajout du produit", error });
    }
};

// Supprimer un produit
exports.supprimerProduit = async (req, res) => {
    try {
        const produit = await produitModel.findByIdAndDelete(req.params.id);
        if (!produit) {
            return res.status(404).json({ message: "Produit non trouvé" });
        }
        res.status(200).json({ message: "Produit supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression du produit", error });
    }
};

// Afficher tous les produits
exports.afficherProduits = async (req, res) => {
    try {
        const produits = await produitModel.find().populate('categorie');
        res.status(200).json(produits);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des produits", error });
    }
};

// Afficher les détails d'un produit
exports.afficherDetailsProduit = async (req, res) => {
    try {
        const produit = await produitModel.findById(req.params.id).populate('categorie');
        if (!produit) {
            return res.status(404).json({ message: "Produit non trouvé" });
        }
        res.status(200).json(produit);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des détails", error });
    }
};

// Obtenir le nombre de produits d'une catégorie
exports.getNombreProduits = async (req, res) => {
    try {
        const nombreProduits = await produitModel.countDocuments({ categorie: req.params.categorieId });
        res.status(200).json({ nombreProduits });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors du comptage des produits", error });
    }
};

// Obtenir le nom d'un produit
exports.getNomProduit = async (req, res) => {
    try {
        const produit = await produitModel.findById(req.params.id);
        if (!produit) {
            return res.status(404).json({ message: "Produit non trouvé" });
        }
        res.status(200).json({ nom: produit.nom });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération du nom", error });
    }
};

// Mettre à jour un produit (ex. renommer, ajuster prix, etc.)
exports.mettreAJourProduit = async (req, res) => {
    try {
        const { nom, description, prix, stock, image, categorie, materiau, type, poids } = req.body;
        const produit = await produitModel.findByIdAndUpdate(req.params.id, {
            nom, description, prix, stock, image, categorie, materiau, type, poids
        }, { new: true });
        if (!produit) {
            return res.status(404).json({ message: "Produit non trouvé" });
        }
        res.status(200).json({ message: "Produit mis à jour avec succès", produit });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour du produit", error });
    }
};
