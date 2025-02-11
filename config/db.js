const mongoose = require("mongoose"); 

module.exports.connectToMongoDb = async () => {
  mongoose.set("strictQuery", false);
  mongoose.connect(process.env.MongDb_Ur1)
    .then(
        () => { console.log("connnect to db") }
    )
    .catch((err) => {
      console.log(err);
    });
};