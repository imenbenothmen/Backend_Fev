const categoryModel = require('../models/categorySchema');
const productModel = require('../models/productSchema');

// ✅ Ajouter une catégorie ou sous-catégorie
exports.addCategory = async (req, res) => {
  try {
    const { nom, description, parent } = req.body;
    const category = new categoryModel({ nom, description, parent: parent || null });
    await category.save();
    res.status(201).json({ message: "Catégorie ajoutée avec succès", category });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'ajout", error });
  }
};

// ✅ Supprimer une catégorie
exports.deleteCategory = async (req, res) => {
  try {
    await categoryModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Catégorie supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression", error });
  }
};

// ✅ Obtenir toutes les catégories
exports.getCategories = async (req, res) => {
  try {
    const categories = await categoryModel.find().populate('parent');
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération", error });
  }
};

// ✅ Obtenir les détails d'une catégorie
exports.getCategoryDetails = async (req, res) => {
  try {
    const category = await categoryModel.findById(req.params.id).populate('parent');
    if (!category) {
      return res.status(404).json({ message: "Catégorie non trouvée" });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des détails", error });
  }
};

// ✅ Renommer une catégorie
exports.renameCategory = async (req, res) => {
  try {
    const { nom } = req.body;
    const category = await categoryModel.findByIdAndUpdate(
      req.params.id,
      { nom },
      { new: true }
    );
    if (!category) {
      return res.status(404).json({ message: "Catégorie non trouvée" });
    }
    res.status(200).json({ message: "Catégorie renommée", category });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors du renommage", error });
  }
};

// ✅ Modifier complètement une catégorie
exports.updateCategory = async (req, res) => {
  try {
    const { nom, description, parent } = req.body;
    const category = await categoryModel.findByIdAndUpdate(
      req.params.id,
      { nom, description, parent: parent || null },
      { new: true }
    );
    if (!category) {
      return res.status(404).json({ message: "Catégorie non trouvée" });
    }
    res.status(200).json({ message: "Catégorie mise à jour", category });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour", error });
  }
};

// ✅ Obtenir les sous-catégories d’une catégorie
exports.getSubCategoriesByParent = async (req, res) => {
  try {
    const subCategories = await categoryModel.find({ parent: req.params.parentId });
    res.status(200).json(subCategories);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des sous-catégories", error });
  }
};

// ✅ Obtenir uniquement les catégories principales (sans parent)
exports.getMainCategories = async (req, res) => {
  try {
    const mainCategories = await categoryModel.find({ parent: null });
    res.status(200).json(mainCategories);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des catégories principales", error });
  }
};

