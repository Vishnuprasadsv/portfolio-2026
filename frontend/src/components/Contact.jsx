import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Linkedin, Send, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState('idle'); // idle, sending, success, error

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');
        try {
            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/public/contact`, formData);
            setStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
            setTimeout(() => setStatus('idle'), 5000);
        } catch (err) {
            console.error("Contact form error:", err);
            // Use the specific error message from the backend if available
            const errorMessage = err.response?.data?.error || 'Failed to send message. Please try again.';
            setStatus(errorMessage);
            setTimeout(() => setStatus('idle'), 5000); // Note: You might want to increase this timeout for reading long errors
        }
    };

    return (
        <section className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center py-24">
            {/* Background Gradient/Glow */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

            {/* Back to Home Button */}
            <div className="absolute top-8 left-6 md:left-12 z-50">
                <Link to="/" className="flex items-center gap-2 text-text-secondary hover:text-white transition-colors group">
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Portfolio
                </Link>
            </div>

            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-start w-full relative z-10 pt-10">

                {/* Left Column: Text & Info */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col h-full justify-between"
                >
                    <div>
                        <h2 className="font-display text-6xl md:text-8xl font-black uppercase leading-[0.8] mb-8">
                            <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#ff4d00] to-[#ff4d00]/60 outline-text">GET IN</span><br />
                            <span className="text-[#ff4d00]">TOUCH</span>
                        </h2>

                        <p className="text-text-secondary text-lg leading-relaxed max-w-md mb-12">
                            I'm currently looking for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
                        </p>

                        <div className="space-y-8">
                            <div className="flex items-center gap-6 group">
                                <div className="w-14 h-14 rounded-2xl bg-surface border border-white/5 flex items-center justify-center text-[#ff4d00] group-hover:border-[#ff4d00]/30 transition-colors">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-[#ff4d00] uppercase tracking-wider mb-1">Email Me</p>
                                    <a href="#" className="text-white font-medium hover:text-[#ff4d00] transition-colors">vishnusvprasad@gmail.com</a>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 group">
                                <div className="w-14 h-14 rounded-2xl bg-surface border border-white/5 flex items-center justify-center text-[#ff4d00] group-hover:border-[#ff4d00]/30 transition-colors">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-[#ff4d00] uppercase tracking-wider mb-1">Location</p>
                                    <p className="text-white font-medium">Kerala, India</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 group">
                                <div className="w-14 h-14 rounded-2xl bg-surface border border-white/5 flex items-center justify-center text-[#ff4d00] group-hover:border-[#ff4d00]/30 transition-colors">
                                    <Linkedin size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-[#ff4d00] uppercase tracking-wider mb-1">LinkedIn</p>
                                    <a href="www.linkedin.com/in/vishnu-prasad-sv" className="text-white font-medium hover:text-[#ff4d00] transition-colors">www.linkedin.com/in/vishnu-prasad-sv</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Decorative Line */}
                    <div className="w-24 h-1 bg-gradient-to-r from-[#ff4d00] to-transparent mt-12 md:mt-0" />
                </motion.div>

                {/* Right Column: Form */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-surface border border-white/5 rounded-3xl p-8 md:p-12 relative overflow-hidden"
                >
                    {/* Glow effect inside card */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff4d00]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                    <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                        <div>
                            <label className="block text-xs font-bold text-[#ff4d00] uppercase tracking-wider mb-2">Your Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="John Doe"
                                required
                                className="w-full bg-transparent border-b border-white/10 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#ff4d00] transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[#ff4d00] uppercase tracking-wider mb-2">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="john@example.com"
                                required
                                className="w-full bg-transparent border-b border-white/10 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#ff4d00] transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[#ff4d00] uppercase tracking-wider mb-2">Subject</label>
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                placeholder="Project Inquiry"
                                required
                                className="w-full bg-transparent border-b border-white/10 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#ff4d00] transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[#ff4d00] uppercase tracking-wider mb-2">Message</label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="How can I help you?"
                                required
                                rows={4}
                                className="w-full bg-transparent border-b border-white/10 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#ff4d00] transition-colors resize-none"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={status === 'sending'}
                            className="w-full py-4 bg-[#ff4d00] hover:bg-[#ff6a00] text-black font-bold rounded-lg transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {status === 'sending' ? 'Sending...' : 'SEND MESSAGE'}
                            {!status.startsWith('send') && <Send size={18} className="group-hover:translate-x-1 transition-transform" />}
                        </button>

                        {status === 'success' && (
                            <p className="text-green-500 text-sm font-medium text-center animate-fade-in">Message sent successfully!</p>
                        )}
                        {status !== 'idle' && status !== 'sending' && status !== 'success' && (
                            <p className="text-red-500 text-sm font-medium text-center animate-fade-in">{status}</p>
                        )}
                    </form>
                </motion.div>

            </div>
        </section>
    );
};

export default Contact;
