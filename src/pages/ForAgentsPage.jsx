import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, BarChart3, Shield, Users, ArrowRight } from 'lucide-react';

const WHAT_YOU_GET = [
    {
        icon: Users,
        title: 'Verified Athlete Pipeline',
        desc: 'Connect with athletes who are actively building their NIL strategy.',
    },
    {
        icon: BarChart3,
        title: 'Structured Activity Tracking',
        desc: 'See athlete activity, deals, and engagement in one place.',
    },
    {
        icon: Shield,
        title: 'Compliance-Ready System',
        desc: 'Stay aligned with NIL reporting and requirements.',
    },
];

const SPORTS = [
    'Football', 'Basketball', 'Soccer', 'Baseball', 'Softball',
    'Track & Field', 'Swimming', 'Multi-Sport', 'Other',
];

export default function ForAgentsPage() {
    const navigate = useNavigate();
    const [submitted, setSubmitted] = useState(false);
    const [form, setForm] = useState({
        name: '',
        agency: '',
        sport: '',
        email: '',
    });

    const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));
    const canSubmit = form.name && form.email;

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="nil-page-wrapper">
            <div className="nil-agents-page">

                {/* ── HEADER ── */}
                <div className="nil-agents-header">
                    <h1 className="nil-agents-title">For Agents</h1>
                    <p className="nil-agents-tagline">
                        Connect with athletes who understand their value.
                    </p>
                </div>

                {/* ── WHAT YOU GET ── */}
                <section className="nil-agents-section">
                    <h2 className="nil-agents-section-title">What You Get</h2>
                    <div className="nil-agents-cards">
                        {WHAT_YOU_GET.map((item) => (
                            <div key={item.title} className="nil-agents-feature-card">
                                <div className="nil-agents-feature-icon">
                                    <item.icon size={22} />
                                </div>
                                <div>
                                    <h3>{item.title}</h3>
                                    <p>{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── FORM ── */}
                <section className="nil-agents-section">
                    <h2 className="nil-agents-section-title">Request Access</h2>

                    {submitted ? (
                        <div className="nil-agents-success">
                            <CheckCircle size={36} color="#10B981" />
                            <div>
                                <h3>You're on the list.</h3>
                                <p>We'll reach out as we open access to agents. Thanks for your interest in Front Door.</p>
                            </div>
                        </div>
                    ) : (
                        <form className="nil-agents-form" onSubmit={handleSubmit}>
                            <div className="nil-form-row">
                                <div className="nil-form-group">
                                    <label className="nil-form-label">Name</label>
                                    <input
                                        type="text"
                                        className="nil-form-input"
                                        placeholder="Your full name"
                                        value={form.name}
                                        onChange={(e) => update('name', e.target.value)}
                                    />
                                </div>
                                <div className="nil-form-group">
                                    <label className="nil-form-label">Agency / Organization</label>
                                    <input
                                        type="text"
                                        className="nil-form-input"
                                        placeholder="Your agency or organization"
                                        value={form.agency}
                                        onChange={(e) => update('agency', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="nil-form-row">
                                <div className="nil-form-group">
                                    <label className="nil-form-label">Sports Focus</label>
                                    <select
                                        className="nil-form-input"
                                        value={form.sport}
                                        onChange={(e) => update('sport', e.target.value)}
                                    >
                                        <option value="">Select a sport</option>
                                        {SPORTS.map(s => <option key={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div className="nil-form-group">
                                    <label className="nil-form-label">Email</label>
                                    <input
                                        type="email"
                                        className="nil-form-input"
                                        placeholder="you@agency.com"
                                        value={form.email}
                                        onChange={(e) => update('email', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="nil-agents-form-actions">
                                <button
                                    type="submit"
                                    className="nil-btn-primary"
                                    disabled={!canSubmit}
                                >
                                    Join as an Agent <ArrowRight size={16} />
                                </button>
                            </div>
                        </form>
                    )}
                </section>

                <p className="nil-gs-back">
                    <button className="nil-btn-text" onClick={() => navigate('/get-started')}>
                        ← Back to role selection
                    </button>
                </p>

            </div>
        </div>
    );
}
