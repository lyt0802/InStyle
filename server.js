var express = require('express');
var app = express();

require('./config/database');
require('./config/app')(app);
require('./config/authentication')(app);
require('./common')(app);


app.get('/', app.common.isNotLoggedIn, function(req,res){
    res.render('index.jade',{userexists: req.flash('userexists'), inexistentEmail: req.flash('inexistentEmail'), wrongPassword: req.flash('wrongPassword')});
});

require('./routes/development')(app);
require('./routes/sessions')(app);
require('./routes/feed')(app);

var multer = require('multer');
var upload = multer({dest: './temp'});

var fse = require('fs-extra');
var Image = require('./models/image');

app.post('/upload', app.common.isLoggedIn, upload.single('image'), function(req,res){
    var newPath = process.cwd() + '/public/images/' + req.file.filename;
    fse.move(req.file.path, newPath, function(err){
        if(err) console.log(err);
        else {
            var tempImage = new Image({
                url: '/static/images/' + req.file.filename,
                uploadedBy: req.user._id
            });
            tempImage.save(function(err) {
                if (err) console.log(err);
                else {
                    req.user.images.push(tempImage._id);
                    req.user.save(function(err) {
                        if (err) console.log(err);
                        else res.redirect('/profile');
                    });
                }
            });

        }
    });
});

app.post('/upload-profile-picture', app.common.isLoggedIn, upload.single('image'), function(req,res){
    var newPath = process.cwd() + '/public/images/' + req.file.filename;
    fse.move(req.file.path, newPath, function(err){
        if(err) console.log(err);
        else {
            var tempImage = new Image({
                url: '/static/images/' + req.file.filename,
                uploadedBy: req.user._id
            });
            tempImage.save(function(err) {
                if (err) console.log(err);
                else {
                    req.user.profilePicture = tempImage._id;
                    req.user.save(function(err) {
                        if (err) console.log(err);
                        else res.redirect('/profile');
                    });
                }
            });

        }
    });
});


var http = require('http');
var server = http.createServer(app);
server.listen(3000, function(){
    console.log("listening on port 3000");
});
