const multer = require('multer');
const path = require('path');
const fs = require('fs');

const songsDir = path.join(__dirname, '..', 'uploads', 'songs');
const coversDir = path.join(__dirname, '..', 'uploads', 'covers');

[songsDir, coversDir].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'audio') {
      cb(null, songsDir);
    } else if (file.fieldname === 'cover') {
      cb(null, coversDir);
    } else {
      cb(new Error('Unexpected field'), null);
    }
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'audio') {
    if (!file.mimetype.startsWith('audio/')) {
      return cb(new Error('Only audio files are allowed for audio field'));
    }
  } else if (file.fieldname === 'cover') {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed for cover field'));
    }
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 25 * 1024 * 1024 },
});

module.exports = upload;
