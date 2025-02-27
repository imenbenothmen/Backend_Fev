const livraisonModel = require('../models/livraisonSchema');

// Créer une livraison
exports.createLivraison = async (req, res) => {
  try {
    const { client, adresse, dateLivraison, statut } = req.body;

    const livraison = new livraisonModel({
      client,
      adresse,
      dateLivraison,
      statut
    });

    await livraison.save();
    res.status(201).json({ message: 'Livraison créée avec succès', livraison });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la création de la livraison', error });
  }
};

// Obtenir toutes les livraisons d'un client spécifique
exports.getLivraisonsByClient = async (req, res) => {
  try {
    const livraisons = await livraisonModel.find({ client: req.params.clientId });
    if (!livraisons || livraisons.length === 0) {
      return res.status(404).json({ message: 'Aucune livraison trouvée pour ce client.' });
    }
    res.status(200).json(livraisons);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des livraisons du client', error });
  }
};

// Obtenir une livraison spécifique par son ID
exports.getLivraisonById = async (req, res) => {
  try {
    const livraison = await livraisonModel.findById(req.params.livraisonId);
    if (!livraison) {
      return res.status(404).json({ message: 'Livraison non trouvée.' });
    }
    res.status(200).json(livraison);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération de la livraison', error });
  }
};

// Mettre à jour le statut d'une livraison
exports.updateLivraisonStatut = async (req, res) => {
  try {
    const { statut } = req.body;

    if (!['En préparation', 'Expédiée', 'Livrée'].includes(statut)) {
      return res.status(400).json({ message: 'Statut invalide.' });
    }

    const livraison = await livraisonModel.findByIdAndUpdate(req.params.livraisonId, { statut }, { new: true });
    if (!livraison) {
      return res.status(404).json({ message: 'Livraison non trouvée.' });
    }

    res.status(200).json({ message: 'Statut de la livraison mis à jour avec succès', livraison });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du statut de la livraison', error });
  }
};

// Supprimer une livraison
exports.deleteLivraison = async (req, res) => {
  try {
    const livraison = await livraisonModel.findByIdAndDelete(req.params.livraisonId);
    if (!livraison) {
      return res.status(404).json({ message: 'Livraison non trouvée.' });
    }
    res.status(200).json({ message: 'Livraison supprimée avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la suppression de la livraison', error });
  }
};

// Calculer les frais de livraison
exports.calculerFraisLivraison = (destination, poids) => {
  let frais = 0;
  if (destination === 'international') {
    frais = 20; // Exemple : frais pour une livraison internationale
  } else {
    frais = 10; // Exemple : frais pour une livraison nationale
  }

  frais += poids * 2; // Frais supplémentaires basés sur le poids
  return frais;
};

// Mettre à jour le statut d'une livraison
exports.mettreAJourStatut = async (req, res) => {
  try {
    const { statut } = req.body;
    const livraison = await livraisonModel.findById(req.params.livraisonId);

    if (!livraison) {
      return res.status(404).json({ message: 'Livraison non trouvée.' });
    }

    livraison.statut = statut;
    await livraison.save();
    res.status(200).json({ message: 'Statut de la livraison mis à jour avec succès', livraison });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du statut de la livraison', error });
  }
};

// Obtenir l'adresse de livraison
exports.getAdresseLivraison = async (req, res) => {
  try {
    const livraison = await livraisonModel.findById(req.params.livraisonId);
    if (!livraison) {
      return res.status(404).json({ message: 'Livraison non trouvée.' });
    }
    res.status(200).json({ adresse: livraison.adresse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'adresse', error });
  }
};

// Obtenir la date de livraison
exports.getDateLivraison = async (req, res) => {
  try {
    const livraison = await livraisonModel.findById(req.params.livraisonId);
    if (!livraison) {
      return res.status(404).json({ message: 'Livraison non trouvée.' });
    }
    res.status(200).json({ dateLivraison: livraison.dateLivraison });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération de la date de livraison', error });
  }
};

// Suivre une livraison avec un numéro de suivi
exports.suivreLivraison = async (req, res) => {
  try {
    const { numeroSuivi } = req.params;
    // Exemple basique de suivi, il faudrait une vraie logique ici
    res.status(200).json({ message: `Suivi de la livraison : Numéro ${numeroSuivi}, statut: En transit` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors du suivi de la livraison', error });
  }
};

// Annuler une livraison
exports.annulerLivraison = async (req, res) => {
  try {
    const livraison = await livraisonModel.findById(req.params.livraisonId);
    if (!livraison) {
      return res.status(404).json({ message: 'Livraison non trouvée.' });
    }

    if (livraison.statut === 'Livrée') {
      return res.status(400).json({ message: 'Impossible d\'annuler une livraison déjà livrée.' });
    }

    livraison.statut = 'Annulée';
    await livraison.save();
    res.status(200).json({ message: 'Livraison annulée avec succès', livraison });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de l\'annulation de la livraison', error });
  }
};

// Confirmer la livraison
exports.confirmerLivraison = async (req, res) => {
  try {
    const livraison = await livraisonModel.findById(req.params.livraisonId);
    if (!livraison) {
      return res.status(404).json({ message: 'Livraison non trouvée.' });
    }

    if (livraison.statut !== 'Expédiée') {
      return res.status(400).json({ message: 'La livraison doit être expédiée pour être confirmée.' });
    }

    livraison.statut = 'Livrée';
    await livraison.save();
    res.status(200).json({ message: 'Livraison confirmée avec succès', livraison });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la confirmation de la livraison', error });
  }
};
//Choix de Transporteurs Multiples
// Liste des transporteurs disponibles
exports.listerTransporteurs = async (req, res) => {
  try {
    const transporteurs = [
      { nom: 'Standard', delai: '5-7 jours', frais: 5 },
      { nom: 'Express', delai: '1-2 jours', frais: 15 },
      { nom: 'Retrait en magasin', delai: 'Immédiat', frais: 0 },
    ];

    res.status(200).json({ transporteurs });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des transporteurs', error });
  }
};

// Choisir un transporteur pour la livraison
exports.choisirTransporteur = async (req, res) => {
  try {
    const { commandeId } = req.params;
    const { transporteur } = req.body; // transporteur choisi par l'utilisateur

    // Trouver la commande par ID
    const commande = await Commande.findById(commandeId);
    if (!commande) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    // Appliquer le transporteur à la commande
    commande.transporteur = transporteur.nom;
    commande.fraisLivraison = transporteur.frais;
    commande.delaiLivraison = transporteur.delai;

    await commande.save();
    res.status(200).json({ message: 'Transporteur choisi avec succès', commande });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors du choix du transporteur', error });
  }
};

// Calcul des frais de livraison en fonction du poids et de la localisation
exports.calculerFraisLivraison = async (req, res) => {
  try {
    const { localisation, poids } = req.body; // localisation (ex: code postal) et poids (en kg)

    // Exemple de règles de calcul basées sur le poids et la localisation
    let fraisLivraison = 0;
    
    if (poids <= 1) {
      fraisLivraison = 5; // Livraison standard
    } else if (poids <= 5) {
      fraisLivraison = 10; // Livraison standard
    } else {
      fraisLivraison = 20; // Livraison standard
    }

    // Ajuster les frais en fonction de la localisation (code postal)
    if (localisation.startsWith('75')) {
      fraisLivraison += 2; // Ajouter des frais supplémentaires pour Paris
    }

    res.status(200).json({ fraisLivraison });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors du calcul des frais de livraison', error });
  }
};
