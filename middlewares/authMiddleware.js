const jwt = require("jsonwebtoken");
const userModel = require("../models/userSchema");

const requireAuthUser = async (req, res, next) => {
  // -------------------- Version vraie avec token --------------------
  /*
  const token = req.cookies.jwt_token_9antra;

  if (token) {
    jwt.verify(token, 'net secret pfe', async (err, decodedToken) => {
      if (err) {
        console.log("il ya une erreur au niveau du token", err.message);
        req.session.user = null;  //session null
        return res.json("/Problem_token");
      } else {
        req.session.user = await userModel.findById(decodedToken.id); //session feha user
        next();
      }
    });
  } else {
    req.session.user = null; //session null
    return res.json("/pas_de_token");
  }
  */

  // -------------------- Version test sans token --------------------
  req.session.user = await userModel.findOne(); // ou fixe : { _id: "testUserId", username: "TestUser" }
  next();
};

module.exports = { requireAuthUser };
