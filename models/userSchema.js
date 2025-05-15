const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Le nom d'utilisateur est requis."],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "L'adresse e-mail est requise."],
      unique: true,
      lowercase: true,
      match: [
        /^\S+@\S+\.\S+$/,
        "Veuillez entrer une adresse e-mail valide.",
      ],
    },
    password: {
      type: String,
      required: [true, "Le mot de passe est requis."],
      minLength: [8, "Le mot de passe doit contenir au moins 8 caractères."],
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Le mot de passe doit contenir au moins 8 caractères, une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial.",
      ],
    },
    phone: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      enum: ["admin", "client"],
      default: "client",
    },
    delivery_address: {
      type: String,
      required: false,
      default: "client",
    },

    user_image: {
      type: String,
      required: false,
    },

    etat: Boolean,
    ban: Boolean,

    commandes: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Commande" },
    ],
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "cart",
    },
    favoris: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Produit" },
    ],
    complaint: [
      { type: mongoose.Schema.Types.ObjectId, ref: "complaint" },
    ],
  },
  { timestamps: true }
);

// Cryptage du mot de passe avant sauvegarde
userSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Log après sauvegarde
userSchema.post("save", function (doc, next) {
  console.log("Nouvel utilisateur créé et enregistré avec succès.");
  next();
});

// Méthode de connexion personnalisée
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) {
    throw new Error("Adresse e-mail introuvable.");
  }

  const auth = await bcrypt.compare(password, user.password);
  if (!auth) {
    throw new Error("Mot de passe incorrect.");
  }

  // Décommenter si vous voulez activer/désactiver ou bannir des comptes
  // if (!user.etat) {
  //   throw new Error("Le compte est désactivé.");
  // }
  // if (user.ban) {
  //   throw new Error("Le compte a été banni.");
  // }

  return user;
};

const user = mongoose.model("user", userSchema);
module.exports = user;
