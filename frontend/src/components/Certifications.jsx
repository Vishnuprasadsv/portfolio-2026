import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const TimelineItem = ({ date, title, org, description, isLast }) => {
    return (
        <div className="relative pl-12 pb-12 last:pb-0">
            {/* Line */}
            {!isLast && (
                <div className="absolute top-2 left-[5px] w-[2px] h-full bg-white/10 overflow-hidden">
                    <motion.div
                        className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-transparent via-primary to-transparent"
                        initial={{ y: "-100%" }}
                        animate={{ y: "300%" }} // Move well past the container to ensure smooth loop
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear",
                            repeatDelay: 0.5
                        }}
                    />
                </div>
            )}

            {/* Dot */}
            <div className="absolute top-2 left-0 w-3 h-3 rounded-full border-2 border-primary bg-background" />

            <div className="flex flex-col gap-2 min-w-0">
                <span className="text-xs font-bold text-primary tracking-widest uppercase">{date}</span>
                <h3 className="text-xl font-bold text-white break-words">{title}</h3>
                <p className="text-sm font-medium text-white/60 mb-2">{org}</p>
                <p className="text-sm text-text-secondary leading-relaxed max-w-full break-words">
                    {description}
                </p>
            </div>
        </div>
    );
};

const Certifications = () => {
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExperiences = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/public/all`);
                setExperiences(res.data.experiences || []);
            } catch (err) {
                console.error("Failed to fetch experiences", err);
            } finally {
                setLoading(false);
            }
        };
        fetchExperiences();
    }, []);

    if (!loading && experiences.length === 0) return null;

    return (
        <section id="experience" className="py-24 px-6 md:px-12 max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-32">

            {/* Width constrained header */}
            <div className="w-full lg:w-1/3">
                <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="font-display text-3xl md:text-4xl lg:text-5xl font-black uppercase sticky top-32 break-words"
                >
                    Certifications <br />
                    <span className="text-text-secondary">&</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/50">Work Experience</span>
                </motion.h2>
            </div>

            {/* Timeline */}
            <div className="w-full lg:w-2/3">
                {loading ? (
                    <p className="text-text-secondary">Loading experiences...</p>
                ) : (
                    experiences.map((exp, index) => (
                        <TimelineItem
                            key={exp._id}
                            date={`${exp.startDate} - ${exp.endDate}`}
                            title={exp.title}
                            org={exp.company}
                            description={exp.description}
                            isLast={index === experiences.length - 1}
                        />
                    ))
                )}
            </div>
        </section>
    );
};

export default Certifications;
