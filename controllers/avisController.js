const avisModel = require('../models/avisSchema');

// Laisser un avis pour un produit
exports.laisserAvis = async (req, res) => {
  try {
    const { produit, note, commentaire, utilisateur } = req.body;

    // Vérifier si l'utilisateur a déjà laissé un avis pour ce produit
    const existingAvis = await avisModel.findOne({ produit, client: utilisateur });
    if (existingAvis) {
      return res.status(400).json({ message: 'Vous avez déjà laissé un avis pour ce produit.' });
    }

    const avis = new avisModel({
      produit,
      client: utilisateur,
      note,
      commentaire
    });

    await avis.save();
    res.status(201).json({ message: 'Avis ajouté avec succès', avis });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'ajout de l\'avis', error });
  }
};

// Modifier un avis pour un produit
exports.modifierAvis = async (req, res) => {
  try {
    const { produit, note, commentaire, utilisateur } = req.body;

    // Trouver l'avis de l'utilisateur pour ce produit
    const avis = await avisModel.findOne({ produit, client: utilisateur });
    if (!avis) {
      return res.status(404).json({ message: 'Avis non trouvé pour ce produit.' });
    }

    // Mettre à jour l'avis
    avis.note = note;
    avis.commentaire = commentaire;
    await avis.save();

    res.status(200).json({ message: 'Avis modifié avec succès', avis });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la modification de l\'avis', error });
  }
};

// Supprimer un avis pour un produit
exports.supprimerAvis = async (req, res) => {
  try {
    const { produit, utilisateur } = req.body;

    // Trouver et supprimer l'avis
    const avis = await avisModel.findOneAndDelete({ produit, client: utilisateur });
    if (!avis) {
      return res.status(404).json({ message: 'Avis non trouvé pour ce produit.' });
    }

    res.status(200).json({ message: 'Avis supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'avis', error });
  }
};

// Récupérer l'avis d'un utilisateur pour un produit
exports.getAvisUtilisateur = async (req, res) => {
  try {
    const { produit, utilisateur } = req.body;

    const avis = await avisModel.findOne({ produit, client: utilisateur });
    if (!avis) {
      return res.status(404).json({ message: 'Avis non trouvé pour cet utilisateur.' });
    }

    res.status(200).json(avis);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'avis', error });
  }
};

// Afficher tous les avis d'un produit
exports.afficherAvis = async (req, res) => {
  try {
    const avis = await avisModel.find({ produit: req.params.produitId }).populate('client', 'nom email');
    if (!avis || avis.length === 0) {
      return res.status(404).json({ message: 'Aucun avis trouvé pour ce produit.' });
    }

    res.status(200).json(avis);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des avis', error });
  }
};

exports.calculerNoteMoyenne = async (req, res) => {
  try {
    const avis = await avisModel.find({ produit: req.params.produitId });
    if (!avis || avis.length === 0) {
      return res.status(404).json({ message: 'Aucun avis trouvé pour ce produit.' });
    }

    const totalNote = avis.reduce((sum, avis) => sum + avis.note, 0);
    const moyenne = totalNote / avis.length;

    res.status(200).json({ moyenne });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors du calcul de la note moyenne', error });
  }
};
