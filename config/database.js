const mongoose = require("mongoose");
require("dotenv").config();

const url = `${process.env.MONGODB_URL}`;

const dbConnect = () => {
  mongoose
    .connect(url)
    .then(() => console.log("CONNECT TO DATABASE"))
    .catch((error) => {
      console.log(error.message);
    });
};

module.exports = dbConnect;
