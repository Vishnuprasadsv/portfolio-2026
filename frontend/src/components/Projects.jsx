import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProjectCard = ({ project, index }) => {
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative h-[400px] w-full cursor-pointer overflow-hidden rounded-3xl bg-surface"
            onClick={() => navigate(`/projects/${project._id}`)}
        >
            {/* Background Image */}
            <div className="absolute inset-0">
                <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-500" />
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-8">
                <div className="transform transition-transform duration-500 group-hover:-translate-y-4">
                    {/* Tags/Type */}
                    <div className="flex items-center gap-2 mb-4">
                        <span className="inline-flex items-center rounded-full border border-[#ff4d00]/30 bg-[#ff4d00]/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#ff4d00] backdrop-blur-sm">
                            <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-[#ff4d00]" />
                            {project.type}
                        </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-display text-3xl font-black uppercase text-white mb-2">
                        {project.title}
                    </h3>
                </div>

                {/* Hover Action (Arrow) */}
                <div className="absolute bottom-8 right-8 translate-y-12 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ff4d00] text-black shadow-lg">
                        <ArrowRight size={20} className="transform transition-transform duration-300 group-hover:-rotate-45" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/public/all`);
                setProjects(res.data.projects || []);
            } catch (err) {
                console.error("Failed to fetch projects", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    if (!loading && projects.length === 0) return null;

    return (
        <section className="py-24 bg-background relative overflow-hidden" id="projects">
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6"
                >
                    <div>
                        <h2 className="font-display text-5xl md:text-7xl font-black uppercase leading-none text-white">
                            Selected <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/50">Projects</span>
                        </h2>
                    </div>

                    <p className="text-text-secondary max-w-sm text-right hidden md:block">
                        A showcase of my recent production-ready applications and experiments.
                    </p>
                </motion.div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Left Column (Even Indexes) */}
                    <div className="flex flex-col gap-12 w-full md:w-1/2">
                        {projects.filter((_, i) => i % 2 === 0).map((project, index) => (
                            <ProjectCard key={project._id} project={project} index={index} />
                        ))}
                    </div>

                    {/* Right Column (Odd Indexes) - Offset */}
                    <div className="flex flex-col gap-12 w-full md:w-1/2 md:mt-24">
                        {projects.filter((_, i) => i % 2 !== 0).map((project, index) => (
                            <ProjectCard key={project._id} project={project} index={index} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Projects;
