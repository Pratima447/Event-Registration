var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var Promise = require('promise');

exports.save_now = async function (data) {
    
    return new Promise(function (resolve, reject) {
        MongoClient.connect(url, (err, db) => {
            if (err) {
                reject(err);
            }
                var database = db.db('event_registration');
                database.collection("user_info").insertOne(data, function (err, res) {
                    if (err) {
                        return reject(err);
                    }
                    console.log('Inserted data');
                    db.close();
                    return resolve(0);
                })
               
            
        });

    })
}