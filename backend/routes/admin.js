const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Profile = require('../models/Profile');
const Social = require('../models/Social');
const Tech = require('../models/Tech');
const Project = require('../models/Project');
const Certificate = require('../models/Certificate');
const Testimonial = require('../models/Testimonial');
const CV = require('../models/CV');
const CaseStudy = require('../models/CaseStudy');
const Experience = require('../models/Experience');

// Apply auth middleware to all routes in this router
router.use(authMiddleware);

// --- Profile ---
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer Storage (Cloudinary)
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'portfolio_uploads',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'heic', 'pdf'],
        resource_type: 'auto',
    },
});

const upload = multer({ storage });

router.post('/upload-profile-image', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const imageUrl = req.file.path;

        // Update profile with new image URL
        const profile = await Profile.findOneAndUpdate(
            {},
            { profilePhotoUrl: imageUrl },
            { new: true, upsert: true }
        );

        res.json({ imageUrl, profile });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/profile', async (req, res) => {
    try {
        // Upsert profile
        const profile = await Profile.findOneAndUpdate({}, req.body, { new: true, upsert: true });
        res.json(profile);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Socials ---
router.post('/socials/upsert', async (req, res) => {
    try {
        const { platform, url } = req.body;
        // Upsert based on platform name
        const social = await Social.findOneAndUpdate(
            { platform },
            { platform, url, enabled: !!url }, // Disable if url is empty, or handle via explicit field if preferred
            { new: true, upsert: true }
        );
        res.json(social);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/socials/:id', async (req, res) => {
    try {
        const social = await Social.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(social);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/socials/:id', async (req, res) => {
    try {
        await Social.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Techs ---
router.post('/techs', async (req, res) => {
    try {
        const tech = new Tech(req.body);
        await tech.save();
        res.json(tech);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/techs/:id', async (req, res) => {
    try {
        const tech = await Tech.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(tech);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/techs/:id', async (req, res) => {
    try {
        await Tech.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Projects ---
router.post('/projects', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image uploaded for project' });
        }

        const { title, type, description, link, overview, featured } = req.body;

        const project = new Project({
            title,
            type,
            description,
            overview,
            link,
            featured: featured === 'true',
            imageUrl: req.file.path,
            imagePublicId: req.file.filename
        });

        await project.save();
        res.json(project);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/projects/:id', upload.single('image'), async (req, res) => {
    try {
        const { title, type, description, link, overview, featured } = req.body;
        const updateData = {
            title,
            type,
            description,
            overview,
            link,
            featured: featured === 'true'
        };

        if (req.file) {
            updateData.imageUrl = req.file.path;
            updateData.imagePublicId = req.file.filename;

            // Delete old image
            const oldProject = await Project.findById(req.params.id);
            if (oldProject && oldProject.imagePublicId) {
                await cloudinary.uploader.destroy(oldProject.imagePublicId);
            }
        }

        const project = await Project.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json(project);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/projects/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (project && project.imagePublicId) {
            await cloudinary.uploader.destroy(project.imagePublicId);
        }
        await Project.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Certificates ---
router.post('/certificates', async (req, res) => {
    try {
        const cert = new Certificate(req.body);
        await cert.save();
        res.json(cert);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/certificates/:id', async (req, res) => {
    try {
        const cert = await Certificate.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(cert);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/certificates/:id', async (req, res) => {
    try {
        await Certificate.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Testimonials ---
router.post('/testimonials', async (req, res) => {
    try {
        const { text } = req.body;
        if (text && text.trim().split(/\s+/).length > 30) {
            return res.status(400).json({ error: 'Quote exceeds 30 words limit' });
        }
        const testimonial = new Testimonial(req.body);
        await testimonial.save();
        res.json(testimonial);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/testimonials/:id', async (req, res) => {
    try {
        const { text } = req.body;
        if (text && text.trim().split(/\s+/).length > 30) {
            return res.status(400).json({ error: 'Quote exceeds 30 words limit' });
        }
        const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(testimonial);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/testimonials/:id', async (req, res) => {
    try {
        await Testimonial.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- CV ---
router.post('/cv', upload.single('cv'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No CV file uploaded' });
        }

        console.log("Uploaded File Details:", req.file);

        const cvUrl = req.file.path;
        const public_id = req.file.filename;

        // Upsert CV (we only keep one latest CV usually, similar to profile logic)
        // If we want to replace the old one on cloudinary, we'd need to fetch and destroy it first.
        // For simplicity, we just overwrite the DB entry. 
        // Ideally: Fetch old CV -> Cloudinary delete -> Save new.

        const oldCV = await CV.findOne();
        if (oldCV && oldCV.public_id) {
            await cloudinary.uploader.destroy(oldCV.public_id);
        }

        const cv = await CV.findOneAndUpdate(
            {},
            { url: cvUrl, public_id },
            { new: true, upsert: true }
        );

        res.json(cv);
    } catch (err) {
        console.error("CV Upload Error:", err);
        res.status(500).json({ error: err.message });
    }
});

router.get('/cv', async (req, res) => {
    try {
        const cv = await CV.findOne();
        res.json(cv);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Case Studies ---
router.post('/casestudies', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image uploaded for case study' });
        }

        const { title, description, link, methods, overview } = req.body;

        const caseStudy = new CaseStudy({
            title,
            description,
            overview,
            link,
            methods: methods ? methods.split(',').map(m => m.trim()) : [],
            imageUrl: req.file.path,
            imagePublicId: req.file.filename
        });

        await caseStudy.save();
        res.json(caseStudy);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/casestudies/:id', upload.single('image'), async (req, res) => {
    try {
        const { title, description, link, methods, overview } = req.body;
        const updateData = {
            title,
            description,
            overview,
            link,
            methods: methods ? methods.split(',').map(m => m.trim()) : []
        };

        if (req.file) {
            updateData.imageUrl = req.file.path;
            updateData.imagePublicId = req.file.filename;

            // Delete old image
            const oldCaseStudy = await CaseStudy.findById(req.params.id);
            if (oldCaseStudy && oldCaseStudy.imagePublicId) {
                await cloudinary.uploader.destroy(oldCaseStudy.imagePublicId);
            }
        }

        const caseStudy = await CaseStudy.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );
        res.json(caseStudy);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/casestudies/:id', async (req, res) => {
    try {
        const caseStudy = await CaseStudy.findById(req.params.id);
        if (caseStudy && caseStudy.imagePublicId) {
            await cloudinary.uploader.destroy(caseStudy.imagePublicId);
        }
        await CaseStudy.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Experience / Certifications ---
router.get('/experience', async (req, res) => {
    try {
        const experiences = await Experience.find().sort({ createdAt: -1 });
        res.json(experiences);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/experience', async (req, res) => {
    try {
        const { title, company, description, startDate, endDate } = req.body;
        const experience = new Experience({ title, company, description, startDate, endDate });
        await experience.save();
        res.json(experience);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/experience/:id', async (req, res) => {
    try {
        const { title, company, description, startDate, endDate } = req.body;
        const experience = await Experience.findByIdAndUpdate(
            req.params.id,
            { title, company, description, startDate, endDate },
            { new: true }
        );
        res.json(experience);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/experience/:id', async (req, res) => {
    try {
        await Experience.findByIdAndDelete(req.params.id);
        res.json({ message: 'Experience deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
