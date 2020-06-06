
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        let ext_array = file.mimetype.split("/");
        let extension = ext_array[ext_array.length - 1];
        cb(null, file.originalname + '.' + extension);
    }
})

exports.save_img = function (req, res) {
    let upload = multer({ storage: storage}).single('pic');

    upload(req, res, function (err) {
        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (!req.file) {
            return res.send('Please select an image to upload');
        }
        else if (err) {
            res.send(err);
        }
        res.send(req.file.path);
    })
}