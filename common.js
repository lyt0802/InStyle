module.exports = function(app){
    app.common =  {
        isLoggedIn: function(req, res, next) {
            if (req.isAuthenticated()) {
                next();
            } else {
                res.redirect('/');
            }
        },
        isNotLoggedIn: function(req, res, next) {
            if (!req.isAuthenticated()) {
               next();
            } else {
                res.redirect('/feed');
            }
        }
    };
};
