require("dotenv").config();
const express = require("express");
const cors = require("cors");
const router = require("./routes/routes");
const dbConnect = require("./config/database");

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

// Routes
app.use("/api", router);

app.listen(process.env.PORT, () => {
  console.log(`SERVER IS ON PORT ${process.env.PORT}`);
});

dbConnect();
