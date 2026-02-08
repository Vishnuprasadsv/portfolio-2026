import React from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import TechTicker from './TechTicker';
import Projects from './Projects';

import Certifications from './Certifications';
import Testimonials from './Testimonials';
import Footer from './Footer';

const Home = () => {
    return (
        <div className="bg-background text-text-primary min-h-screen font-sans selection:bg-primary selection:text-white overflow-hidden">
            <Navbar />
            <main>
                <Hero />
                <TechTicker />
                <Projects />

                <Certifications />
                <Testimonials />
            </main>
            <Footer />
        </div>
    );
};

export default Home;
