const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Le mot de passe doit contenir au moins 8 caractères, une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial.",
      ],
    },
    role: {
      type: String,
      enum: ["admin", "client", "infi"],
    },
    user_image: { type: String, require: false, default: "client.png" },
    age: { type: Number },
    count: { type: Number, default: '0' },
   
    //Un utilisateur peut passer plusieurs commandes, mais chaque commande appartient à un seul utilisateur.
    commandes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Commande' }], // Relation un-à-plusieurs
    //Un utilisateur a un seul panier, et chaque panier appartient à un seul utilisateur.
    panier: { type: mongoose.Schema.Types.ObjectId, ref: 'Panier' } ,// Relation un-à-un
    //Un utilisateur peut avoir plusieurs produits favoris, et chaque produit peut être favori de plusieurs utilisateurs.
    favoris: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Produit' }], // Relation plusieurs-à-plusieurs
    //Un utilisateur peut soumettre plusieurs réclamations, et chaque réclamation appartient à un seul utilisateur.
   reclamations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reclamation' }] // Relation un-à-plusieurs





  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt();
    const user = this;
    user.password = await bcrypt.hash(user.password, salt);
    //user.etat = false ;
    user.count = user.count + 1;
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.post("save", async function (req, res, next) {
  console.log("new user was created & saved successfully");
  next();
});

const user = mongoose.model("user", userSchema);
module.exports = user;