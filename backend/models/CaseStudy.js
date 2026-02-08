const mongoose = require('mongoose');

const CaseStudySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    overview: {
        type: String,
        default: ''
    },
    imageUrl: {
        type: String,
        required: true
    },
    imagePublicId: {
        type: String,
        required: true
    },
    link: {
        type: String,
        default: ''
    },
    methods: {
        type: [String],
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('CaseStudy', CaseStudySchema);
