var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = new mongoose.Schema({
    active: { type: Boolean, default: false },
    email: { type: String, required:true , unique:true },
    firstName: {type: String, required: true},
    lastName: {type:String, required: true},
    password: { type: String , required:true},
    images: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Image' } ],
    followers: [ { type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [ { type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    bookmarks: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Image' } ],
    profilePicture: { type: mongoose.Schema.Types.ObjectId, ref: 'Image'},
    upvotedImages: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Image'} ],
    downvotedImages: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Image'} ],
});

userSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);   
};

var User = mongoose.model('User', userSchema);

module.exports = User;
