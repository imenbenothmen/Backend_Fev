const userModel = require('../models/userSchema');
const orderModel = require('../models/orderSchema');
const cartModel = require('../models/cartSchema');
const ProductModel = require('../models/productSchema');
const complaintModel = require('../models/complaintSchema');
const jwt = require('jsonwebtoken');

const maxTime = 24 * 60 * 60; // 24H

const createToken = (id) => {
  return jwt.sign({ id }, 'net secret pfe', { expiresIn: maxTime });
};

// ✅ GET ALL USERS
module.exports.getAllUsers = async (req, res) => {
  try {
    console.log("get all users");
    const userListe = await userModel.find();
    res.status(200).json({ userListe });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs." });
  }
};

// ✅ ADD CLIENT
module.exports.addUserClient = async (req, res) => {
  try {
    const { username, email, password, phone, role, delivery_address, user_image } = req.body;
    const roleClient = 'client';

    if (!username || !email || !password) {
      throw new Error("Les champs nom, email et mot de passe sont obligatoires.");
    }

    const user = await userModel.create({
      username, email, password, role: roleClient, phone, delivery_address, user_image
    });

    res.status(200).json({ user });
  } catch (error) {
    console.error('Erreur ajout client:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// ✅ ADD LIVREUR
module.exports.addUserLivreur = async (req, res) => {
  try {
    const { username, email, password, phone, delivery_address, numeroCarteFidelite, user_image } = req.body;

    if (!username || !email || !password) {
      throw new Error("Les champs nom, email et mot de passe sont obligatoires.");
    }

    const user = await userModel.create({
      username,
      email,
      password,
      phone,
      role: "livreur",
      delivery_address,
      numeroCarteFidelite,
      user_image,
    });

    res.status(200).json({ message: "Livreur créé avec succès", user });
  } catch (error) {
    console.error('Erreur ajout livreur:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// ✅ ADD ADMIN
module.exports.addUserAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const roleAdmin = 'admin';

    if (!username || !email || !password) {
      throw new Error("Les champs nom, email et mot de passe sont obligatoires.");
    }

    const user = await userModel.create({
      username,
      email,
      password,
      role: roleAdmin
    });

    res.status(200).json({ user });
  } catch (error) {
    console.error('Erreur ajout admin:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET USER BY ID
module.exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findById(id);
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Impossible de récupérer l'utilisateur." });
  }
};

// ✅ DELETE USER
module.exports.deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const check = await userModel.findById(id);
    if (!check) throw new Error("Utilisateur non trouvé.");

    await userModel.findByIdAndDelete(id);
    res.status(200).json("Utilisateur supprimé.");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ ADD CLIENT WITH IMAGE
module.exports.addUserClientWithImg = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const roleClient = 'client';
    const { filename } = req.file;

    const user = await userModel.create({
      username, email, password, role: roleClient, user_image: filename
    });

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création du client avec image." });
  }
};

// ✅ UPDATE USER
module.exports.updateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, username } = req.body;

    await userModel.findByIdAndUpdate(id, { $set: { email, username } });
    const updated = await userModel.findById(id);

    res.status(200).json({ updated });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour de l'utilisateur." });
  }
};

// ✅ SEARCH USERS BY NAME
module.exports.searchUserByUsername = async (req, res) => {
  try {
    const { username } = req.query;
    if (!username) {
      throw new Error("Veuillez fournir un nom pour la recherche.");
    }

    const userListe = await userModel.find({
      username: { $regex: username, $options: "i" }
    });

    if (!userListe || userListe.length === 0) {
      throw new Error("Aucun utilisateur trouvé.");
    }

    const count = userListe.length;
    res.status(200).json({ userListe, count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET CLIENTS
module.exports.getAllClient = async (req, res) => {
  try {
    const userListe = await userModel.find({ role: "client" });
    res.status(200).json({ userListe });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des clients." });
  }
};

// ✅ GET ADMINS
module.exports.getAllAdmin = async (req, res) => {
  try {
    const userListe = await userModel.find({ role: "admin" });
    res.status(200).json({ userListe });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des administrateurs." });
  }
};

// ✅ LOGIN
module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.login(email, password);
    const token = createToken(user._id);

    res.cookie("jwt_token_9antra", token, { httpOnly: false, maxAge: maxTime * 1000 });
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Échec de la connexion. Vérifiez vos identifiants." });
  }
};

// ✅ LOGOUT
module.exports.logout = async (req, res) => {
  try {
    res.cookie("jwt_token_9antra", "", { httpOnly: false, maxAge: 1 });
    res.status(200).json("Déconnexion réussie.");
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la déconnexion." });
  }
};
