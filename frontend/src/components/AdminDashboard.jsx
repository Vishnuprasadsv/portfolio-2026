import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, User, Share2, Code, Briefcase, Award, MessageSquare, LogOut, Upload, Image as ImageIcon, FileText, Plus, Edit2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [profileData, setProfileData] = useState(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const fetchProfile = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/public/profile`);
            setProfileData(res.data);
        } catch (err) {
            console.error("Failed to fetch profile", err);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        setUploading(true);
        try {
            const token = sessionStorage.getItem('token');
            const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/admin/upload-profile-image`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'x-auth-token': token
                }
            });
            // Update local state with new image
            setProfileData({ ...profileData, profilePhotoUrl: res.data.imageUrl });
        } catch (err) {
            console.error("Upload failed", err);
            const errorMessage = err.response?.data?.error || err.message || "Unknown error";
            alert(`Image upload failed: ${errorMessage}`);
        } finally {
            setUploading(false);
        }
    };

    const [socials, setSocials] = useState({});
    const [loading, setLoading] = useState({});

    // Fetch existing socials
    const fetchSocials = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/public/all`);
            // Map array of socials to object
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

    useEffect(() => {
        if (activeTab === 'socials') {
            fetchSocials();
        }
    }, [activeTab]);

    const handleSocialUpdate = async (platform, url) => {
        setLoading(prev => ({ ...prev, [platform]: true }));
        try {
            const token = sessionStorage.getItem('token');
            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/admin/socials/upsert`,
                { platform, url },
                { headers: { 'x-auth-token': token } }
            );
            alert(`${platform} updated successfully!`);
        } catch (err) {
            console.error(err);
            alert(`Failed to update ${platform}`);
        } finally {
            setLoading(prev => ({ ...prev, [platform]: false }));
        }
    };

    // --- Techs Logic ---
    const [techs, setTechs] = useState([]);
    const [newTech, setNewTech] = useState({ name: '' });

    const fetchTechs = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/public/all`);
            if (res.data.techs) {
                setTechs(res.data.techs);
            }
        } catch (err) {
            console.error("Failed to fetch techs", err);
        }
    };

    const handleAddTech = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/admin/techs`,
                { name: newTech.name, inTicker: true },
                { headers: { 'x-auth-token': token } }
            );
            setTechs([...techs, res.data]);
            setNewTech({ name: '' });
        } catch (err) {
            console.error("Failed to add tech", err);
            alert("Failed to add skill");
        }
    };

    const handleDeleteTech = async (id) => {
        if (!window.confirm("Are you sure you want to delete this skill?")) return;
        try {
            const token = sessionStorage.getItem('token');
            await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/admin/techs/${id}`,
                { headers: { 'x-auth-token': token } }
            );
            setTechs(techs.filter(t => t._id !== id));
        } catch (err) {
            console.error("Failed to delete tech", err);
            alert("Failed to delete skill");
        }
    };

    useEffect(() => {
        if (activeTab === 'techs') {
            fetchTechs();
        }
    }, [activeTab]);

    const handleLogout = () => {
        sessionStorage.removeItem('token');
        navigate('/login');
    };

    // --- CV & Case Studies Logic ---
    const [currentCV, setCurrentCV] = useState(null);
    const [caseStudies, setCaseStudies] = useState([]);
    const [uploadingCV, setUploadingCV] = useState(false);

    // Case Study Modal State
    const [isCaseStudyModalOpen, setIsCaseStudyModalOpen] = useState(false);
    const [editingCaseStudy, setEditingCaseStudy] = useState(null);
    const [newCaseStudy, setNewCaseStudy] = useState({ title: '', description: '', overview: '', link: '', methods: '' });
    const caseStudyImageRef = useRef(null);

    // Project Modal State
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [projects, setProjects] = useState([]);
    const [newProject, setNewProject] = useState({ title: '', type: '', description: '', overview: '', link: '', featured: 'false' });
    const projectImageRef = useRef(null);

    // Experience Modal State
    const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
    const [editingExperience, setEditingExperience] = useState(null);
    const [experiences, setExperiences] = useState([]);
    const [newExperience, setNewExperience] = useState({ title: '', company: '', description: '', startDate: '', endDate: '' });

    // Testimonial Modal State
    const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState(null);
    const [testimonials, setTestimonials] = useState([]);
    const [newTestimonial, setNewTestimonial] = useState({ name: '', position: '', company: '', text: '' });

    const fetchCVAndCaseStudies = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/public/all`);
            setCurrentCV(res.data.cv);
            setCaseStudies(res.data.caseStudies || []);
            setProjects(res.data.projects || []);
            setExperiences(res.data.experiences || []);
            setTestimonials(res.data.testimonials || []);
        } catch (err) {
            console.error("Failed to fetch CV/CaseStudies/Projects/Experiences", err);
        }
    };

    const handleCVUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingCV(true);
        const formData = new FormData();
        formData.append('cv', file);

        try {
            const token = sessionStorage.getItem('token');
            const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/admin/cv`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'x-auth-token': token
                }
            });
            setCurrentCV(res.data);
            alert("CV uploaded successfully!");
        } catch (err) {
            console.error("CV upload failed", err);
            const errorMessage = err.response?.data?.error || err.message || "Unknown error";
            alert(`Failed to upload CV: ${errorMessage}`);
        } finally {
            setUploadingCV(false);
        }
    };

    const handleCaseStudySubmit = async () => {
        if (!newCaseStudy.title || !newCaseStudy.description) {
            alert("Title and description are required.");
            return;
        }

        const formData = new FormData();
        formData.append('title', newCaseStudy.title);
        formData.append('description', newCaseStudy.description);
        formData.append('overview', newCaseStudy.overview || '');
        formData.append('link', newCaseStudy.link);
        formData.append('methods', newCaseStudy.methods || '');

        if (caseStudyImageRef.current?.files[0]) {
            formData.append('image', caseStudyImageRef.current.files[0]);
        } else if (!editingCaseStudy) {
            alert("Cover image is required for new case studies.");
            return;
        }

        setUploading(true);
        try {
            const token = sessionStorage.getItem('token');
            const url = editingCaseStudy
                ? `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/admin/casestudies/${editingCaseStudy._id}`
                : `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/admin/casestudies`;

            const method = editingCaseStudy ? 'put' : 'post';

            const res = await axios[method](url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'x-auth-token': token
                }
            });

            if (editingCaseStudy) {
                setCaseStudies(caseStudies.map(cs => cs._id === editingCaseStudy._id ? res.data : cs));
            } else {
                setCaseStudies([...caseStudies, res.data]);
            }

            setIsCaseStudyModalOpen(false);
            setEditingCaseStudy(null);
            setNewCaseStudy({ title: '', description: '', link: '' });
        } catch (err) {
            console.error("Case Study save failed", err);
            alert("Failed to save case study.");
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteCaseStudy = async (id) => {
        if (!window.confirm("Delete this case study?")) return;
        try {
            const token = sessionStorage.getItem('token');
            await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/admin/casestudies/${id}`, {
                headers: { 'x-auth-token': token }
            });
            setCaseStudies(caseStudies.filter(cs => cs._id !== id));
        } catch (err) {
            console.error("Delete failed", err);
            alert("Delete failed.");
        }
    };



    // --- Project Logic ---
    const handleProjectSubmit = async () => {
        if (!newProject.title || !newProject.description || !newProject.type) {
            alert("Title, Type, and Description are required.");
            return;
        }

        const formData = new FormData();
        formData.append('title', newProject.title);
        formData.append('type', newProject.type);
        formData.append('description', newProject.description);
        formData.append('overview', newProject.overview || '');
        formData.append('link', newProject.link || '');
        formData.append('featured', newProject.featured);

        if (projectImageRef.current?.files[0]) {
            formData.append('image', projectImageRef.current.files[0]);
        } else if (!editingProject) {
            alert("Cover image is required for new projects.");
            return;
        }

        setUploading(true);
        try {
            const token = sessionStorage.getItem('token');
            const url = editingProject
                ? `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/admin/projects/${editingProject._id}`
                : `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/admin/projects`;

            const method = editingProject ? 'put' : 'post';

            const res = await axios[method](url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'x-auth-token': token
                }
            });

            if (editingProject) {
                setProjects(projects.map(p => p._id === editingProject._id ? res.data : p));
            } else {
                setProjects([...projects, res.data]);
            }

            setIsProjectModalOpen(false);
            setEditingProject(null);
            setNewProject({ title: '', type: '', description: '', overview: '', link: '', featured: 'false' });
        } catch (err) {
            console.error("Project save failed", err);
            alert("Failed to save project.");
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteProject = async (id) => {
        if (!window.confirm("Delete this project?")) return;
        try {
            const token = sessionStorage.getItem('token');
            await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/admin/projects/${id}`, {
                headers: { 'x-auth-token': token }
            });
            setProjects(projects.filter(p => p._id !== id));
        } catch (err) {
            console.error("Delete failed", err);
            alert("Delete failed.");
        }
    };

    // --- Experience Logic ---
    const handleExperienceSubmit = async () => {
        if (!newExperience.title || !newExperience.company || !newExperience.description) {
            alert("Title, Company, and Description are required.");
            return;
        }

        setUploading(true);
        try {
            const token = sessionStorage.getItem('token');
            const url = editingExperience
                ? `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/admin/experience/${editingExperience._id}`
                : `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/admin/experience`;

            const method = editingExperience ? 'put' : 'post';

            const res = await axios[method](url, newExperience, {
                headers: { 'x-auth-token': token }
            });

            if (editingExperience) {
                setExperiences(experiences.map(e => e._id === editingExperience._id ? res.data : e));
            } else {
                setExperiences([res.data, ...experiences]); // Add to top
            }

            setIsExperienceModalOpen(false);
            setEditingExperience(null);
            setNewExperience({ title: '', company: '', description: '', startDate: '', endDate: '' });
        } catch (err) {
            console.error("Experience save failed", err);
            alert("Failed to save experience.");
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteExperience = async (id) => {
        if (!window.confirm("Delete this experience entry?")) return;
        try {
            const token = sessionStorage.getItem('token');
            await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/admin/experience/${id}`, {
                headers: { 'x-auth-token': token }
            });
            setExperiences(experiences.filter(e => e._id !== id));
        } catch (err) {
            console.error("Delete failed", err);
            alert("Delete failed.");
        }
    };

    // --- Testimonial Logic ---
    const handleTestimonialSubmit = async () => {
        if (!newTestimonial.name || !newTestimonial.text) {
            alert("Name and Quote are required.");
            return;
        }

        setUploading(true);
        try {
            const token = sessionStorage.getItem('token');
            const url = editingTestimonial
                ? `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/admin/testimonials/${editingTestimonial._id}`
                : `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/admin/testimonials`;

            const method = editingTestimonial ? 'put' : 'post';

            const res = await axios[method](url, newTestimonial, {
                headers: { 'x-auth-token': token }
            });

            if (editingTestimonial) {
                setTestimonials(testimonials.map(t => t._id === editingTestimonial._id ? res.data : t));
            } else {
                setTestimonials([...testimonials, res.data]);
            }

            setIsTestimonialModalOpen(false);
            setEditingTestimonial(null);
            setNewTestimonial({ name: '', position: '', company: '', text: '' });
        } catch (err) {
            console.error("Testimonial save failed", err);
            alert(err.response?.data?.error || "Failed to save testimonial.");
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteTestimonial = async (id) => {
        if (!window.confirm("Delete this testimonial?")) return;
        try {
            const token = sessionStorage.getItem('token');
            await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/admin/testimonials/${id}`, {
                headers: { 'x-auth-token': token }
            });
            setTestimonials(testimonials.filter(t => t._id !== id));
        } catch (err) {
            console.error("Delete failed", err);
            alert("Delete failed.");
        }
    };


    useEffect(() => {
        if (activeTab === 'cv-casestudies' || activeTab === 'projects' || activeTab === 'certificates' || activeTab === 'testimonials') {
            fetchCVAndCaseStudies();
        }
    }, [activeTab]);

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'socials', label: 'Socials', icon: Share2 },
        { id: 'techs', label: 'Tech Stack', icon: Code },
        { id: 'cv-casestudies', label: 'CV & Case Studies', icon: FileText },
        { id: 'projects', label: 'Projects', icon: Briefcase },
        { id: 'certificates', label: 'Certifications & Work Experience', icon: Award },
        { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
    ];

    return (
        <div className="min-h-screen bg-background text-text-primary flex">
            {/* Sidebar */}
            <aside className="w-64 bg-surface border-r border-white/5 p-6 flex flex-col">
                <div className="mb-10 flex items-center gap-3">
                    <LayoutDashboard className="text-primary" />
                    <h1 className="font-display font-bold text-xl">Admin Panel</h1>
                </div>

                <nav className="flex-1 space-y-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id
                                ? 'bg-primary/10 text-primary'
                                : 'text-text-secondary hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </nav>

                <div className="mt-auto border-t border-white/5 pt-6 flex items-center gap-3">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors"
                    >
                        <LogOut size={18} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto h-screen">
                <header className="mb-8">
                    <h2 className="text-2xl font-bold font-display text-white capitalize">{activeTab === 'cv-casestudies' ? 'CV & Case Studies' : activeTab + ' Management'}</h2>
                    <p className="text-text-secondary text-sm mt-1">Manage your {activeTab === 'cv-casestudies' ? 'CV and Case Studies' : activeTab} content here.</p>
                </header>

                <div className="bg-surface/50 border border-white/5 rounded-2xl p-6 min-h-[400px]">
                    {activeTab === 'profile' && (
                        <div className="flex flex-col items-center gap-6 max-w-md mx-auto py-10">
                            <div className="relative group">
                                <div className="w-48 h-48 rounded-2xl overflow-hidden border-2 border-white/10 bg-black/50 flex items-center justify-center">
                                    {profileData?.profilePhotoUrl ? (
                                        <img
                                            src={profileData.profilePhotoUrl}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <ImageIcon size={48} className="text-white/20" />
                                    )}
                                </div>
                            </div>

                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                                className="hidden"
                                accept=".jpg, .jpeg, .png, .webp"
                            />

                            <button
                                onClick={() => fileInputRef.current.click()}
                                disabled={uploading}
                                className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-6 rounded-lg transition-all flex items-center gap-2 disabled:opacity-50"
                            >
                                {uploading ? 'Uploading...' : 'Update Image'}
                                {!uploading && <Upload size={18} />}
                            </button>

                            <p className="text-xs text-text-secondary text-center max-w-xs">
                                Click update to upload a new profile picture from your device.
                            </p>
                        </div>
                    )}

                    {activeTab === 'socials' && (
                        <div className="max-w-2xl mx-auto py-8 space-y-6">
                            {['Github', 'Linkedin', 'Email', 'X', 'Instagram'].map((platform) => (
                                <div key={platform} className="flex items-center gap-4">
                                    <label className="w-32 font-bold text-white text-lg">{platform}</label>
                                    <span className="text-white text-lg">:</span>
                                    <div className="flex-1 flex gap-4">
                                        <input
                                            type="text"
                                            value={socials[platform.toLowerCase()] || ''}
                                            onChange={(e) => setSocials({ ...socials, [platform.toLowerCase()]: e.target.value })}
                                            placeholder={`enter ${platform} ${platform === 'Email' ? 'id' : 'profile url'} here`}
                                            className="flex-1 bg-black/40 border border-white/10 rounded px-4 py-3 text-text-secondary focus:outline-none focus:border-primary/50 transition-colors"
                                        />
                                        <button
                                            onClick={() => handleSocialUpdate(platform, socials[platform.toLowerCase()])}
                                            disabled={loading[platform]}
                                            className="bg-[#ff4d00] hover:bg-[#ff6a00] text-black font-bold px-6 py-3 rounded transition-colors disabled:opacity-50 min-w-[100px]"
                                        >
                                            {loading[platform] ? '...' : 'Update'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'cv-casestudies' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                            {/* CV Section */}
                            <div className="bg-black/20 p-6 rounded-xl border border-white/5">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <FileText className="text-primary" size={24} />
                                    Curriculum Vitae
                                </h3>

                                <div className="space-y-6">
                                    <div className="p-8 bg-black/40 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center gap-4 text-center">
                                        {currentCV ? (
                                            <>
                                                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-2">
                                                    <FileText size={32} />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-white font-medium">Current CV Uploaded</p>
                                                    <p className="text-xs text-text-secondary">Last updated: {new Date(currentCV.updatedAt).toLocaleDateString()}</p>
                                                </div>
                                                <div className="flex gap-3 mt-2">
                                                    <a
                                                        href={currentCV.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors"
                                                    >
                                                        View PDF
                                                    </a>
                                                </div>
                                            </>
                                        ) : (
                                            <p className="text-text-secondary">No CV uploaded yet.</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-text-secondary">Upload New CV (PDF)</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="file"
                                                accept=".pdf"
                                                onChange={handleCVUpload}
                                                disabled={uploadingCV}
                                                className="block w-full text-sm text-text-secondary
                                                    file:mr-4 file:py-2.5 file:px-4
                                                    file:rounded-lg file:border-0
                                                    file:text-sm file:font-semibold
                                                    file:bg-primary file:text-white
                                                    hover:file:bg-primary-hover
                                                    cursor-pointer bg-black/40 rounded-lg border border-white/10"
                                            />
                                        </div>
                                        {uploadingCV && <p className="text-xs text-primary animate-pulse">Uploading...</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Case Studies Section */}
                            <div className="bg-black/20 p-6 rounded-xl border border-white/5 flex flex-col">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        <Briefcase className="text-primary" size={24} />
                                        Case Studies
                                    </h3>
                                    <button
                                        onClick={() => {
                                            setEditingCaseStudy(null);
                                            setNewCaseStudy({ title: '', description: '', overview: '', link: '', methods: '' });
                                            setIsCaseStudyModalOpen(true);
                                        }}
                                        className="p-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>

                                <div className="space-y-4 overflow-y-auto max-h-[420px] pr-2 custom-scrollbar">
                                    {caseStudies.map(cs => (
                                        <div key={cs._id} className="p-4 bg-surface border border-white/5 rounded-lg flex gap-4 group hover:border-white/20 transition-all">
                                            <div className="w-16 h-16 rounded-lg bg-black/50 overflow-hidden flex-shrink-0">
                                                <img src={cs.imageUrl} alt={cs.title} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-white truncate">{cs.title}</h4>
                                                <p className="text-xs text-text-secondary line-clamp-2">{cs.description}</p>
                                            </div>
                                            <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => {
                                                        setEditingCaseStudy(cs);
                                                        setNewCaseStudy({
                                                            title: cs.title,
                                                            description: cs.description,
                                                            overview: cs.overview || '',
                                                            link: cs.link,
                                                            methods: cs.methods ? cs.methods.join(', ') : ''
                                                        });
                                                        setIsCaseStudyModalOpen(true);
                                                    }}
                                                    className="p-1.5 hover:bg-white/10 text-text-secondary hover:text-white rounded"
                                                >
                                                    <Edit2 size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteCaseStudy(cs._id)}
                                                    className="p-1.5 hover:bg-red-500/10 text-text-secondary hover:text-red-500 rounded"
                                                >
                                                    <LogOut size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {caseStudies.length === 0 && (
                                        <p className="text-center text-text-secondary py-8 italic">No case studies added.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'techs' && (
                        <div className="max-w-3xl mx-auto py-8">
                            {/* Add New Tech Form */}
                            <div className="bg-black/40 border border-white/10 rounded-xl p-6 mb-8">
                                <h3 className="text-lg font-bold text-white mb-4">Add New Skill</h3>
                                <div className="flex gap-4">
                                    <input
                                        type="text"
                                        value={newTech.name}
                                        onChange={(e) => setNewTech({ ...newTech, name: e.target.value })}
                                        placeholder="Skill Name (e.g. React, Node.js)"
                                        className="flex-1 bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                    />
                                    <button
                                        onClick={handleAddTech}
                                        disabled={!newTech.name}
                                        className="px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        <Upload size={18} />
                                        Add
                                    </button>
                                </div>
                            </div>

                            {/* Skills List */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-white mb-4">Current Skills</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {techs.map((tech) => (
                                        <div key={tech._id} className="flex items-center justify-between p-4 bg-surface/50 border border-white/5 rounded-xl group hover:border-white/20 transition-all">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-primary/50 group-hover:bg-primary transition-colors" />
                                                <span className="font-medium text-white tracking-wide">{tech.name}</span>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteTech(tech._id)}
                                                className="p-2 text-text-secondary hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                                title="Delete Skill"
                                            >
                                                <LogOut size={16} /> {/* Using LogOut as Delete icon proxy or import Trash if available */}
                                            </button>
                                        </div>
                                    ))}
                                    {techs.length === 0 && (
                                        <p className="text-text-secondary italic col-span-2 text-center py-8">No skills added yet.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'projects' && (
                        <div className="h-full flex flex-col">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-white">All Projects</h3>
                                <button
                                    onClick={() => {
                                        setEditingProject(null);
                                        setNewProject({ title: '', type: '', description: '', overview: '', link: '', featured: 'false' });
                                        setIsProjectModalOpen(true);
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg font-bold transition-colors"
                                >
                                    <Plus size={18} /> Add Project
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pb-6 custom-scrollbar">
                                {projects.map((project) => (
                                    <div key={project._id} className="bg-black/20 border border-white/5 rounded-xl overflow-hidden group hover:border-white/20 transition-all">
                                        <div className="h-48 overflow-hidden relative">
                                            <img
                                                src={project.imageUrl}
                                                alt={project.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded text-xs text-white font-bold backdrop-blur-sm">
                                                {project.type}
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h4 className="text-lg font-bold text-white mb-1 truncate">{project.title}</h4>
                                            <p className="text-text-secondary text-sm line-clamp-2 mb-4">{project.description}</p>

                                            <div className="flex justify-between items-center pt-2 border-t border-white/5">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setEditingProject(project);
                                                            setNewProject({
                                                                title: project.title,
                                                                type: project.type,
                                                                description: project.description,
                                                                overview: project.overview || '',
                                                                link: project.link || '',
                                                                featured: String(project.featured)
                                                            });
                                                            setIsProjectModalOpen(true);
                                                        }}
                                                        className="p-2 hover:bg-white/10 text-text-secondary hover:text-white rounded transition-colors"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteProject(project._id)}
                                                        className="p-2 hover:bg-red-500/10 text-text-secondary hover:text-red-500 rounded transition-colors"
                                                    >
                                                        <LogOut size={16} />
                                                    </button>
                                                </div>
                                                {project.link && (
                                                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                                                        Visit Link
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {projects.length === 0 && (
                                    <div className="col-span-full flex flex-col items-center justify-center py-20 text-text-secondary">
                                        <Briefcase size={48} className="mb-4 opacity-50" />
                                        <p>No projects added yet.</p>
                                        <button
                                            onClick={() => setIsProjectModalOpen(true)}
                                            className="mt-4 text-primary hover:underline"
                                        >
                                            Create your first project
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}



                    {activeTab === 'certificates' && (
                        <div className="h-full flex flex-col">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-white">Work Experience & Certifications</h3>
                                <button
                                    onClick={() => {
                                        setEditingExperience(null);
                                        setNewExperience({ title: '', company: '', description: '', startDate: '', endDate: '' });
                                        setIsExperienceModalOpen(true);
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg font-bold transition-colors"
                                >
                                    <Plus size={18} /> Add Entry
                                </button>
                            </div>

                            <div className="space-y-4 overflow-y-auto pb-6 custom-scrollbar">
                                {experiences.map((exp) => (
                                    <div key={exp._id} className="p-6 bg-black/20 border border-white/5 rounded-xl group hover:border-white/20 transition-all flex flex-col md:flex-row justify-between gap-4 overflow-hidden">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                                <h4 className="text-lg font-bold text-white truncate">{exp.title}</h4>
                                                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20 whitespace-nowrap">
                                                    {exp.startDate} - {exp.endDate}
                                                </span>
                                            </div>
                                            <p className="text-sm font-medium text-white/70 mb-2 truncate">{exp.company}</p>
                                            <p className="text-sm text-text-secondary line-clamp-2 break-words">{exp.description}</p>
                                        </div>
                                        <div className="flex items-start gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => {
                                                    setEditingExperience(exp);
                                                    setNewExperience({
                                                        title: exp.title,
                                                        company: exp.company,
                                                        description: exp.description,
                                                        startDate: exp.startDate,
                                                        endDate: exp.endDate
                                                    });
                                                    setIsExperienceModalOpen(true);
                                                }}
                                                className="p-2 hover:bg-white/10 text-text-secondary hover:text-white rounded transition-colors"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteExperience(exp._id)}
                                                className="p-2 hover:bg-red-500/10 text-text-secondary hover:text-red-500 rounded transition-colors"
                                            >
                                                <LogOut size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {experiences.length === 0 && (
                                    <div className="col-span-full flex flex-col items-center justify-center py-20 text-text-secondary">
                                        <Award size={48} className="mb-4 opacity-50" />
                                        <p>No experiences added yet.</p>
                                        <button
                                            onClick={() => setIsExperienceModalOpen(true)}
                                            className="mt-4 text-primary hover:underline"
                                        >
                                            Add your first experience
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'testimonials' && (
                        <div className="h-full flex flex-col">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-white">Client Testimonials</h3>
                                <button
                                    onClick={() => {
                                        setEditingTestimonial(null);
                                        setNewTestimonial({ name: '', position: '', company: '', text: '' });
                                        setIsTestimonialModalOpen(true);
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg font-bold transition-colors"
                                >
                                    <Plus size={18} /> Add Testimonial
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pb-6 custom-scrollbar">
                                {testimonials.map((t) => (
                                    <div key={t._id} className="bg-black/20 border border-white/5 rounded-xl p-6 group hover:border-white/20 transition-all relative">
                                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => {
                                                    setEditingTestimonial(t);
                                                    setNewTestimonial({
                                                        name: t.name,
                                                        position: t.position || '',
                                                        company: t.company || '',
                                                        text: t.text
                                                    });
                                                    setIsTestimonialModalOpen(true);
                                                }}
                                                className="p-1.5 hover:bg-white/10 text-text-secondary hover:text-white rounded transition-colors"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteTestimonial(t._id)}
                                                className="p-1.5 hover:bg-red-500/10 text-text-secondary hover:text-red-500 rounded transition-colors"
                                            >
                                                <LogOut size={16} />
                                            </button>
                                        </div>
                                        <MessageSquare className="text-primary mb-4" size={32} />
                                        <p className="text-white italic mb-4 break-words whitespace-pre-wrap">"{t.text}"</p>
                                        <div>
                                            <h4 className="font-bold text-white">{t.name}</h4>
                                            <p className="text-xs text-text-secondary">
                                                {t.position && t.company ? `${t.position}, ${t.company}` : (t.position || t.company)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {testimonials.length === 0 && (
                                    <div className="col-span-full flex flex-col items-center justify-center py-20 text-text-secondary">
                                        <MessageSquare size={48} className="mb-4 opacity-50" />
                                        <p>No testimonials added yet.</p>
                                    </div>
                                )}
                            </div>

                            {/* Testimonial Modal */}
                            {isTestimonialModalOpen && (
                                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-8 max-w-lg w-full shadow-2xl"
                                    >
                                        <h3 className="text-2xl font-bold font-display text-white mb-6">
                                            {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
                                        </h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm text-text-secondary mb-1">Client Name *</label>
                                                <input
                                                    type="text"
                                                    value={newTestimonial.name}
                                                    onChange={e => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                                                    placeholder="e.g. John Doe"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm text-text-secondary mb-1">Position</label>
                                                    <input
                                                        type="text"
                                                        value={newTestimonial.position}
                                                        onChange={e => setNewTestimonial({ ...newTestimonial, position: e.target.value })}
                                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                                                        placeholder="e.g. CEO"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm text-text-secondary mb-1">Company</label>
                                                    <input
                                                        type="text"
                                                        value={newTestimonial.company}
                                                        onChange={e => setNewTestimonial({ ...newTestimonial, company: e.target.value })}
                                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                                                        placeholder="e.g. TechCorp"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm text-text-secondary mb-1">Quote *</label>
                                                <textarea
                                                    value={newTestimonial.text}
                                                    onChange={e => setNewTestimonial({ ...newTestimonial, text: e.target.value })}
                                                    rows={4}
                                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary resize-none"
                                                    placeholder="Client feedback..."
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-3 mt-8">
                                            <button
                                                onClick={() => setIsTestimonialModalOpen(false)}
                                                className="px-4 py-2 text-text-secondary hover:text-white transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleTestimonialSubmit}
                                                disabled={uploading}
                                                className="px-6 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg font-bold transition-colors disabled:opacity-50"
                                            >
                                                {uploading ? 'Saving...' : 'Save Testimonial'}
                                            </button>
                                        </div>
                                    </motion.div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab !== 'profile' && activeTab !== 'socials' && activeTab !== 'techs' && activeTab !== 'cv-casestudies' && activeTab !== 'projects' && activeTab !== 'certificates' && activeTab !== 'testimonials' && (
                        <div className="flex items-center justify-center h-full text-text-secondary">
                            Select a category to start editing.
                            <p className="mt-4 text-xs text-yellow-500">Form implementation for {activeTab} coming soon...</p>
                        </div>
                    )}
                </div>
            </main >

            {/* Case Study Modal */}
            {
                isCaseStudyModalOpen && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-surface border border-white/10 rounded-2xl p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar"
                        >
                            <h3 className="text-xl font-bold text-white mb-6">
                                {editingCaseStudy ? 'Edit Case Study' : 'Add New Case Study'}
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-text-secondary mb-1">Title</label>
                                    <input
                                        type="text"
                                        value={newCaseStudy.title}
                                        onChange={e => setNewCaseStudy({ ...newCaseStudy, title: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-text-secondary mb-1">Description</label>
                                    <textarea
                                        value={newCaseStudy.description}
                                        onChange={e => setNewCaseStudy({ ...newCaseStudy, description: e.target.value })}
                                        rows={4}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-text-secondary mb-1">Project Overview</label>
                                    <textarea
                                        value={newCaseStudy.overview}
                                        onChange={e => setNewCaseStudy({ ...newCaseStudy, overview: e.target.value })}
                                        rows={5}
                                        placeholder="Detailed case study content..."
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-text-secondary mb-1">Link (Optional)</label>
                                    <input
                                        type="text"
                                        value={newCaseStudy.link}
                                        onChange={e => setNewCaseStudy({ ...newCaseStudy, link: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-text-secondary mb-1">Methods Used (comma separated)</label>
                                    <input
                                        type="text"
                                        value={newCaseStudy.methods || ''}
                                        onChange={e => setNewCaseStudy({ ...newCaseStudy, methods: e.target.value })}
                                        placeholder="e.g. React, Node.js, Design"
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-text-secondary mb-1">Cover Image</label>
                                    <input
                                        type="file"
                                        ref={caseStudyImageRef}
                                        accept="image/*"
                                        className="block w-full text-sm text-text-secondary
                                                    file:mr-4 file:py-2 file:px-4
                                                    file:rounded-lg file:border-0
                                                    file:text-sm file:font-semibold
                                                    file:bg-white/10 file:text-white
                                                    hover:file:bg-white/20
                                                    cursor-pointer"
                                    />
                                    {editingCaseStudy && !caseStudyImageRef.current?.value && (
                                        <p className="text-xs text-text-secondary mt-1">Leave empty to keep existing image</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-8">
                                <button
                                    onClick={() => setIsCaseStudyModalOpen(false)}
                                    className="px-4 py-2 text-text-secondary hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCaseStudySubmit}
                                    disabled={uploading}
                                    className="px-6 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg font-bold transition-colors disabled:opacity-50"
                                >
                                    {uploading ? 'Saving...' : 'Save Case Study'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )
            }
            {/* Project Modal */}
            {
                isProjectModalOpen && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-surface border border-white/10 rounded-2xl p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar"
                        >
                            <h3 className="text-xl font-bold text-white mb-6">
                                {editingProject ? 'Edit Project' : 'Add New Project'}
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-text-secondary mb-1">Project Name</label>
                                    <input
                                        type="text"
                                        value={newProject.title}
                                        onChange={e => setNewProject({ ...newProject, title: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-text-secondary mb-1">Type (e.g. Fintech, E-commerce)</label>
                                    <input
                                        type="text"
                                        value={newProject.type}
                                        onChange={e => setNewProject({ ...newProject, type: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-text-secondary mb-1">Short Description</label>
                                    <textarea
                                        value={newProject.description}
                                        onChange={e => setNewProject({ ...newProject, description: e.target.value })}
                                        rows={3}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-text-secondary mb-1">Project Overview (Detailed)</label>
                                    <textarea
                                        value={newProject.overview}
                                        onChange={e => setNewProject({ ...newProject, overview: e.target.value })}
                                        rows={5}
                                        placeholder="Detailed description for the project page..."
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-text-secondary mb-1">External Link</label>
                                    <input
                                        type="text"
                                        value={newProject.link}
                                        onChange={e => setNewProject({ ...newProject, link: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-text-secondary mb-1">Featured?</label>
                                    <select
                                        value={newProject.featured}
                                        onChange={e => setNewProject({ ...newProject, featured: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                                    >
                                        <option value="false">No</option>
                                        <option value="true">Yes</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-text-secondary mb-1">Project Image</label>
                                    <input
                                        type="file"
                                        ref={projectImageRef}
                                        accept="image/*"
                                        className="block w-full text-sm text-text-secondary
                                                    file:mr-4 file:py-2 file:px-4
                                                    file:rounded-lg file:border-0
                                                    file:text-sm file:font-semibold
                                                    file:bg-white/10 file:text-white
                                                    hover:file:bg-white/20
                                                    cursor-pointer"
                                    />
                                    {editingProject && !projectImageRef.current?.value && (
                                        <p className="text-xs text-text-secondary mt-1">Leave empty to keep existing image</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-8">
                                <button
                                    onClick={() => setIsProjectModalOpen(false)}
                                    className="px-4 py-2 text-text-secondary hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleProjectSubmit}
                                    disabled={uploading}
                                    className="px-6 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg font-bold transition-colors disabled:opacity-50"
                                >
                                    {uploading ? 'Saving...' : 'Save Project'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )
            }

            {/* Experience Modal */}
            {
                isExperienceModalOpen && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-surface border border-white/10 rounded-2xl p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar"
                        >
                            <h3 className="text-xl font-bold text-white mb-6">
                                {editingExperience ? 'Edit Experience' : 'Add Experience'}
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-text-secondary mb-1">Job Title / Certification</label>
                                    <input
                                        type="text"
                                        value={newExperience.title}
                                        onChange={e => setNewExperience({ ...newExperience, title: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-text-secondary mb-1">Company / Issuer</label>
                                    <input
                                        type="text"
                                        value={newExperience.company}
                                        onChange={e => setNewExperience({ ...newExperience, company: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-text-secondary mb-1">Start Date</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. 2023"
                                            value={newExperience.startDate}
                                            onChange={e => setNewExperience({ ...newExperience, startDate: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-text-secondary mb-1">End Date</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Present"
                                            value={newExperience.endDate}
                                            onChange={e => setNewExperience({ ...newExperience, endDate: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm text-text-secondary mb-1">Description</label>
                                    <textarea
                                        value={newExperience.description}
                                        onChange={e => setNewExperience({ ...newExperience, description: e.target.value })}
                                        rows={4}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary resize-none"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-8">
                                <button
                                    onClick={() => setIsExperienceModalOpen(false)}
                                    className="px-4 py-2 text-text-secondary hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleExperienceSubmit}
                                    disabled={uploading}
                                    className="px-6 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg font-bold transition-colors disabled:opacity-50"
                                >
                                    {uploading ? 'Saving...' : 'Save Entry'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
        </div>
    )
}
export default AdminDashboard;
