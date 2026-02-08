const mongoose = require('mongoose');

const SocialSchema = new mongoose.Schema({
    platform: { type: String, required: true }, // e.g. "GitHub", "LinkedIn"
    url: { type: String, required: true },
    icon: String, // could be a class name or url
    enabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('Social', SocialSchema);
