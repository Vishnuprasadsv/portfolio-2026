const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    name: { type: String, required: true },
    titles: [String], // Array of titles e.g. ["Full Stack Dev", "Designer"]
    bio: String,
    logoUrl: String,
    cvUrl: String,
    email: String,
    availableForHire: { type: Boolean, default: true },
    profilePhotoUrl: String,
}, { timestamps: true });

// We only need one profile, so we can enforce that logic in controller
module.exports = mongoose.model('Profile', ProfileSchema);
