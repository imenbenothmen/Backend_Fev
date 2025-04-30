const categoryModel = require('../models/categorySchema');  
const productModel = require('../models/productSchema');  

// Add a new category
exports.addCategory = async (req, res) => {
  try {
    const { nom, parent } = req.body;
    const category = new categoryModel({ nom, parent });
    await category.save();
    res.status(201).json({ message: "Catégorie ajoutée avec succès", category });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'ajout", error });
  }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
  try {
    await categoryModel.findByIdAndDelete(req.params.id);  
    res.status(200).json({ message: "Catégorie supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression", error });
  }
};

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await categoryModel.find().populate('parent');  
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération", error });
  }
};

// Get category details
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

// Rename a category
exports.renameCategory = async (req, res) => {
  try {
    const { nom } = req.body;
    const category = await categoryModel.findByIdAndUpdate(req.params.id, { nom }, { new: true });  
    if (!category) {
      return res.status(404).json({ message: "Catégorie non trouvée" });
    }
    res.status(200).json({ message: "Catégorie renommée", category });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors du renommage", error });
  }
};
