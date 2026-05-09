import { useNavigate } from 'react-router-dom';
import {
    ArrowRight, Compass, Mail,
    GraduationCap, Users, BarChart3, Shield, Activity, FileText
} from 'lucide-react';

const OFFER_ITEMS = [
    {
        icon: GraduationCap,
        title: 'Education',
        desc: 'Expert resources for taxes, branding, contracts, IP, financial literacy, and content creation.'
    },
    {
        icon: Users,
        title: 'Trusted Representation',
        desc: 'Connect athletes with vetted agents while reducing bad actors.'
    },
    {
        icon: BarChart3,
        title: 'Earnings Tracking',
        desc: 'Monitor deals, income, activity, and progress over time.'
    },
    {
        icon: Shield,
        title: 'Compliance Tools',
        desc: 'Help athletes and universities stay organized and reduce reporting risk.'
    },
    {
        icon: Activity,
        title: 'Brand Growth',
        desc: 'Build audience, improve visibility, and unlock new opportunities.'
    },
    {
        icon: FileText,
        title: 'Resource Hub',
        desc: 'Guides, newsletters, templates, and NIL insights.'
    }
];

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="nil-page">

            {/* ── HERO ── */}
            <section className="nil-hero-section">
                <h1 className="nil-hero-brand">FrontDoor</h1>

                <h2 className="nil-hero-slogan">
                    Open the Right Doors. Build What's Next.
                </h2>

                <p className="nil-hero-subheadline">
                    Where athletes grow, agents connect, and schools stay compliant.
                </p>

                <p className="nil-hero-description">
                    Start your NIL journey with confidence on a platform built for education,
                    trusted representation, and long-term success. Learn through expert resources,
                    connect with vetted agents, track your earnings and activity, and stay organized
                    every step of the way.
                    <br /><br />
                    We help athletes grow safely while making compliance and reporting easier for schools.
                </p>

                <div className="nil-hero-ctas">
                    <button
                        className="nil-btn-primary"
                        onClick={() => navigate('/get-started')}
                    >
                        Get Started
                        <ArrowRight size={18} />
                    </button>
                    <button
                        className="nil-btn-outline"
                        onClick={() => navigate('/explore')}
                    >
                        <Compass size={18} />
                        Explore NIL
                    </button>
                </div>
            </section>

            {/* ── WHAT WE OFFER ── */}
            <section id="what-we-do" className="nil-section">
                <div className="nil-section-header">
                    <h2 className="nil-section-title">What We Offer</h2>
                    <p className="nil-section-subtitle">
                        Everything you need to navigate NIL with confidence, clarity, and compliance.
                    </p>
                </div>

                <div className="nil-offer-grid">
                    {OFFER_ITEMS.map((item) => (
                        <div key={item.title} className="nil-offer-card">
                            <div className="nil-icon-box">
                                <item.icon size={22} strokeWidth={2.5} />
                            </div>
                            <div className="nil-offer-content">
                                <h3 className="nil-offer-title">{item.title}</h3>
                                <p className="nil-offer-desc">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── CONTACT ── */}
            <section id="contact" className="nil-section nil-section--alt">
                <div className="nil-section-header">
                    <h2 className="nil-section-title">Ready to Start Your NIL Journey?</h2>
                    <p className="nil-section-subtitle">
                        We're here to help you navigate NIL with clarity and confidence.
                    </p>
                </div>

                <form
                    className="nil-contact-form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        alert('Message sent! We\'ll be in touch soon.');
                        e.target.reset();
                    }}
                >
                    <div className="nil-form-row">
                        <div className="nil-form-group">
                            <label className="nil-form-label" htmlFor="contact-name">Name</label>
                            <input
                                id="contact-name"
                                type="text"
                                placeholder="Your name"
                                required
                                className="nil-form-input"
                            />
                        </div>
                        <div className="nil-form-group">
                            <label className="nil-form-label" htmlFor="contact-email">Email</label>
                            <input
                                id="contact-email"
                                type="email"
                                placeholder="you@email.com"
                                required
                                className="nil-form-input"
                            />
                        </div>
                    </div>
                    <div className="nil-form-group">
                        <label className="nil-form-label" htmlFor="contact-message">Message</label>
                        <textarea
                            id="contact-message"
                            rows={5}
                            placeholder="Tell us what you're looking for..."
                            required
                            className="nil-form-input"
                        />
                    </div>
                    <div className="nil-contact-actions">
                        <button type="submit" className="nil-btn-primary nil-btn-submit">
                            Get Started
                            <ArrowRight size={16} />
                        </button>
                        <button
                            type="button"
                            className="nil-btn-outline"
                            onClick={() => document.querySelector('#contact-name')?.focus()}
                        >
                            <Mail size={16} />
                            Contact Us
                        </button>
                    </div>
                </form>
            </section>

            {/* ── FOOTER ── */}
            <footer className="nil-footer">
                <div className="nil-footer-container">
                    <div className="nil-footer-brand">
                        <h3 className="nil-footer-logo">FrontDoor</h3>
                        <p>Empowering the next generation of athlete success.</p>
                    </div>
                    <div className="nil-footer-links">
                        <div className="nil-footer-col">
                            <h4>Product</h4>
                            <a href="/explore">Explore NIL</a>
                            <a href="/resources">Resources</a>
                            <a href="#what-we-do">Education</a>
                        </div>
                        <div className="nil-footer-col">
                            <h4>Company</h4>
                            <a href="/about">About</a>
                            <a href="#contact">Contact</a>
                        </div>
                        <div className="nil-footer-col">
                            <h4>Legal</h4>
                            <a href="#">Privacy</a>
                            <a href="#">Terms</a>
                        </div>
                    </div>
                </div>
                <div className="nil-footer-bottom">
                    <p>© 2026 FrontDoor. All rights reserved.</p>
                </div>
            </footer>

        </div>
    );
}
