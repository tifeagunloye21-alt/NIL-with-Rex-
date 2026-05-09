import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowRight, ChevronRight, TrendingUp, Zap, Star,
    DollarSign, BarChart3, Users, Lightbulb
} from 'lucide-react';

const SPORTS = ['Football', 'Basketball', 'Soccer', 'Baseball', 'Softball', 'Track & Field', 'Swimming', 'Tennis', 'Volleyball', 'Golf', 'Wrestling', 'Other'];
const LEVELS = ['D1', 'D2', 'D3', 'NAIA', 'JUCO'];
const CONTENT_TYPES = ['Lifestyle', 'Sports Performance', 'Mixed', 'Gaming', 'Fashion/Style'];

const SNAPSHOT_DATA = {
    low: { local: '$200–$500', brand: '$500–$1,500', content: '$100–$400' },
    medium: { local: '$500–$2,000', brand: '$1,500–$5,000', content: '$400–$1,200' },
    high: { local: '$1,000–$5,000', brand: '$5,000–$20,000', content: '$1,200–$5,000' },
};

function getValueTier(followers) {
    if (followers < 5000) return 'low';
    if (followers < 25000) return 'medium';
    return 'high';
}

const OPPORTUNITY_CARDS = [
    {
        icon: DollarSign,
        deal: 'Local Business Deals',
        value: 'Entry–Mid Level',
        effort: 'Low',
        growth: 'Steady',
        color: '#10B981',
    },
    {
        icon: Star,
        deal: 'Brand Partnerships',
        value: 'Mid–High Level',
        effort: 'Medium',
        growth: 'High',
        color: 'var(--color-accent)',
    },
    {
        icon: TrendingUp,
        deal: 'Content & Creator Deals',
        value: 'Scales with audience',
        effort: 'High',
        growth: 'Exponential',
        color: '#F59E0B',
    },
];

const INSIGHTS = [
    { icon: Users, text: 'Audience size matters, but engagement rate matters more.' },
    { icon: BarChart3, text: 'Consistent posting frequency builds long-term brand value.' },
    { icon: Lightbulb, text: 'Niche-specific athletes often out-earn high-follower generalists.' },
    { icon: Zap, text: 'D1 visibility drives more inbound interest from brands.' },
];

