import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink } from 'lucide-react';

const ProjectDetail = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                // Fetch all and filter, or fetch specific if endpoint existed.
                // Using /all for consistency with current backend pattern, but specific endpoint is better for scale.
                // Assuming backend doesn't have public get-by-id yet for projects specifically, 
                // but usually public/all returns everything. 
                // Wait, I didn't verify if public/all was efficient for detail view, but for now it works.
                // actually I can filter from the public/all response.
                const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/public/all`);
                const found = res.data.projects?.find(p => p._id === id);
                setProject(found);
            } catch (err) {
                console.error("Failed to fetch project", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [id]);

    if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-white">Loading...</div>;
    if (!project) return <div className="min-h-screen bg-background flex items-center justify-center text-white">Project not found</div>;

    return (
        <div className="min-h-screen bg-background text-white">
            <div className="relative h-[50vh] md:h-[60vh] w-full">
                <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent" />

                <div className="absolute top-0 left-0 w-full p-6 md:p-8 z-10">
                    <div className="max-w-7xl mx-auto">
                        <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-all bg-black/30 hover:bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                            <ArrowLeft size={18} /> Back to Projects
                        </Link>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 pb-12">
                    <div className="max-w-7xl mx-auto">

                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-block px-3 py-1 mb-4 text-sm font-bold tracking-wider text-[#ff4d00] border border-[#ff4d00] rounded-full uppercase bg-[#ff4d00]/10 backdrop-blur-md"
                        >
                            {project.type}
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="font-display text-5xl md:text-7xl font-black uppercase leading-none mb-6"
                        >
                            {project.title}
                        </motion.h1>
                    </div>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-6 py-12 md:py-20">
                <div className="prose prose-invert prose-lg max-w-none">
                    <h3 className="text-2xl font-bold text-white mb-6">Overview</h3>
                    <p className="text-text-secondary leading-relaxed bg-surface/30 p-8 rounded-2xl border border-white/5">
                        {project.overview || project.description}
                    </p>

                    {project.link && (
                        <div className="mt-12">
                            <a
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center px-8 py-4 bg-[#ff4d00] hover:bg-[#ff6a00] text-black font-bold rounded-full transition-all transform hover:scale-105 group"
                            >
                                Open Project <ExternalLink size={20} className="ml-2 group-hover:bg-transparent" />
                            </a>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ProjectDetail;
