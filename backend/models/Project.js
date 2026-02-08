const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, required: true },
    description: String,
    overview: String, // Full description for detail page
    link: String,
    imageUrl: String,
    imagePublicId: String,
    featured: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);