export default function ExploreNILPage() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        sport: '',
        level: '',
        followers: 5000,
        contentType: '',
    });

    const tier = getValueTier(form.followers);
    const snap = SNAPSHOT_DATA[tier];

    const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

    const canAdvance = form.sport && form.level && form.contentType;

    return (
        <div className="nil-page-wrapper">
            <div className="nil-explore-page">

                {/* ── PAGE HEADER ── */}
                <div className="nil-explore-header">
                    <div className="nil-explore-breadcrumb">
                        <span className={step >= 1 ? 'active' : ''}>Inputs</span>
                        <ChevronRight size={14} />
                        <span className={step >= 2 ? 'active' : ''}>Your Snapshot</span>
                        <ChevronRight size={14} />
                        <span className={step >= 3 ? 'active' : ''}>Opportunities</span>
                        <ChevronRight size={14} />
                        <span className={step >= 4 ? 'active' : ''}>Insights</span>
                    </div>
                    <h1 className="nil-explore-title">Explore Your NIL Value</h1>
                    <p className="nil-explore-subtitle">
                        Answer a few questions and we'll show you what's possible for an athlete like you.
                    </p>
                </div>

                {/* ── STEP 1: INPUTS ── */}
                {step === 1 && (
                    <div className="nil-explore-card">
                        <h2 className="nil-card-heading">Tell us about yourself</h2>

                        <div className="nil-explore-form">
                            <div className="nil-explore-field">
                                <label>Your Sport</label>
                                <select value={form.sport} onChange={e => update('sport', e.target.value)} className="nil-form-input">
                                    <option value="">Select a sport</option>
                                    {SPORTS.map(s => <option key={s}>{s}</option>)}
                                </select>
                            </div>

                            <div className="nil-explore-field">
                                <label>School Level</label>
                                <div className="nil-pill-group">
                                    {LEVELS.map(l => (
                                        <button
                                            key={l}
                                            type="button"
                                            className={`nil-pill-option${form.level === l ? ' selected' : ''}`}
                                            onClick={() => update('level', l)}
                                        >
                                            {l}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="nil-explore-field">
                                <label>
                                    Social Following
                                    <strong className="nil-follower-count"> {form.followers.toLocaleString()} followers</strong>
                                </label>
                                <input
                                    type="range"
                                    min={500}
                                    max={500000}
                                    step={500}
                                    value={form.followers}
                                    onChange={e => update('followers', Number(e.target.value))}
                                    className="nil-slider"
                                />
                                <div className="nil-slider-labels">
                                    <span>500</span><span>500k+</span>
                                </div>
                            </div>

                            <div className="nil-explore-field">
                                <label>Content Type</label>
                                <div className="nil-pill-group">
                                    {CONTENT_TYPES.map(t => (
                                        <button
                                            key={t}
                                            type="button"
                                            className={`nil-pill-option${form.contentType === t ? ' selected' : ''}`}
                                            onClick={() => update('contentType', t)}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="nil-explore-actions">
                            <button
                                className="nil-btn-primary"
                                onClick={() => setStep(2)}
                                disabled={!canAdvance}
                            >
                                See My NIL Snapshot <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                )}

                {/* ── STEP 2: SNAPSHOT ── */}
                {step === 2 && (
                    <div className="nil-explore-card">
                        <div className="nil-snapshot-header">
                            <h2 className="nil-card-heading">Your NIL Snapshot</h2>
                            <p className="nil-snapshot-sub">
                                Based on a <strong>{form.level}</strong> {form.sport} athlete
                                with <strong>{form.followers.toLocaleString()} followers</strong> creating {form.contentType} content.
                            </p>
                        </div>

                        <div className="nil-snapshot-grid">
                            <div className="nil-snapshot-item">
                                <span className="nil-snapshot-label">Local Deals</span>
                                <span className="nil-snapshot-value">{snap.local}</span>
                                <span className="nil-snapshot-hint">per deal</span>
                            </div>
                            <div className="nil-snapshot-item nil-snapshot-featured">
                                <span className="nil-snapshot-label">Brand Partnerships</span>
                                <span className="nil-snapshot-value">{snap.brand}</span>
                                <span className="nil-snapshot-hint">per deal</span>
                            </div>
                            <div className="nil-snapshot-item">
                                <span className="nil-snapshot-label">Content Deals</span>
                                <span className="nil-snapshot-value">{snap.content}</span>
                                <span className="nil-snapshot-hint">per deal</span>
                            </div>
                        </div>

                        <div className="nil-explore-actions">
                            <button className="nil-btn-outline" onClick={() => setStep(1)}>← Edit Inputs</button>
                            <button className="nil-btn-primary" onClick={() => setStep(3)}>
                                See Opportunities <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                )}

                {/* ── STEP 3: OPPORTUNITY CARDS ── */}
                {step === 3 && (
                    <div className="nil-explore-card">
                        <h2 className="nil-card-heading">Your Opportunities</h2>
                        <div className="nil-opp-grid">
                            {OPPORTUNITY_CARDS.map((card) => (
                                <div key={card.deal} className="nil-opp-card">
                                    <div className="nil-opp-icon" style={{ background: card.color }}>
                                        <card.icon size={22} color="white" />
                                    </div>
                                    <h3 className="nil-opp-deal">{card.deal}</h3>
                                    <div className="nil-opp-stats">
                                        <div className="nil-opp-stat">
                                            <span className="nil-opp-stat-label">Value</span>
                                            <span className="nil-opp-stat-val">{card.value}</span>
                                        </div>
                                        <div className="nil-opp-stat">
                                            <span className="nil-opp-stat-label">Effort</span>
                                            <span className="nil-opp-stat-val">{card.effort}</span>
                                        </div>
                                        <div className="nil-opp-stat">
                                            <span className="nil-opp-stat-label">Growth</span>
                                            <span className="nil-opp-stat-val">{card.growth}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="nil-explore-actions">
                            <button className="nil-btn-outline" onClick={() => setStep(2)}>← Back</button>
                            <button className="nil-btn-primary" onClick={() => setStep(4)}>
                                Why This Matters <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                )}

                {/* ── STEP 4: INSIGHTS ── */}
                {step === 4 && (
                    <div className="nil-explore-card">
                        <h2 className="nil-card-heading">Why This Matters</h2>
                        <p className="nil-insight-intro">
                            NIL value isn't random — it's driven by specific, measurable factors. Here's what shapes your earning potential:
                        </p>
                        <div className="nil-insight-grid">
                            {INSIGHTS.map((ins) => (
                                <div key={ins.text} className="nil-insight-item">
                                    <div className="nil-insight-icon">
                                        <ins.icon size={20} />
                                    </div>
                                    <p>{ins.text}</p>
                                </div>
                            ))}
                        </div>

                        <div className="nil-insight-cta-box">
                            <p>Ready to take action? FrontDoor is the platform built to help you get there.</p>
                        </div>

                        <div className="nil-explore-actions">
                            <button className="nil-btn-primary" onClick={() => navigate('/dashboard')}>
                                Go to Dashboard <ArrowRight size={16} />
                            </button>
                            <button className="nil-btn-outline" onClick={() => navigate('/')}>
                                Back to Home
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
