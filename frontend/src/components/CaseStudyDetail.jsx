import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import axios from 'axios';

const CaseStudyDetail = () => {
    const { id } = useParams();
    const [study, setStudy] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudy = async () => {
            try {
                // Fetching all for now since we don't have a dedicated single public endpoint yet, 
                // or we can add one. Efficient enough for small portfolios.
                // Optimally: GET /api/public/casestudies/:id
                const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/public/all`);
                const foundStudy = res.data.caseStudies.find(cs => cs._id === id);
                setStudy(foundStudy);
            } catch (err) {
                console.error("Error fetching case study:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStudy();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background text-white flex items-center justify-center">
                <p>Loading case study...</p>
            </div>
        );
    }

    if (!study) {
        return (
            <div className="min-h-screen bg-background text-white flex flex-col items-center justify-center gap-4">
                <p>Case Study not found.</p>
                <Link to="/case-studies" className="text-primary hover:underline">Back to Case Studies</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-white">
            {/* Hero Section */}
            <header className="relative h-[60vh] w-full mx-auto overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src={study.imageUrl}
                        alt={study.title}
                        className="w-full h-full object-cover filter brightness-50"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                </div>

                <div className="absolute top-0 left-0 w-full p-6 md:p-8 z-10">
                    <div className="max-w-7xl mx-auto">
                        <Link to="/case-studies" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-all bg-black/30 hover:bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                            <ArrowLeft size={18} /> Back to Case Studies
                        </Link>
                    </div>
                </div>

                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 max-w-7xl mx-auto">


                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="flex flex-wrap gap-3">
                            {study.methods && study.methods.map((method, i) => (
                                <span key={i} className="px-4 py-1.5 rounded-full bg-[#ff4d00]/10 border border-[#ff4d00] text-[#ff4d00] text-sm font-bold uppercase tracking-wider backdrop-blur-md">
                                    {method}
                                </span>
                            ))}
                        </div>
                        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-black uppercase leading-none max-w-4xl">
                            {study.title}
                        </h1>
                    </motion.div>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-4xl mx-auto p-6 md:p-12 pb-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="prose prose-invert prose-lg max-w-none"
                >
                    <div className="text-xl md:text-2xl text-text-secondary leading-relaxed font-light mb-12 border-l-4 border-[#ff4d00] pl-6">
                        {study.description}
                    </div>

                    <div className="bg-surface/30 border border-white/5 rounded-2xl p-8 mb-12">
                        <h3 className="text-xl font-bold mb-4 text-white">Project Overview</h3>
                        <p className="text-text-secondary whitespace-pre-wrap leading-relaxed">
                            {study.overview || "No detailed overview available for this case study yet."}
                        </p>
                    </div>

                    {study.link && (
                        <div className="flex justify-center mt-12">
                            <a
                                href={study.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-[#ff4d00] hover:bg-[#ff6a00] text-black rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(255,77,0,0.3)]"
                            >
                                Visit Live Project <ExternalLink size={20} />
                            </a>
                        </div>
                    )}
                </motion.div>
            </main>
        </div>
    );
};

export default CaseStudyDetail;
