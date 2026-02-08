const mongoose = require('mongoose');

const CertificateSchema = new mongoose.Schema({
    title: { type: String, required: true },
    issuer: String,
    date: Date,
    imageUrl: String,
    link: String,
    type: { type: String, default: 'Certificate' } // Certificate or Internship
});

module.exports = mongoose.model('Certificate', CertificateSchema);
