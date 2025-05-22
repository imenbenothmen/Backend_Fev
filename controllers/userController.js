const userModel = require('../models/userSchema');
const orderModel = require('../models/orderSchema');
const cartModel = require('../models/cartSchema');
const ProductModel = require('../models/productSchema');
const complaintModel = require('../models/complaintSchema');
const jwt = require('jsonwebtoken');

const maxTime = 3 * 24 * 60 * 60; // 3 jours

const createToken = (id, role) => {
  return jwt.sign({ id, role }, "net secret pfe", { expiresIn: maxTime });
};
// ✅ Créer le tout premier admin (accès libre, sans auth)
module.exports.createFirstAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Vérification simple
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Tous les champs sont obligatoires." });
    }

    // Vérifie si un admin existe déjà
    const existingAdmin = await userModel.findOne({ role: "admin" });
    if (existingAdmin) {
      return res.status(403).json({ message: "Un administrateur existe déjà." });
    }

    // Crée l'admin
    const admin = await userModel.create({
      username,
      email,
      password,
      role: "admin"
    });

    res.status(201).json({ message: "Admin créé avec succès", admin });
  } catch (error) {
    console.error("Erreur création admin:", error.message);
    res.status(500).json({ message: "Erreur lors de la création de l'administrateur." });
  }
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
 /*module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.login(email, password);
    const token = createToken(user._id);

    // Ici tu mets le res.cookie avec les options
    res.cookie("jwt_token_9antra", token, { 
      httpOnly: false,       // pour debug, sinon mettre true
      maxAge: maxTime * 1000,
      sameSite: 'lax',       // obligatoire pour cookie cross-origin
      secure: false          // false en local (pas https)
    });

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Échec de la connexion. Vérifiez vos identifiants." });
  }
};*/


// ✅ LOGIN
module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.login(email, password); // Vérifie email + mdp dans ton modèle

    // 🔐 Création token avec role
    const token = createToken(user._id, user.role);

    // 🥠 Cookie de session
    res.cookie("jwt_token_9antra", token, {
      httpOnly: true,       //  doit être TRUE pour que le backend le reçoive
      maxAge: maxTime * 1000,
      sameSite: 'lax',
      secure: false          // true en HTTPS
    });

    res.status(200).json({ user: {
      id: user._id,
      username: user.username,
      role: user.role,
      email: user.email
    }});
  } catch (error) {
    console.error("Erreur login :", error.message);
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
module.exports.getMyProfile = async (req, res) => {
  try {
    // Remplacé req.session.user._id par req.user.id
    const user = await userModel.findById(req.user.id);
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération du profil." });
  }
};


module.exports.updateMyProfile = async (req, res) => {
  try {
    const updates = req.body;
    await userModel.findByIdAndUpdate(req.user.id, { $set: updates });
    const updated = await userModel.findById(req.user.id);
    res.status(200).json({ updated });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour du profil." });
  }
};


