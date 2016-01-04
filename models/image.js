var mongoose = require('mongoose');

var imageSchema = new mongoose.Schema({
    url: {type: String, required: true},
    upvoteCount: {type: Number, default:0},
    downvoteCount: {type: Number, default:0},
    uploadedOn: {type: Date, default: Date.now()},
    description: {type: String, default: ''},
    uploadedBy: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref:'Tag'}],
    upvoteUsers: [{ type: mongoose.Schema.Types.ObjectId, ref:'User'}],
    downvoteUsers: [{ type: mongoose.Schema.Types.ObjectId, ref:'User'}]
});

var Image = mongoose.model('Image', imageSchema);
module.exports = Image;
