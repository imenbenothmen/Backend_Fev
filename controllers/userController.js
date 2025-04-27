const userModel = require('../models/userSchema');
const CommandeModel = require('../models/commandeSchema');
const PanierModel = require('../models/panierSchema');
const ProduitModel = require('../models/produitSchema');
const ReclamationModel = require('../models/reclamationSchema');
const jwt = require('jsonwebtoken');

const maxTime = 24 *60 * 60 //24H
//const maxTime = 1 * 60 //1min

const createToken = (id) => {
    return jwt.sign({id},'net secret pfe', {expiresIn: maxTime })
}

module.exports.addUserClient = async (req, res) => {
    try {
        // Affichage du contenu du body de la requête
        console.log(req.body); // Cela affichera les données envoyées dans le corps de la requête

        const { username, email, password, phone, role, delivery_address , user_image } = req.body;
        const roleClient = 'client';
        
        // Vérification des données (si nécessaire)
        if (!username || !email || !password) {
            throw new Error("Les champs username, email et password sont obligatoires.");
        }

        // Création de l'utilisateur
        const user = await userModel.create({
            username, email, password, role: roleClient, phone, delivery_address,  user_image
        });

        res.status(200).json({ user });
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'utilisateur:', error.message);  // Affichage de l'erreur dans la console
        res.status(500).json({ message: error.message });
    }
};
 

module.exports.addUserLivreur = async (req, res) => {
    try {
        // Affichage du contenu du body de la requête
        console.log(req.body); // Cela affichera les données envoyées dans le corps de la requête

        const { username, email, password, phone, delivery_address, numeroCarteFidelite, user_image } = req.body;

        // Vérification des données (si nécessaire)
        if (!username || !email || !password) {
            throw new Error("Les champs username, email et password sont obligatoires.");
        }

        // Création de l'utilisateur
        const user = await userModel.create({
            username,
            email,
            password,
            phone,
            role: "livreur",  // Rôle spécifique pour un livreur
            delivery_address,
            numeroCarteFidelite,
            user_image,
        });

        res.status(200).json({ message: "Livreur créé avec succès", user });
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'utilisateur livreur:', error.message);  // Affichage de l'erreur dans la console
        res.status(500).json({ message: error.message });
    }
};




module.exports.addUserAdmin = async (req, res) => {
    try {
        // Affichage du contenu du body de la requête
        console.log(req.body); // Cela affichera les données envoyées dans le corps de la requête

        const { username, email, password } = req.body;
        const roleAdmin = 'admin';

        // Vérification des données (si nécessaire)
        if (!username || !email || !password) {
            throw new Error("Les champs username, email et password sont obligatoires.");
        }

        // Création de l'utilisateur
        const user = await userModel.create({
            username,
            email,
            password,
            role: roleAdmin
        });

        // Affichage de l'utilisateur créé
        console.log(user);  // Cela affichera l'utilisateur créé

        res.status(200).json({ user });
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'utilisateur admin:', error.message);  // Affichage de l'erreur dans la console
        res.status(500).json({ message: error.message });
    }
};


module.exports.getAllUsers= async (req,res) => {
    try {
        console.log("get all users");
        
        const userListe = await userModel.find()

        res.status(200).json({userListe});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

module.exports.getUserById= async (req,res) => {
    try {
        //const id = req.params.id
        const {id} = req.params
        //console.log(req.params.id)
        const user = await userModel.findById(id)

        res.status(200).json({user});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

module.exports.deleteUserById= async (req,res) => {
    try {
        const {id} = req.params

        const checkIfUserExists = await userModel.findById(id);
        if (!checkIfUserExists) {
          throw new Error("User not found");
        }

        await userModel.findByIdAndDelete(id)

        res.status(200).json("deleted");
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

module.exports.addUserClientWithImg = async (req,res) => {
    try {
        const {username , email , password } = req.body;
        const roleClient = 'client'
        const {filename} = req.file

        const user = await userModel.create({
            username,email ,password,role :roleClient , user_image : filename
        })
        res.status(200).json({user});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}
module.exports.updateUserById = async (req, res) => {
    try {
        const {id} = req.params
        const {email , username} = req.body;
    
        await userModel.findByIdAndUpdate(id,{$set : {email , username }})
        const updated = await userModel.findById(id)
    
        res.status(200).json({updated})
    } catch (error) {
        res.status(500).json({message: error.message});
    }
    }
    module.exports.searchUserByUsername = async (req, res) => {
        try {
    
            const { username } = req.query
            if(!username){
                throw new Error("Veuillez fournir un nom pour la recherche.");
            }
    
            const userListe = await userModel.find({
                username: {$regex: username , $options: "i"}
            })
    
            if (!userListe) {
                throw new Error("User not found");
              }
              const count = userListe.length
            res.status(200).json({userListe,count})
        } catch (error) {
            res.status(500).json({message: error.message});
        }
        }
        module.exports.getAllUsersSortByAge= async (req,res) => {
            try {
                const userListe = await userModel.find().sort({age : 1}).limit(2)
                //const userListe = await userModel.find().sort({age : -1}).limit(2)
        
                res.status(200).json({userListe});
            } catch (error) {
                res.status(500).json({message: error.message});
            }
        }

        module.exports.getAllUsersAge= async (req,res) => {
            try {
                const {age} = req.params
                const userListe = await userModel.find({ age : age})
        
                res.status(200).json({userListe});
            } catch (error) {
                res.status(500).json({message: error.message});
            }
        }

        module.exports.getAllUsersAgeBetMaxAgeMinAge= async (req,res) => {
            try {
                const MaxAge = req.query.MaxAge
                const MinAge = req.query.MinAge
                const userListe = await userModel.find({age : { $gt : MinAge , $lt : MaxAge}}).sort({age : 1})
        
                res.status(200).json({userListe});
            } catch (error) {
                res.status(500).json({message: error.message});
            }
        }
        module.exports.getAllClient= async (req,res) => {
            try {
    
                const userListe = await userModel.find({role : "client"})
        
                res.status(200).json({userListe});
            } catch (error) {
                res.status(500).json({message: error.message});
            }
        }
        module.exports.getAllAdmin= async (req,res) => {
            try {
    
                const userListe = await userModel.find({role : "admin"})
        
                res.status(200).json({userListe});
            } catch (error) {
                res.status(500).json({message: error.message});
            }
        }


        module.exports.login= async (req,res) => {
            try {
                const { email , password } = req.body;
                const user = await userModel.login(email, password)
                const token = createToken(user._id)
                res.cookie("jwt_token_9antra", token, {httpOnly:false,maxAge:maxTime * 1000})
                res.status(200).json({user})
            } catch (error) {
                res.status(500).json({message: error.message});
            }
        }

        module.exports.logout= async (req,res) => {
            try {
          
                res.cookie("jwt_token_9antra", "", {httpOnly:false,maxAge:1})
                res.status(200).json("logged")
            } catch (error) {
                res.status(500).json({message: error.message});
            }
        }