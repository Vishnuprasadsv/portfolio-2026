const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const Social = require('../models/Social');
const Tech = require('../models/Tech');
const Project = require('../models/Project');
const Certificate = require('../models/Certificate');
const Testimonial = require('../models/Testimonial');
const CV = require('../models/CV');
const CaseStudy = require('../models/CaseStudy');
const Experience = require('../models/Experience');

// Get all portfolio data in one go
router.get('/profile', async (req, res) => {
    try {
        const profile = await Profile.findOne();
        res.json(profile || {});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all portfolio data in one go (or separate if preferred, but one is faster for initial load)
router.get('/all', async (req, res) => {
    try {
        const [profile, socials, techs, projects, certificates, testimonials, cv, caseStudies, experiences] = await Promise.all([
            Profile.findOne(),
            Social.find({ enabled: true }),
            Tech.find({ inTicker: true }),
            Project.find(),
            Certificate.find(),
            Testimonial.find(),
            CV.findOne(),
            CaseStudy.find(),
            Experience.find().sort({ createdAt: -1 })
        ]);

        res.json({
            profile: profile || {}, // Return empty obj if not found
            socials,
            techs,
            projects,
            certificates,
            testimonials,
            cv: cv || null,
            caseStudies,
            experiences

        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Contact Route
const nodemailer = require('nodemailer');

router.post('/contact', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Validation
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail', // or use host/port from env if not gmail
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Mail Options
        const mailOptions = {
            from: process.env.EMAIL_USER, // Sender address (your email)
            to: process.env.EMAIL_USER, // Receiver address (your email)
            replyTo: email, // Reply to the user's email
            subject: `Portfolio Contact: ${subject}`,
            text: `
                Name: ${name}
                Email: ${email}
                Subject: ${subject}
                Message: ${message}
            `
        };

        // Send Email
        await transporter.sendMail(mailOptions);

        res.json({ message: 'Message sent successfully' });
    } catch (err) {
        console.error("Email Error:", err);
        if (err.responseCode === 535 || err.responseCode === 534) {
            return res.status(500).json({ error: 'Authentication failed. If using Gmail, please use an App Password.' });
        }
        res.status(500).json({ error: 'Failed to send message. Please try again later.' });
    }
});

module.exports = router;
