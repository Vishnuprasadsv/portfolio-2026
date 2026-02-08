const mongoose = require('mongoose');

const ExperienceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true }, // Can be "Present"
}, { timestamps: true });

module.exports = mongoose.model('Experience', ExperienceSchema);
