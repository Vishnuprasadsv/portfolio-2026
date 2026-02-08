const mongoose = require('mongoose');
const Tech = require('./models/Tech');
require('dotenv').config();

const skillsToMigrate = [
    "HTML", "CSS", "JAVASCRIPT", "NODE.JS", "BACKEND", "EXPRESS.JS", "TAILWIND CSS", "BOOTSTRAP"
];

const migrate = async () => {
    try {
        console.log("Connecting to Mongo...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        for (const skillName of skillsToMigrate) {
            const exists = await Tech.findOne({ name: skillName });
            if (!exists) {
                await Tech.create({ name: skillName, inTicker: true });
                console.log(`Added: ${skillName}`);
            } else {
                console.log(`Skipped (already exists): ${skillName}`);
            }
        }

        console.log('Migration Complete');
        process.exit(0);
    } catch (err) {
        console.error('Migration Failed:', err);
        process.exit(1);
    }
};

migrate();
