import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const CaseStudyCard = ({ study, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="group bg-surface border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 transition-all"
    >
        <div className="aspect-video bg-black/50 overflow-hidden relative">
            <img
                src={study.imageUrl}
                alt={study.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
        </div>
        <div className="p-8 flex flex-col flex-grow">
            <div className="flex flex-wrap gap-2 mb-4">
                {study.methods && study.methods.map((method, i) => (
                    <span key={i} className="px-3 py-1 rounded-full border border-[#ff4d00] text-[#ff4d00] text-xs font-bold uppercase tracking-wider">
                        {method}
                    </span>
                ))}
            </div>
            <h2 className="text-3xl font-black font-display mb-4 uppercase leading-none">{study.title}</h2>
            <p className="text-text-secondary leading-relaxed mb-8 line-clamp-3">{study.description}</p>
            <div className="mt-auto">
                <Link
                    to={`/case-studies/${study._id}`}
                    className="inline-flex items-center justify-center px-6 py-3 bg-[#ff4d00] hover:bg-[#ff6a00] text-black rounded-full font-bold transition-all transform hover:scale-105"
                >
                    Read Case Study <ArrowRight size={18} className="ml-2" />
                </Link>
            </div>
        </div>
    </motion.div>
);

const CaseStudies = () => {
    const [caseStudies, setCaseStudies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCaseStudies = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/public/all`);
                setCaseStudies(res.data.caseStudies || []);
            } catch (err) {
                console.error("Error fetching case studies:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCaseStudies();
    }, []);

    return (
        <div className="min-h-screen bg-background text-white p-6 md:p-12">
            <header className="max-w-7xl mx-auto mb-16 pt-10">
                <Link to="/" className="inline-flex items-center gap-2 text-text-secondary hover:text-white transition-colors mb-8 group">
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Portfolio
                </Link>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-display text-5xl md:text-7xl font-black uppercase leading-none"
                >
                    CASE <span className="text-[#ff4d00]">STUDIES</span>
                </motion.h1>
                <div className="h-20 w-1 bg-[#ff4d00] absolute left-0 top-0 hidden md:block" /> {/* Decorative line attempt, might need better placement */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-text-secondary mt-6 max-w-2xl text-lg pl-4 border-l-2 border-[#ff4d00]"
                >
                    Deep dives into my design and development process, from identifying user pain points to shipping scalable, high-performance solutions.
                </motion.p>
            </header>

            <main className="max-w-7xl mx-auto">
                {loading ? (
                    <p className="text-text-secondary">Loading items...</p>
                ) : caseStudies.length > 0 ? (
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Left Column (Even Indexes) */}
                        <div className="flex flex-col gap-12 w-full md:w-1/2">
                            {caseStudies.filter((_, i) => i % 2 === 0).map((study, index) => (
                                <CaseStudyCard key={study._id} study={study} index={index} />
                            ))}
                        </div>

                        {/* Right Column (Odd Indexes) - Offset */}
                        <div className="flex flex-col gap-12 w-full md:w-1/2 md:mt-24">
                            {caseStudies.filter((_, i) => i % 2 !== 0).map((study, index) => (
                                <CaseStudyCard key={study._id} study={study} index={index} />
                            ))}
                        </div>
                    </div>
                ) : (
                    <p className="text-text-secondary italic text-center py-20">No data found. Check back later!</p>
                )}
            </main>
        </div>
    );
};

export default CaseStudies;
