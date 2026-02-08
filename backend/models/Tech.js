const mongoose = require('mongoose');

const TechSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: String, // e.g. "Frontend", "Backend", "Tool"
    icon: String,
    inTicker: { type: Boolean, default: true }
});

module.exports = mongoose.model('Tech', TechSchema);
