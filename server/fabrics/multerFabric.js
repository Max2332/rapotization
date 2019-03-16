const multer = require('multer'),
    crypto = require('crypto'),
    storage = multer.diskStorage({
        destination: (req, file, cb) => cb(null, __dirname + '/../../upload/tmp'),
        filename: (req, file, cb) => {
            const filename = crypto.randomBytes(18).toString('hex'),
                extension = file.originalname.split('.')[1];
            cb(null, filename + '.' + extension);
        }
    });
module.exports = (filename) => multer({
    storage: storage
}).single(filename);