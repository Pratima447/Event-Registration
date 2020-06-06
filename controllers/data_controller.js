var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

var insert_DB = require('../controllers/insert_user_data.js');

exports.store_data = function (req, res) {
    var name      = req.body.name;
    var mobile    = req.body.mobile;
    var email     = req.body.email;
    var res_type  = req.body.registration_type;
    var ticket_no = req.body.ticket_no;
    var pic_path = '/public/uploads/' + req.body.pic_name;
    
    var date = new Date();
    var register_date   = date.toISOString().replace(/T/, ' ').replace(/\..+/, '');
    var registration_id = date.getTime();

    var user_data = {
        'register_id' : registration_id,
        'register_date': register_date,
        'name': name,
        'mobile': mobile,
        'email': email,
        'register_type': res_type,
        'tickets': ticket_no,
        'pic': pic_path
    };

    let result = insert_data();
    res.send({ 'id':registration_id});

    async function insert_data() {
        try {
            let result = await (insert_DB.save_now(user_data));
            return user_data.register_id;
          
        } catch (error) {
            console.log('Error Occurred');
            console.log(error);
            return('Sorry, Try Again');
        }
    }
}