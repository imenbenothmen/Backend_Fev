const bijouModel = require('../models/bijouSchema');
const userModel = require('../models/userSchema');

module.exports.getAllbijoux = async (req, res) => {
  try {
    const bijouList = await bijouModel.find();

    if (!bijouList || bijouList.length === 0) {
      throw new Error("Aucun bijou trouvé");
    }

    res.status(200).json(bijouList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.getbijouById = async (req, res) => {
  try {
    const id = req.params.id;
    const bijou = await bijouModel.findById(id).populate("owner");

    if (!bijou || bijou.length === 0) {
      throw new Error("bijou introuvable");
    }

    res.status(200).json(bijou);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



module.exports.deletebijouById = async (req, res) => {
  try {
    const id = req.params.id;

    const bijouById = await bijouModel.findById(id);

    if (!bijouById || bijouById.length === 0) {
      throw new Error("bijou introuvable");
    }

    await userModel.updateMany({}, {
      $pull: { bijoux: id },
    });

    await bijouModel.findByIdAndDelete(id);

    res.status(200).json("deleted");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports.addbijou = async (req, res) => {
  try {
    const { nom, description, prix, stock,images,categorie, materiau, type, poids, dimensions, pierres, enVedette } = req.body;

    // Vérifier que les champs obligatoires sont présents
    if (!nom & !description & !prix & !stock & !categorie & !materiau & !type & !poids) {
      throw new Error("errue data");
    }

    // Créer un nouvel objet Bijou
    const bijou = await bijouModel.create({
      nom,
      description,
      prix,
      stock,
      images,
      categorie,
      materiau,
      type,
      poids,
      dimensions,
      pierres,
      enVedette
    });


    res.status(200).json({ bijou });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports.updatebijou = async (req, res) => {
  try {
    const id = req.params.id;
    const { nom, description, prix, stock, materiau,images, categorie, type, poids, dimensions, pierres, enVedette } = req.body;

    const bijouById = await bijouModel.findById(id);

    if (!bijouById) {
      throw new Error("bijou introuvable");
    }

    if (!nom & !description & !prix & !stock & !categorie & !materiau & !type & !poids) {
      throw new Error("errue data");
    }

    await bijouModel.findByIdAndUpdate(id, {
      $set: { nom, description, prix, stock, images, categorie, materiau, type, poids, dimensions, pierres, enVedette  },
    });

    const updated = await bijouModel.findById(id);

    res.status(200).json({ updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.vendre = async (req, res) => {
  try {
    const { userId, bijouId } = req.body;

    const bijouById = await bijouModel.findById(bijouId);

    if (!bijouById) {
      throw new Error("bijou introuvable");
    }
    const checkIfUserExists = await userModel.findById(userId);
    if (!checkIfUserExists) {
      throw new Error("Utilisateur introuvable");
    }

    await bijouModel.findByIdAndUpdate(bijouId, {
      $set: { userbijou: userId },
    });

    await userModel.findByIdAndUpdate(userId, {
      $push: { bijoux: bijouId },
    });

    res.status(200).json('Bijou vendu avec succès');
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.removeBijouFromUser = async (req, res) => {
  try {
    const { userId, bijouId } = req.body;

    const bijouById = await bijouModel.findById(bijouId);

    if (!bijouById) {
      throw new Error("bijou introuvable");
    }
    const checkIfUserExists = await userModel.findById(userId);
    if (!checkIfUserExists) {
      throw new Error("Utilisateur introuvable");
    }

    await bijouModel.findByIdAndUpdate(bijouId, {
      $unset: { userbijou: 1 },// null "" 
    });

    await userModel.findByIdAndUpdate(userId, {
      $pull: { bijoux: bijouId },
    });

    res.status(200).json('bijou retiré de l\'utilisateur');
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


  





