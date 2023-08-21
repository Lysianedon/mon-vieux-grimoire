//-------------- EXPRESS ---------------//
const express = require("express");
const router = express.Router();
//------------ MODELS -----------------//
const Book = require("../models/Book");
const bookCtrl = require("../controllers/book");
//------------ MIDDLEWARE -----------------//
const auth = require("../middlewares/auth");
const multer = require("../middlewares/multer-config");

router.get('/', bookCtrl.getBooks);
router.get("/bestrating", bookCtrl.getBestRatedBooks);
router.get("/:id", bookCtrl.getBookByID);
router.post("/", auth, multer, bookCtrl.createBook);
router.put("/:id", auth, multer, bookCtrl.updateBook);
router.delete("/:id", auth, bookCtrl.deleteBook);
router.post("/:id/rating", auth, bookCtrl.addRating);


module.exports = router;