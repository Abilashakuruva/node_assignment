const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");

const app = express();
app.use(express.json());

const PORT = 5000;

const userRoutes = require("./routes/users");
app.use("/", userRoutes);

const MONGO_URI = "mongodb://127.0.0.1:27017/node_assignment";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


app.use('/',(req,res)=>{
    res.send("<h1>Welcome to Node");
})