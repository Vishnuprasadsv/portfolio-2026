import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, LayoutGrid, ShoppingBag, Share2, Smartphone } from 'lucide-react';

const ProjectCard = ({ category, title, icon: Icon, color }) => {
    return (
        <motion.div
            whileHover={{ y: -10 }}
            className="group relative p-8 h-[400px] rounded-3xl bg-[#0f0f0f] border border-white/5 overflow-hidden flex flex-col justify-end"
        >
            {/* Background Gradient/Image Placeholder */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Icon Placeholder in Center */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/5 group-hover:text-white/10 transition-colors duration-500">
                <Icon size={120} strokeWidth={1} />
            </div>

            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                    <div className={`w-1.5 h-1.5 rounded-full ${color}`} />
                    <span className={`text-xs font-bold uppercase tracking-wider ${color.replace('bg-', 'text-')}`}>{category}</span>
                </div>
                <h3 className="text-3xl font-display font-bold text-white mb-2">{title}</h3>
            </div>

            {/* Hover Arrow */}
            <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                <div className="p-3 rounded-full border border-white/10 bg-white/5 text-white">
                    <ArrowRight size={20} />
                </div>
            </div>
        </motion.div>
    );
};

const SelectedWorks = () => {
    return (
        <section id="work" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="font-display text-5xl md:text-6xl font-black uppercase"
                >
                    Selected <span className="text-primary">Works</span>
                </motion.h2>

                <a href="#" className="flex items-center gap-2 text-sm font-bold text-text-secondary hover:text-white transition-colors group">
                    View All Projects
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </a>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProjectCard
                    category="Fintech"
                    title="Nova Analytics"
                    icon={LayoutGrid}
                    color="bg-orange-500"
                />
                <ProjectCard
                    category="E-Commerce"
                    title="Luxe Market"
                    icon={ShoppingBag}
                    color="bg-orange-500" // Using orange for all as per design consistency, or vary if needed
                />
                <ProjectCard
                    category="SaaS Platform"
                    title="Flow Manage"
                    icon={Share2}
                    color="bg-orange-500"
                />
                <ProjectCard
                    category="Mobile App"
                    title="Health Sync"
                    icon={Smartphone}
                    color="bg-orange-500"
                />
            </div>
        </section>
    );
};

export default SelectedWorks;
