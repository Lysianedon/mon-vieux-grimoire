const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

const multerUpload = multer({ storage: storage }).single('image');

const sharpUpload = (req, res, next) => {
  if (req.file) {
    const updatedFilename = `${Date.now()}_${req.file.filename.split('.')[0]}.webp`;
    sharp(req.file.path)
    .webp({ quality: 80 })
    .toFile(`images/${updatedFilename}`, (err) => {
      if (err) {
          res.status(500).json(err);
        } else {
          req.updatedFilename = updatedFilename;
          fs.unlink(req.file.path, (err) => {
            if (err) {
              console.error("Error deleting original image:", err);
            }
          });
          next();
        }
      });
  } else {
    next();
  }
};

module.exports = { multerUpload, sharpUpload };

