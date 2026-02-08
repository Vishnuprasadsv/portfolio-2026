import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const TechTicker = () => {
    const [techs, setTechs] = useState([]);

    useEffect(() => {
        const fetchTechs = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/public/all`);
                if (res.data.techs && res.data.techs.length > 0) {
                    setTechs(res.data.techs.map(t => t.name.toUpperCase()));
                } else {
                    // Fallback if no techs found to avoid empty ticker
                    setTechs(["HTML", "CSS", "JAVASCRIPT", "NODE.JS", "BACKEND", "EXPRESS.JS", "TAILWIND CSS", "BOOTSTRAP"]);
                }
            } catch (err) {
                console.error("Failed to fetch techs", err);
                // Fallback on error
                setTechs(["HTML", "CSS", "JAVASCRIPT", "NODE.JS", "BACKEND", "EXPRESS.JS", "TAILWIND CSS", "BOOTSTRAP"]);
            }
        };
        fetchTechs();
    }, []);

    if (techs.length === 0) return null; // Or loading state

    return (
        <section className="py-8 border-y border-white/5 bg-surface/30 overflow-hidden relative">
            {/* Top Border Animation (Left to Right) */}
            <div className="absolute top-0 left-0 w-full h-[1px] z-10 overflow-hidden">
                <motion.div
                    className="h-full bg-gradient-to-r from-transparent via-primary to-transparent"
                    style={{ width: "50%", opacity: 0.8 }}
                    initial={{ x: "-100%" }}
                    animate={{ x: "200%" }} // Move completely across
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                        repeatDelay: 0 // Continuous flow or add a small delay if user wants "gap"
                    }}
                />
            </div>

            {/* Bottom Border Animation (Right to Left) */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] z-10 overflow-hidden">
                <motion.div
                    className="h-full bg-gradient-to-l from-transparent via-primary to-transparent"
                    style={{ width: "50%", opacity: 0.8, position: "absolute", right: 0 }}
                    initial={{ x: "100%" }}
                    animate={{ x: "-200%" }} // Move completely across reverse
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                        repeatDelay: 0
                    }}
                />
            </div>

            <div className="flex w-fit">
                {/* First set of items */}
                <motion.div
                    initial={{ x: 0 }}
                    animate={{ x: "-100%" }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="flex items-center gap-12 md:gap-20 pr-12 md:pr-20 opacity-60 whitespace-nowrap"
                >
                    {techs.map((tech, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                            <span className="text-sm font-bold tracking-widest text-text-secondary">{tech}</span>
                        </div>
                    ))}
                </motion.div>

                {/* Second set of items for seamless loop */}
                <motion.div
                    initial={{ x: 0 }}
                    animate={{ x: "-100%" }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="flex items-center gap-12 md:gap-20 pr-12 md:pr-20 opacity-60 whitespace-nowrap"
                >
                    {techs.map((tech, index) => (
                        <div key={`dup-${index}`} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                            <span className="text-sm font-bold tracking-widest text-text-secondary">{tech}</span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default TechTicker;
