var mongoose = require('mongoose');

var tagSchema = new mongoose.Schema({
    tagName: { type: String, required: true, unique: true },
    images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image'}]
});

var Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;
