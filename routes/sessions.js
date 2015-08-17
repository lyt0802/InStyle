var User = require('../models/user');

module.exports = function(app){
    app.get('/profile', app.common.isLoggedIn, function(req,res){
        //console.log(req.user);
        User.findById(req.user._id)
            .select('email firstName lastName followers following images bookmarks profilePicture')
            .populate('images profilePicture')
            .exec(function(err, user) {
                res.render('profile.jade', { user: user}); 
        });
    });
    
    app.get('/profile/:id', app.common.isLoggedIn, function(req,res){
        User.findById(req.params.id)
            .select('email firstName lastName followers following images bookmarks profilePicture')
            .populate('images profilePicture')
            .exec(function(err,user){
                console.log(user);
                res.render('profile.jade', { user: user});
            });
    });
    /*app.get('/users/:id', app.common.isLoggedIn, function(req, res) {*/
        //User.findById(req.params.id)
            //.select('email')
            //.exec(function(err, user) {
                //res.render('user.jade', { user: user });
            //});
    //});


    app.get('/followers', app.common.isLoggedIn, function(req,res){
        User.findById(req.user._id)
            .select('followers email')
            .populate('followers', 'email firstName lastName profilePicture')
            .exec(function(err,user){
                User.populate(user, {
                    path: 'followers.profilePicture',
                    model: 'Image',
                    select: 'url'
                }, function(err, fullUser) {
                    res.render('followers.jade', {user: fullUser});
                });
            });
    });
    app.get('/following', app.common.isLoggedIn, function(req,res){
        User.findById(req.user._id)
            .select('following email')
            .populate('following', 'email firstName lastName profilePicture')
            .exec(function(err,user){
                User.populate(user, {
                    path: 'following.profilePicture', 
                    model: 'Image', 
                    select: 'url'
                }, function(err, fullUser) {
                    res.render('following.jade', {user: user});
                });
            });
    });
    app.post('/login', app.passport.authenticate("local-login", {
        successRedirect: '/feed',
        failureRedirect: '/'
    }));

    app.post('/signup', app.passport.authenticate("local-signup", {
        successRedirect: '/profile',
        failureRedirect: '/'
    }));

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

};
