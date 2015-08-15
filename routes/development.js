var multer = require('multer');
upload = multer({ dest: process.cwd() + '/public/images' });
var Image = require('../models/image');


module.exports = function(app) {
    app.get('/uploadAlot', app.common.isLoggedIn, function(req, res) {
        res.render('uploadAlot.jade');
    });

    app.post('/uploadAlot', app.common.isLoggedIn, upload.array('images'), function(req, res) {
        var tempImages = [];
        for (i = 0; i < req.files.length; i++) {
            //console.log(req.files.length);
            var tempImage = new Image({
                url: '/static/images/' + req.files[i].filename,
                uploadedBy: req.user._id
            });
            tempImages.push(tempImage);
            console.log(tempImage._id);
            req.user.images.push(tempImage._id);
            //tempImage.save(function(err) {
                //if (err) console.log(err);
                //else {
                    //console.log(tempImage._id);
                    //req.user.images.push(tempImage._id);
                    //req.user.save(function(err) {
                        //if (err) console.log(err);
                        ////else console.log(tempImage._id);
                    //});
                //}
            //});
            //Image.collection.insert(tempImage[i], function(err) {
            //if (err) console.log(err);
            //else {
                //req.user.save(function(err) {
                    //if (err) console.log(err);
                    //else res.redirect('/profile');
                //});
            //}
        //});
        }
        //console.log(tempImages);
        Image.create(tempImages, function(err) {
            if (err) console.log(err);
            else {
                req.user.save(function(err) {
                    if (err) console.log(err);
                    else res.redirect('/profile');
                });
            }
        });
    });
};
