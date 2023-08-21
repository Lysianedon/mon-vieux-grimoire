const express = require('express');
const app = express();
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const mongoose = require('mongoose');
const path = require('path');

mongoose.connect(process.env.MONGO_URI,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie'))
  .catch(() => console.log('Connexion à MongoDB échouée'));

app.use(express.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

//--------------- ROUTERS ------------------//
const booksRouter = require("./routes/book");
const usersRouter = require("./routes/user");
app.use("/api/books", booksRouter);
app.use("/api/auth", usersRouter);
app.use('/images', express.static(path.join(__dirname, 'images')));
  

module.exports = app;