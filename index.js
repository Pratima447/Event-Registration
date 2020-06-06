const express  = require("express");
const path     = require("path");
var bodyParser = require('body-parser');


const multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        let ext_array = file.mimetype.split("/");
        let extension = ext_array[ext_array.length - 1];
        console.log('ext = ' + extension);
        cb(null, file.fieldname + '_' + Date.now() + '.' + extension);
    }
    
})
var upload = multer({storage: storage});

var image_controller = require('./controllers/image_controller.js');
var data_controller = require('./controllers/data_controller.js');

const app = express();
const port = process.env.PORT || "8001";

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(express.static('public'));
/**
 *  App Configuration
 */
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));


app.get('/', (req, res) => {
	res.render('home/index');
})

app.post('/upload_pic', image_controller.save_img);
app.get('/preview', function (req, res) {
    res.render('home/preview')
})

app.post('/submit', data_controller.store_data);

/**
 * Server Activation
 */
app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});