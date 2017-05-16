var mongo = require('mongodb');
var BSON = require('bson');
var Server = mongo.Server,
    Db = mongo.Db;

var server = new Server('localhost', 27017, { auto_reconnect: true });
db = new Db('userdb', server);

db.open(function (err, db) {
    if (!err) {
        console.log("Connected to 'userdb' database");
        db.collection('users', { strict: true }, function (err, collection) {
            if (err) {
                console.log("The 'users' collection doesn't exist. Creating it with sample data...");
                populateDB();
            } else {
                //console.log("Connected to 'userdb' database", collection);
            }

        });
    }
});

exports.findById = function (req, res) {
    var id = req.params.id;
    console.log('Retrieving user: ' + id);
    db.collection('users', function (err, collection) {
        if (err) {
            throw err;
        } else {
            collection.findOne({ '_id': new BSON.ObjectID(id) }, function (err, item) {
                console.log("Items are: ", item);
                res.send(item);
            });
        }
    });
};

exports.findAll = function (req, res) {
    db.collection('users', function (err, collection) {
        collection.find().toArray(function (err, items) {
            res.send(items);
        });
    });
};

exports.addUser = function (req, res) {
    var user = req.body;
    console.log('Adding user: ' + JSON.stringify(user));
    db.collection('users', function (err, collection) {
        collection.insert(user, { safe: true }, function (err, result) {
            if (err) {
                res.send({ 'error': 'An error has occurred' });
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}

exports.updateUser = function (req, res) {
    var id = req.params.id;
    var user = req.body;
    console.log('Updating user: ' + id);
    console.log(JSON.stringify(user));
    db.collection('users', function (err, collection) {
        collection.update({ '_id': new BSON.ObjectID(id) }, user, { safe: true }, function (err, result) {
            if (err) {
                console.log('Error updating user: ' + err);
                res.send({ 'error': 'An error has occurred' });
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(user);
            }
        });
    });
}

exports.deleteUser = function (req, res) {
    var id = req.params.id;
    console.log('Deleting user: ' + id);
    db.collection('users', function (err, collection) {
        collection.remove({ '_id': new BSON.ObjectID(id) }, { safe: true }, function (err, result) {
            if (err) {
                res.send({ 'error': 'An error has occurred - ' + err });
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}

/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function () {

    var users = [
        {
            name: "Manish Kumar",
            joining_year: "2014",
            department: "Micrsoft Delivery",
            designation: "Team Lead"
        },
        {
            name: "Ashutosh Joshi",
            joining_year: "2014",
            department: "MLM EvalueServe",
            designation: "Senior Project Lead"
        }];

    db.collection('users', function (err, collection) {
        collection.insert(users, { safe: true }, function (err, result) { });
    });

};
