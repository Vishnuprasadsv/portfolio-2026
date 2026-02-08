const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// @route   POST api/auth/login
// @desc    Authenticate admin & get token
// @access  Public
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    const ADMIN_USERNAME = "vishnusvprasad";
    const ADMIN_PASSWORD = "Galaxy@161199";

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        // Create JWT payload
        const payload = {
            user: {
                id: 'admin_id',
                role: 'admin'
            }
        };

        // Sign token
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5d' }, // Token valid for 5 days
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } else {
        return res.status(400).json({ msg: 'Invalid Credentials' });
    }
});

module.exports = router;
