const Book = require("../models/Book");
const fs = require('fs');
const sharp = require('sharp');

exports.getBooks = (_req,res) => {
    Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json(error));
};

exports.getBookByID = (req,res) => {
    Book.findById(req.params.id)
    .then(book => res.status(200).json(book))
    .catch(error => res.status(400).json(error));
};

exports.getBestRatedBooks =  async (req,res) => {
    try {
        // const topRatedBooks = await Book.find().sort((a,b) => Number(b.averageRating) - Number(a.averageRating)).splice(0,4);
        const topRatedBooks = await Book.find().sort({averageRating: -1}).limit(3);
        res.status(200).json(topRatedBooks); 
    } catch (error) {
        res.status(400).json(error);
    }    
};

exports.createBook = (req,res) => {
    const bookObj = JSON.parse(req.body.book);
    const book = new Book({
        ...bookObj,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.updatedFilename}`
      });
      book.save()
        .then(book => res.status(201).json(book))
        .catch(error => res.status(400).json(error));
};

exports.updateBook = (req, res) => {
    const bookObj = req.file ? 
    {...JSON.parse(req.body.book),imageUrl: `${req.protocol}://${req.get('host')}/images/${req.updatedFilename}`, userId: req.auth.userId} 
    : 
    {...req.body, userId: req.auth.userId};

    Book.findById(req.params.id)
    .then(book => {
        if (book.userId != req.auth.userId) {
            res.status(401).json({message: "Not authorized"})
        } else {
            const filename = book.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => { 
            Book.updateOne({_id: book._id}, bookObj)
            .then(book => res.status(200).json(book))
            .catch(error => res.status(401).json(error));
            }); 
    }
   })
   .catch(error => res.status(400).json(error))
};

exports.deleteBook = (req, res) => {
    Book.findById(req.params.id)
    .then(book => { 
        if (book.userId != req.auth.userId) {
            return res.status(401).json({ error: true, message: "Unauthorized" }); 
        }
        const filename = book.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
            Book.findByIdAndDelete(req.params.id)
                .then(() => res.status(200).json({success: true, message: 'Objet supprimé !'}))
                .catch(error => res.status(401).json({ error }));
        });
    })
    .catch(error => res.status(500).json(error));
};

exports.addRating = (req, res) => {
    Book.findById(req.params.id)
    .then(book => {
        //Make sure the user can't vote several times
        if (book.ratings.filter(rating => rating.userId == req.auth.userId).length) {
            return res.status(401).json({ error: true, message: "Unauthorized" });
        }
  
        book.ratings.push({userId: req.auth.userId, grade: req.body.rating});

        const sumRatings = book.ratings.reduce((sum, rating) => sum + rating.grade, 0);
        let averageRating = sumRatings / book.ratings.length;
        if (averageRating % 1 !== 0) {
            averageRating = averageRating.toFixed(1);
        }
        Book.findByIdAndUpdate({_id: book._id}, {ratings: book.ratings, averageRating}, {new: true})
        .then(updatedBook => res.status(200).json(updatedBook))
        .catch(error => res.status(401).json(error));
    })
    .catch(error => res.status(400).json({ error }));
};


