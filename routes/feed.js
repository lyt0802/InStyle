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

    app.put('/imageInfo/:id', function(req, res) {
        //res.send(req.body);
        Image.findById(req.params.id)
             .exec(function(err, image) {
                if (err) console.log(err);
                else {
                    image.description = req.body.description;
                    image.tags = req.body.tags.split(','); 
                    image.save(function(err){
                        if (err) console.log(err);
                        else{
                            res.redirect('/profile');
                        }
                    });
                }
             });
    });

    app.delete('/deleteImage/:id', function(req, res) {
        //res.send('true');
        Image.findById(req.params.id)
             .populate('upvoteUsers downvoteUsers')
             .exec(function(err,image){
                //console.log(typeof req.user._id);
                //console.log(typeof image.uploadedBy);
                if(req.user._id.equals(image.uploadedBy)){
                    req.user.images.pull(req.params.id);
                    req.user.save(function(err) {
                        if (err) console.log(err);
                    });
                    for (i = 0; i < image.upvoteUsers.length; i++) {
                        image.upvoteUsers[i].upvotedImages.pull(req.params.id);
                        image.upvoteUsers[i].save(function(err) {
                            console.log(err);
                        });
                    }
                    for (i = 0; i < image.downvoteUsers.length; i++) {
                        image.downvoteUsers[i].downvotedImages.pull(req.params.id);
                        image.downvoteUsers[i].save(function(err) {
                            console.log(err);
                        });
                    }
                    image.remove(); 
                    res.send('true');
                } else {
                    res.send('false');
                }
             });

    });

    app.get('/bookmarks', app.common.isLoggedIn, function(req, res){
        User.findById(req.user._id)
            .select('bookmarks')
            .populate('bookmarks')
            .exec(function(err,user){
                if(err) console.log(err);
                else {
                    console.log(user);
                    res.render('bookmark.jade',{user: user});
                }
            });
    });

    app.post('/bookmark/:id', app.common.isLoggedIn, function(req, res){
        //req.params is what is in the url, and req.body is what is in the form
        req.user.bookmarks.push(req.params.id);
        req.user.save(function(err) {
            if (err) console.log(err);
            else res.send('good');
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

    app.post('/follow', app.common.isLoggedIn, function(req,res){
         console.log(req.body.id);
         console.log(req.user.following);
         if(req.user.following.indexOf(req.body.id) == -1) {
            req.user.following.push(req.body.id);
            req.user.save(function(err){
                if(err) console.log(err);
                else {
                    User.findById(req.body.id)
                        .exec(function(err,user){
                            if(err) console.log(err);
                            else {
                                user.followers.push(req.user._id);
                                user.save(function(err){
                                    if(err) console.log(err);
                                    else res.redirect('/profile');
                                });
                            }
                        });
                }
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
