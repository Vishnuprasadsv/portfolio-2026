import React, { useState, useEffect } from 'react';
import { Download, ArrowUpRight, Linkedin, Github, X, Instagram } from 'lucide-react';
import axios from 'axios';

const Footer = () => {
    const [socials, setSocials] = useState({});
    const [cvUrl, setCvUrl] = useState(null);

    useEffect(() => {
        const fetchSocials = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/public/all`);
                const socialMap = {};
                if (res.data.socials) {
                    res.data.socials.forEach(s => {
                        socialMap[s.platform.toLowerCase()] = s.url;
                    });
                }
                setSocials(socialMap);
                if (res.data.cv) {
                    setCvUrl(res.data.cv.url);
                }
            } catch (err) {
                console.error("Failed to fetch socials", err);
            }
        };
        fetchSocials();
    }, []);

    const getAbsoluteUrl = (url) => {
        if (!url || url === '#') return '#';
        if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('mailto:')) return url;
        return `https://${url}`;
    };

    const handleDownloadCV = () => {
        if (cvUrl) {
            window.open(cvUrl, '_blank');
        } else {
            alert("CV not available yet.");
        }
    };

    return (
        <footer className="pt-24 pb-12 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/5">
            <div className="flex flex-col md:flex-row justify-between md:items-start gap-12 md:gap-20 mb-20">

                {/* Brand Column */}
                <div className="md:w-1/3">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">
                            V
                        </div>
                        <span className="font-display font-bold text-xl tracking-tight">VISHNU.PRASAD</span>
                    </div>
                    <p className="text-text-secondary text-sm leading-relaxed mb-4 max-w-xs">
                        Passionate about building and scaling digital experiences with purpose.
                        <br />
                        <strong className="text-primary">Let's grow together.</strong>
                    </p>
                    <button
                        onClick={handleDownloadCV}
                        className="px-2.5 py-1.5 bg-gray-800 hover:bg-gray-700 text-[14px] text-white rounded-full font-bold flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95 "
                    >
                        Download CV
                        <Download size={18} />
                    </button>
                </div>

                {/* Links Column - Aligning to bottom right visually in deskop but logically here */}
                {/* Links Column - Removed Socials list as per request to move to bottom icons */}
                <div className="flex gap-16">
                    {/* Can keep other links here if any, for now empty or remove if strictly replacing */}
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5">
                <p className="text-xs text-text-secondary">© 2026 Vishnu.Prasad. All rights reserved.</p>

                {/* Social Icons */}
                <div className="flex gap-6 my-4 md:my-0">
                    <a href={getAbsoluteUrl(socials['linkedin'])} target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-primary transition-colors">
                        <Linkedin size={20} />
                    </a>
                    <a href={getAbsoluteUrl(socials['github'])} target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-primary transition-colors">
                        <Github size={20} />
                    </a>
                    <a href={getAbsoluteUrl(socials['x'] || socials['twitter'])} target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-primary transition-colors">
                        <X size={20} />
                    </a>
                    <a href={getAbsoluteUrl(socials['instagram'])} target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-primary transition-colors">
                        <Instagram size={20} />
                    </a>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
