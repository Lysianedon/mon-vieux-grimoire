const Book = require("../models/Book");
const fs = require('fs');
const sharp = require('sharp');

exports.getBooks = (_req,res) => {
    Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({error}));
};

exports.getBookByID = (req,res) => {
    Book.findById(req.params.id)
    .then(book => res.status(200).json(book))
    .catch(error => res.status(400).json({error}));
};

exports.getBestRatedBooks =  async (req,res) => {
    try {
        const topRatedBooks = await Book.find().sort({averageRating: -1}).limit(3);
        res.status(200).json(topRatedBooks); 
    } catch (error) {
        res.status(400).json({error});
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
        .catch(error => res.status(400).json({error}));
};

exports.updateBook = async (req, res) => {
    try {
      const bookObj = req.file
        ? {
            ...JSON.parse(req.body.book),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.updatedFilename}`,
            userId: req.auth.userId,
          }
        : {
            ...req.body,
            userId: req.auth.userId,
          };
  
      const book = await Book.findById(req.params.id);
  
      if (!book) {
        return res.status(404).json({ error: 'Book not found' });
      }
  
      if (book.userId != req.auth.userId) {
        return res.status(401).json({ error: 'Not authorized' });
      }

      const filename = book.imageUrl.split('/images/')[1];

      // Delete the old image file if new one is uploaded
      if (req.file) {
        fs.unlink(`images/${filename}`, (err) => {
            if (err) {
            console.error('Error deleting file:', err);
            return res.status(500).json({ err});
            }
        });
      }
    
      const updatedBook = await Book.updateOne({ _id: book._id }, bookObj);
      return res.status(200).json(updatedBook);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error });
    }
  };

exports.deleteBook = async (req, res) => {
    try {
      const book = await Book.findById(req.params.id);  

      if (book.userId != req.auth.userId) {
        return res.status(401).json({  error: "Unauthorized" }); 
      }
    const filename = book.imageUrl.split('/images/')[1];
    fs.unlink(`images/${filename}`, (err) => {
        if (err) {
          console.error('Error deleting file:', err);
          return res.status(500).json({ err});
        }
    });
    await Book.findByIdAndDelete(req.params.id);
    return res.status(200).json({error: 'Book successfully deleted!'});
    } catch (error) {
        console.error(error);
        res.status(500).json({error})
    }
}

exports.addRating = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (book.ratings.filter(rating => rating.userId == req.auth.userId).length) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        book.ratings.push({userId: req.auth.userId, grade: req.body.rating});
        const sumRatings = book.ratings.reduce((sum, rating) => sum + rating.grade, 0);
        let averageRating = sumRatings / book.ratings.length;
        if (averageRating % 1 !== 0) {
            averageRating = averageRating.toFixed(1);
        }

        const updatedBook = await Book.findByIdAndUpdate(
            { _id: book._id },
            { ratings: book.ratings, averageRating },
            { new: true }
        );

        return res.status(200).json(updatedBook); 
    } catch (error) {
        console.error(error);
        res.status(500).json({error})
    }
}
