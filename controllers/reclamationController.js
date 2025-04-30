const reclamationModel = require('../models/reclamationSchema');
const commandeModel = require('../models/commandeSchema');
const produitModel = require('../models/productSchema');
const userModel = require('../models/userSchema');

// Soumettre une réclamation
exports.soumettreReclamation = async (req, res) => {
  try {
    const { description, produit, commande } = req.body;

    const reclamation = new reclamationModel();
    reclamation.soumettreReclamation(description, produit, commande);

    await reclamation.save();
    res.status(201).json({ message: 'Réclamation soumise avec succès', reclamation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la soumission de la réclamation', error });
  }
};

// Obtenir le statut d'une réclamation
exports.getStatutReclamation = async (req, res) => {
  try {
    const reclamation = await reclamationModel.findById(req.params.reclamationId);
    if (!reclamation) {
      return res.status(404).json({ message: 'Réclamation non trouvée.' });
    }
    res.status(200).json({ statut: reclamation.getStatutReclamation() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération du statut de la réclamation', error });
  }
};

// Mettre à jour le statut d'une réclamation
exports.mettreAJourStatut = async (req, res) => {
  try {
    const { statut } = req.body;

    const reclamation = await reclamationModel.findById(req.params.reclamationId);
    if (!reclamation) {
      return res.status(404).json({ message: 'Réclamation non trouvée.' });
    }

    reclamation.mettreAJourStatut(statut);
    await reclamation.save();
    res.status(200).json({ message: 'Statut de la réclamation mis à jour avec succès', reclamation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du statut de la réclamation', error });
  }
};

// Obtenir les détails d'une réclamation
exports.getDetailsReclamation = async (req, res) => {
  try {
    const reclamation = await reclamationModel.findById(req.params.reclamationId);
    if (!reclamation) {
      return res.status(404).json({ message: 'Réclamation non trouvée.' });
    }
    res.status(200).json({ details: reclamation.getDetailsReclamation() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des détails de la réclamation', error });
  }
};

// Résoudre une réclamation
exports.resoudreReclamation = async (req, res) => {
  try {
    const reclamation = await reclamationModel.findById(req.params.reclamationId);
    if (!reclamation) {
      return res.status(404).json({ message: 'Réclamation non trouvée.' });
    }

    reclamation.resoudreReclamation();
    await reclamation.save();
    res.status(200).json({ message: 'Réclamation résolue avec succès', reclamation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la résolution de la réclamation', error });
  }
};

// Archiver une réclamation
exports.archiverReclamation = async (req, res) => {
  try {
    const reclamation = await reclamationModel.findById(req.params.reclamationId);
    if (!reclamation) {
      return res.status(404).json({ message: 'Réclamation non trouvée.' });
    }

    reclamation.archiverReclamation();
    await reclamation.save();
    res.status(200).json({ message: 'Réclamation archivée avec succès', reclamation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de l\'archivage de la réclamation', error });
  }
};

// Supprimer une réclamation
exports.supprimerReclamation = async (req, res) => {
  try {
    const reclamation = await reclamationModel.findById(req.params.reclamationId);
    if (!reclamation) {
      return res.status(404).json({ message: 'Réclamation non trouvée.' });
    }

    await reclamation.supprimerReclamation();
    res.status(200).json({ message: 'Réclamation supprimée avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la suppression de la réclamation', error });
  }
};
