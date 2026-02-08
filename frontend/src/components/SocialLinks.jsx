import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Code, Briefcase, AtSign } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

const SocialItem = ({ icon: Icon, label, subLabel, href, delay }) => {
    // Ensure absolute URL if not empty placeholder
    const getAbsoluteUrl = (url) => {
        if (!url || url === '#') return '#';
        if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('mailto:')) return url;
        return `https://${url}`;
    };

    const finalHref = getAbsoluteUrl(href);
    const isClickable = finalHref !== '#';

    return (
        <motion.a
            href={finalHref}
            target={isClickable ? "_blank" : undefined}
            rel={isClickable ? "noopener noreferrer" : undefined}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay, duration: 0.5 }}
            whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.05)" }}
            className={`flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.02] group ${isClickable ? 'cursor-pointer' : 'cursor-default opacity-50'}`}
        >
            <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-white/5 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <Icon size={20} />
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-white">{label}</span>
                    <span className="text-xs text-text-secondary">{subLabel}</span>
                </div>
            </div>
            {isClickable && <ArrowUpRight size={18} className="text-text-secondary group-hover:text-primary transition-colors" />}
        </motion.a>
    );
};

const SocialLinks = () => {
    const [socials, setSocials] = useState({});

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
            } catch (err) {
                console.error("Failed to fetch socials", err);
            }
        };
        fetchSocials();
    }, []);

    const handleEmailClick = (e) => {
        e.preventDefault();
        const email = socials['email']; // Removed hardcoded fallback

        if (!email) {
            // Optional: Alert user or do nothing if no email is set
            console.warn("No email set in admin panel");
            return;
        }

        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        if (isMobile) {
            window.location.href = `mailto:${email}`;
        } else {
            window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${email}`, '_blank');
        }
    };

    return (
        <div className="flex flex-col gap-3 w-full mt-8">
            <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Connect Directly:</h3>

            <SocialItem
                icon={Code}
                label="GitHub"
                subLabel="View my repositories"
                href={socials['github'] || '#'}
                delay={0.6}
            />

            <SocialItem
                icon={Briefcase}
                label="LinkedIn"
                subLabel="Professional network"
                href={socials['linkedin'] || '#'}
                delay={0.7}
            />

            <motion.a
                href="#"
                onClick={handleEmailClick}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.02] group cursor-pointer"
            >
                <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-white/5 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                        <AtSign size={20} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-white">Email</span>
                        <span className="text-xs text-text-secondary">Let's discuss strategy</span>
                    </div>
                </div>
                <ArrowUpRight size={18} className="text-text-secondary group-hover:text-primary transition-colors" />
            </motion.a>
        </div>
    );
};

export default SocialLinks;
