var Image = require('../models/image');
var User = require('../models/user');

module.exports = function(app){
    app.get('/feed', app.common.isLoggedIn, function(req, res) {
        res.render('feed.jade');
    });

    app.get('/explore', app.common.isLoggedIn, function(req,res){
        //console.log('HERE FOR REAL');
        
        Image.find({ _id: { $nin: req.user.upvotedImages.concat(req.user.downvotedImages) } })
             .exec(function(err, images) {
                if (err) console.log(err); 
                else res.render('explore.jade', {email: req.user.email, images: images });
             });
    });

    app.post('/search/', app.common.isLoggedIn, function(req, res) {
        if (req.body.search === '') {
            User.find({ _id: { $nin: [req.user._id] } })
                .select('email')
                .exec(function(err, users) {
                    if (err) console.log(err);
                    else res.render('searchedUsers.jade', { users: users });
                });
        }
    });


    app.post('/upvote/:id', app.common.isLoggedIn, function(req, res, next) {
        Image.findById(req.params.id, function(err, image) {
            //todolater: check about isolation (ACID)
            if (err) console.log(err);
            else {
                var length = image.upvoteUsers.length;
                console.log(length);
                image.upvoteUsers.addToSet(req.user._id);
                console.log(image.upvoteUsers.length);
                if (length != image.upvoteUsers.length) {
                    image.upvoteCount = image.upvoteCount + 1;
                    image.save(function(err) {
                        if (err) console.log(err);
                        else {
                            req.user.upvotedImages.addToSet(image._id);
                            req.user.save(function(err){
                                if(err) console.log(err);
                                else res.send('good');
                            });
                        }
                    });
                }
            }
        });
    });

    app.post('/downvote/:id', function(req, res, next) {
        Image.findById(req.params.id, function(err, image) {
            //todolater: check about isolation (ACID)
            if (err) console.log(err);
            else {
                var length = image.downvoteUsers.length;
                console.log(length);
                image.downvoteUsers.addToSet(req.user._id);
                console.log(image.downvoteUsers.length);
                if (length != image.downvoteUsers.length) {
                    image.downvoteCount = image.downvoteCount + 1;
                    image.save(function(err) {
                        if (err) console.log(err);
                        else {
                            req.user.downvotedImages.addToSet(image._id);
                            req.user.save(function(err){
                                if(err) console.log(err);
                                else res.send('good');
                            });
                        }
                    });
                }
            }
        });
    });
};
