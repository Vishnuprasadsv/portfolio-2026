import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SocialLinks from './SocialLinks';

const Hero = () => {
    const [profile, setProfile] = useState(null);
    const [cvUrl, setCvUrl] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Fetch all data including CV
                const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/public/all`);
                setProfile(res.data.profile);
                if (res.data.cv) {
                    setCvUrl(res.data.cv.url);
                }
            } catch (err) {
                console.error("Error fetching profile:", err);
            }
        };
        fetchProfile();
    }, []);

    const handleDownloadCV = () => {
        if (cvUrl) {
            window.open(cvUrl, '_blank');
        } else {
            alert("CV not available yet.");
        }
    };

    return (
        <section className="min-h-screen pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between gap-12 md:gap-20">

            {/* Left Column: Image */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="w-full md:w-5/12 relative aspect-[4/5] rounded-3xl overflow-hidden bg-surface border border-white/5 group"
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                <img
                    src={profile?.profilePhotoUrl || "/src/assets/profile_photo.jpg"}
                    alt="Profile"
                    className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute bottom-6 left-6 z-20">
                    <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10 inline-flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs font-medium text-white">Open for Commissions</span>
                    </div>
                </div>
            </motion.div>

            {/* Right Column: Content */}
            <motion.div className="w-full md:w-7/12 flex flex-col items-start pt-4">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full mb-6"
                >
                    <span className="text-xs font-bold text-primary tracking-wider uppercase">Available for Internship</span>
                    <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse relative">
                        <div className="absolute inset-0 bg-orange-500 rounded-full animate-ping opacity-75"></div>
                    </div>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="font-display text-5xl md:text-7xl font-black leading-[0.9] tracking-tight mb-8"
                >
                    DIGITAL <br />
                    <span className="text-primary">PARTNER.</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-text-secondary text-lg leading-relaxed max-w-xl mb-10"
                >
                    I specialize in collaborative problem-solving, turning complex business challenges into seamless digital solutions through strategic development and shared vision.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-row items-center gap-3 md:gap-5 mb-12"
                >
                    <button
                        onClick={handleDownloadCV}
                        className="px-4 py-3 md:px-8 md:py-4 bg-primary hover:bg-primary-hover text-white text-xs md:text-base rounded-full font-bold flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,85,0,0.3)] whitespace-nowrap"
                    >
                        Download CV
                        <Download size={16} className="md:w-[18px] md:h-[18px]" />
                    </button>

                    <button
                        onClick={() => navigate('/case-studies')}
                        className="px-4 py-3 md:px-8 md:py-4 bg-transparent border border-white/10 hover:border-white/30 text-white text-xs md:text-base rounded-full font-medium flex items-center gap-2 transition-all hover:bg-white/5 neon-border-pulse whitespace-nowrap"
                    >
                        View Case Studies
                        <ArrowRight size={16} className="md:w-[18px] md:h-[18px]" />
                    </button>
                </motion.div>

                <SocialLinks />

            </motion.div>
        </section>
    );
};

export default Hero;
