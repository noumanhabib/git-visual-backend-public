const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
  destination(_req, _res, cb) {
    cb(null, './public/media');
  },
  filename(_req, file, cb) {
    cb(null, `${uuidv4()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

module.exports = upload;
