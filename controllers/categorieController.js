const categorieModel = require('../models/categorieSchema');  
const produitModel = require('../models/produitSchema');  
// Ajouter une nouvelle catégorie
exports.ajouterCategorie = async (req, res) => {
  try {
      const { nom, parent } = req.body;
      const categorie = new categorieModel({ nom, parent });
      await categorie.save();
      res.status(201).json({ message: "Catégorie ajoutée avec succès", categorie });
  } catch (error) {
      res.status(500).json({ message: "Erreur lors de l'ajout", error });
  }
};

// Supprimer une catégorie
exports.supprimerCategorie = async (req, res) => {
  try {
      await categorieModel.findByIdAndDelete(req.params.id);  
      res.status(200).json({ message: "Catégorie supprimée avec succès" });
  } catch (error) {
      res.status(500).json({ message: "Erreur lors de la suppression", error });
  }
};

// Afficher toutes les catégories
exports.getCategories = async (req, res) => {
  try {
      const categories = await categorieModel.find().populate('parent');  
      res.status(200).json(categories);
  } catch (error) {
      res.status(500).json({ message: "Erreur lors de la récupération", error });
  }
};

// Afficher les détails d'une catégorie
exports.getCategorieDetails = async (req, res) => {
  try {
      const categorie = await categorieModel.findById(req.params.id).populate('parent');  
      if (!categorie) {
          return res.status(404).json({ message: "Catégorie non trouvée" });
      }
      res.status(200).json(categorie);
  } catch (error) {
      res.status(500).json({ message: "Erreur lors de la récupération des détails", error });
  }
};

// Renommer une catégorie
exports.renommerCategorie = async (req, res) => {
  try {
      const { nom } = req.body;
      const categorie = await categorieModel.findByIdAndUpdate(req.params.id, { nom }, { new: true });  
      if (!categorie) {
          return res.status(404).json({ message: "Catégorie non trouvée" });
      }
      res.status(200).json({ message: "Catégorie renommée", categorie });
  } catch (error) {
      res.status(500).json({ message: "Erreur lors du renommage", error });
  }
};









