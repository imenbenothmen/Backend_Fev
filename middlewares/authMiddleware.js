const jwt = require("jsonwebtoken");
const userModel = require("../models/userSchema");

const requireAuthUser = async (req, res, next) => {
  const token = req.cookies.jwt_token_9antra;

  if (!token) {
    return res.status(401).json({ message: "Pas de token, accès refusé" });
  }

  try {
    // Vérifier le token (synchronement pour simplifier)
    const decodedToken = jwt.verify(token, 'net secret pfe');

    // Récupérer l'utilisateur en base
    const user = await userModel.findById(decodedToken.id).select("username role email");
    if (!user) {
      return res.status(401).json({ message: "Utilisateur non trouvé" });
    }

    // Injecter l'utilisateur dans req.user (au lieu de req.session.user)
    req.user = {
      id: user._id,
      username: user.username,
      role: user.role,
      email: user.email,
    };

    next();

  } catch (err) {
    console.log("Erreur token:", err.message);
    return res.status(401).json({ message: "Token invalide, accès refusé" });
  }
};

const requireAdmin = (req, res, next) => {
  // Vérifie que req.user existe et que son rôle est admin
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Accès réservé aux administrateurs" });
  }
};

module.exports = { requireAuthUser, requireAdmin };
