var mongoose = require('mongoose');
var databaseName = 'inStyle';
mongoose.connect('mongodb://localhost/' + databaseName);

var User = require('../models/user');

for (i = 0; i < 10; i++) {
    var tempUser = new User({
        email: i + '@gmail.com',
        password: i
    });
    tempUser.save(function(err) {
        if (err) console.log(err);
    });
}
