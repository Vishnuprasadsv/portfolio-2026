import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import axios from 'axios';

const TestimonialCard = ({ quote, author, role, company }) => {
    return (
        <div className="p-8 rounded-3xl bg-[#0f0f0f] border border-white/5 relative group hover:border-white/10 transition-colors">
            <div className="absolute top-8 right-8 text-white/5 group-hover:text-primary/20 transition-colors">
                <Quote size={40} />
            </div>

            <p className="text-lg text-text-secondary leading-relaxed mb-8 relative z-10 italic break-words whitespace-pre-wrap">
                "{quote}"
            </p>

            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white uppercase">
                    {author.charAt(0)}
                </div>
                <div>
                    <h4 className="text-sm font-bold text-white">{author}</h4>
                    {(role || company) && (
                        <p className="text-xs font-bold text-primary">
                            {role}{role && company ? ', ' : ''}<span className="text-text-secondary">{company}</span>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

const Testimonials = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/public/all`);
                setTestimonials(res.data.testimonials || []);
            } catch (err) {
                console.error("Failed to fetch testimonials", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTestimonials();
    }, []);

    if (!loading && testimonials.length === 0) return null;

    return (
        <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-display text-4xl md:text-5xl font-black uppercase mb-16 text-center"
            >
                Client <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/50">Intel</span>
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {testimonials.map((t) => (
                    <TestimonialCard
                        key={t._id}
                        quote={t.text}
                        author={t.name}
                        role={t.position}
                        company={t.company}
                    />
                ))}
            </div>
        </section>
    );
};

export default Testimonials;
