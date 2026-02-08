const mongoose = require('mongoose');

const TestimonialSchema = new mongoose.Schema({
    name: { type: String, required: true },
    position: String,
    company: String,
    text: { type: String, required: true },
    avatarUrl: String
});

module.exports = mongoose.model('Testimonial', TestimonialSchema);
