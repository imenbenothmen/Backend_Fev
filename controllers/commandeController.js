const Commande = require('../models/commandeSchema');
const cart = require('../models/cartSchema');
const Product = require('../models/productSchema');

// Créer une commande à partir du panier d'un utilisateur
exports.createCommande = async (req, res) => {
  try {
    const { clientId } = req.body;

    // Récupérer le panier de l'utilisateur
    const panier = await Panier.findOne({ client: clientId }).populate('produits.produit');

    if (!panier || panier.produits.length === 0) {
      return res.status(400).json({ message: 'Panier vide ou non trouvé' });
    }

    // Calculer le total de la commande
    const produits = panier.produits.map(p => ({
      produit: p.produit._id,
      quantite: p.quantite,
      prix: p.produit.prix,
    }));
    const total = produits.reduce((acc, p) => acc + p.prix * p.quantite, 0);

    // Créer la commande
    const commande = new Commande({
      client: clientId,
      produits,
      total,
    });

    await commande.save();

    // Vider le panier après la commande
    panier.produits = [];
    await panier.save();

    res.status(201).json({ message: 'Commande créée avec succès', commande });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de la commande', error });
  }
};

// Récupérer toutes les commandes d'un client
exports.getCommandesByClient = async (req, res) => {
  try {
    const commandes = await Commande.find({ client: req.params.clientId });

    if (!commandes || commandes.length === 0) {
      return res.status(404).json({ message: 'Aucune commande trouvée pour ce client' });
    }

    res.status(200).json(commandes);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des commandes', error });
  }
};

// Modifier le statut d'une commande
exports.updateStatutCommande = async (req, res) => {
  try {
    const { statut } = req.body;
    const { commandeId } = req.params;

    // Vérifier que le statut est valide
    const statutsValid = ['en attente', 'validée', 'expédiée', 'livrée', 'annulée'];
    if (!statutsValid.includes(statut)) {
      return res.status(400).json({ message: 'Statut non valide' });
    }

    const commande = await Commande.findById(commandeId);

    if (!commande) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    commande.statut = statut;
    commande.dateModification = Date.now();

    await commande.save();
    res.status(200).json({ message: 'Statut de la commande mis à jour', commande });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du statut de la commande', error });
  }
};

// Annuler une commande
exports.annulerCommande = async (req, res) => {
  try {
    const { commandeId } = req.params;

    const commande = await Commande.findById(commandeId);

    if (!commande) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    // Ne pas permettre l'annulation si la commande est déjà expédiée ou livrée
    if (commande.statut === 'expédiée' || commande.statut === 'livrée') {
      return res.status(400).json({ message: 'Impossible d\'annuler une commande expédiée ou livrée' });
    }

    commande.statut = 'annulée';
    commande.dateModification = Date.now();

    await commande.save();
    res.status(200).json({ message: 'Commande annulée', commande });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'annulation de la commande', error });
  }
};

// Afficher les détails d'une commande
exports.getCommandeDetails = async (req, res) => {
  try {
    const commande = await Commande.findById(req.params.commandeId).populate('produits.produit');

    if (!commande) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    res.status(200).json(commande);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'affichage de la commande', error });
  }
};

//Suivi des Commandes en Temps Réel
// Suivre une commande
exports.suiviCommande = async (req, res) => {
  try {
    const { commandeId } = req.params;
    const commande = await Commande.findById(commandeId);

    if (!commande) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    res.status(200).json({ commande });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors du suivi de la commande', error });
  }
};



//Envoyer une notification (email/SMS) lors d'un changement de statut de commande :
//const nodemailer = require('nodemailer');
//const smsService = require('some-sms-service'); // Remplacer par ton service SMS

// Notifier un utilisateur lors du changement de statut de la commande
exports.notifierChangementStatut = async (req, res) => {
  try {
    const { commandeId } = req.params;
    const commande = await Commande.findById(commandeId);

    if (!commande) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    const utilisateur = await User.findById(commande.userId);

    // Envoi d'email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'tonemail@gmail.com', // Ton email
        pass: 'tonmotdepasse', // Ton mot de passe ou une application spécifique
      },
    });

    const mailOptions = {
      from: 'tonemail@gmail.com',
      to: utilisateur.email,
      subject: 'Statut de ta commande',
      text: `Le statut de ta commande ${commandeId} a changé en ${commande.statut}.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'email', error });
      }
      console.log('Email envoyé : ' + info.response);
    });

    // Envoi SMS (exemple avec un service fictif)
    smsService.sendSMS(utilisateur.numero, `Le statut de ta commande ${commandeId} a changé en ${commande.statut}`);

    res.status(200).json({ message: 'Notification envoyée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'envoi de la notification', error });
  }
};

//Modifier une commande avant expédition 
// Modifier une commande avant expédition
exports.modifierCommandeAvantExpedition = async (req, res) => {
  try {
    const { commandeId } = req.params;
    const { produits } = req.body; // Liste des produits à ajouter, supprimer ou modifier

    const commande = await Commande.findById(commandeId);

    if (!commande) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    if (commande.statut === 'expédiée' || commande.statut === 'livrée') {
      return res.status(400).json({ message: 'Impossible de modifier une commande expédiée ou livrée' });
    }

    // Modifier les produits dans la commande
    commande.produits = produits;

    await commande.save();
    res.status(200).json({ message: 'Commande modifiée avec succès', commande });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la modification de la commande', error });
  }
};
//Voir l'historique des commandes
// Historique des commandes de l'utilisateur
exports.historiqueCommandes = async (req, res) => {
  try {
    const { userId } = req.params;
    const commandes = await Commande.find({ userId });

    if (!commandes || commandes.length === 0) {
      return res.status(404).json({ message: 'Aucune commande trouvée pour cet utilisateur' });
    }

    res.status(200).json({ commandes });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'historique des commandes', error });
  }
};
//Afficher les détails d'une commande spécifique
// Détails d'une commande spécifique
exports.detailsCommande = async (req, res) => {
  try {
    const { commandeId } = req.params;
    const commande = await Commande.findById(commandeId).populate('produits.produitId');

    if (!commande) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    res.status(200).json({ commande });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des détails de la commande', error });
  }
};
