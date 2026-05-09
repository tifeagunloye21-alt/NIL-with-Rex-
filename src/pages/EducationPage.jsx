import { useState } from 'react';
import { GraduationCap, PlayCircle, Award, ArrowRight, BookOpen, CheckCircle } from 'lucide-react';

const MODULES = [
    {
        title: 'NIL Basics & The Law', progress: 100, duration: '15 mins', status: 'Completed',
        color: '#22c55e', bg: '#ecfdf5', desc: 'Understand the fundamentals of NIL legislation and your rights as a student-athlete.',
        modules: 5, icon: '⚖️'
    },
    {
        title: 'Brand Building 101', progress: 80, duration: '20 mins', status: 'In Progress',
        color: '#0052FF', bg: '#eff6ff', desc: 'Build a compelling personal brand that attracts sponsors and grows your audience.',
        modules: 4, icon: '🎨'
    },
    {
        title: 'Financial Literacy', progress: 45, duration: '45 mins', status: 'In Progress',
        color: '#8b5cf6', bg: '#ede9fe', desc: 'Manage your NIL income with smart budgeting, saving, and investment fundamentals.',
        modules: 6, icon: '💰'
    },
    {
        title: 'Compliance & Disclosures', progress: 20, duration: '30 mins', status: 'In Progress',
        color: '#f59e0b', bg: '#fffbeb', desc: 'Stay within the rules — learn how to properly disclose deals to your institution.',
        modules: 4, icon: '🛡️'
    },
    {
        title: 'Tax Preparation Basics', progress: 0, duration: '25 mins', status: 'Not Started',
        color: '#9ca3af', bg: '#f9fafb', desc: 'Learn how NIL income is taxed and how to prepare for tax season like a pro.',
        modules: 3, icon: '📊'
    },
];

function RingProgress({ pct, size = 72, strokeWidth = 6, color = '#0052FF' }) {
    const r = (size - strokeWidth) / 2;
    const circ = 2 * Math.PI * r;
    const dash = (pct / 100) * circ;
    return (
        <svg width={size} height={size} style={{ flexShrink: 0 }}>
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f3f4f6" strokeWidth={strokeWidth} />
            <circle
                cx={size / 2} cy={size / 2} r={r}
                fill="none" stroke={color} strokeWidth={strokeWidth}
                strokeDasharray={`${dash} ${circ - dash}`}
                strokeLinecap="round"
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
            <text x={size / 2} y={size / 2 + 4} textAnchor="middle" fontSize="12" fontWeight="800" fill={color}>{pct}%</text>
        </svg>
    );
}

export default function EducationPage() {
    const [expanded, setExpanded] = useState(null);
    const completed = MODULES.filter(m => m.status === 'Completed').length;
    const totalPct = Math.round(MODULES.reduce((s, m) => s + m.progress, 0) / (MODULES.length * 100) * 100);

    return (
        <div style={{ padding: '2.25rem 2.5rem', background: '#f8fafc', minHeight: '100vh' }}>

            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#0a0a0a', margin: 0 }}>Education Hub</h1>
                <p style={{ color: '#6b7280', marginTop: '0.3rem', fontSize: '0.95rem' }}>Build your NIL knowledge, one module at a time</p>
            </div>

            {/* Progress Summary */}
            <div style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)', borderRadius: '20px', padding: '2rem 2.5rem', color: 'white', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '2rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-30px', right: '40px', width: '200px', height: '200px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', bottom: '-40px', right: '-20px', width: '140px', height: '140px', background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }} />
                <div style={{ position: 'relative' }}>
                    <svg width={80} height={80}>
                        <circle cx={40} cy={40} r={33} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={7} />
                        <circle cx={40} cy={40} r={33} fill="none" stroke="white" strokeWidth={7}
                            strokeDasharray={`${(totalPct / 100) * 2 * Math.PI * 33} ${2 * Math.PI * 33 * (1 - totalPct / 100)}`}
                            strokeLinecap="round" transform="rotate(-90 40 40)" />
                        <text x={40} y={44} textAnchor="middle" fontSize="14" fontWeight="900" fill="white">{totalPct}%</text>
                    </svg>
                </div>
                <div style={{ position: 'relative' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.2rem' }}>
                        {completed} of {MODULES.length} modules complete
                    </div>
                    <div style={{ opacity: 0.8, fontSize: '0.9rem' }}>
                        {completed === MODULES.length ? '🎓 All done! You\'ve mastered NIL fundamentals.' : 'Keep learning — you\'re building a winning foundation.'}
                    </div>
                    <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
                        {[
                            { label: 'Completed', value: completed, color: '#4ade80' },
                            { label: 'In Progress', value: MODULES.filter(m => m.status === 'In Progress').length, color: '#93c5fd' },
                            { label: 'Not Started', value: MODULES.filter(m => m.status === 'Not Started').length, color: 'rgba(255,255,255,0.5)' },
                        ].map(s => (
                            <div key={s.label}>
                                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                                <div style={{ fontSize: '0.72rem', opacity: 0.75, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Module Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {MODULES.map((m, i) => (
                    <div key={i}
                        style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', border: '1px solid #f1f5f9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', cursor: 'pointer', transition: 'box-shadow 0.15s, transform 0.15s' }}
                        onClick={() => setExpanded(expanded === i ? null : i)}
                        onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                        onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                            {/* Icon */}
                            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: m.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
                                {m.icon}
                            </div>
                            {/* Info */}
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.3rem' }}>
                                    <h3 style={{ margin: 0, fontWeight: 700, fontSize: '1rem', color: '#111827' }}>{m.title}</h3>
                                    <span style={{ background: m.status === 'Completed' ? '#ecfdf5' : m.status === 'Not Started' ? '#f9fafb' : '#eff6ff', color: m.status === 'Completed' ? '#059669' : m.status === 'Not Started' ? '#9ca3af' : '#2563eb', fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '99px' }}>{m.status}</span>
                                </div>
                                <div style={{ fontSize: '0.78rem', color: '#9ca3af' }}>{m.duration} · {m.modules} sections</div>
                                {/* Progress bar */}
                                <div style={{ marginTop: '0.6rem', height: '5px', background: '#f3f4f6', borderRadius: '3px', overflow: 'hidden' }}>
                                    <div style={{ width: `${m.progress}%`, height: '100%', background: m.color, borderRadius: '3px', transition: 'width 0.5s ease' }} />
                                </div>
                            </div>
                            {/* Ring + CTA */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
                                <RingProgress pct={m.progress} size={52} strokeWidth={5} color={m.color} />
                                <button
                                    onClick={e => { e.stopPropagation(); }}
                                    style={{ background: m.progress === 100 ? '#ecfdf5' : m.color, color: m.progress === 100 ? '#059669' : 'white', border: 'none', borderRadius: '10px', padding: '0.55rem 1rem', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', whiteSpace: 'nowrap' }}>
                                    {m.progress === 100 ? <><CheckCircle size={13} /> Review</> : m.progress === 0 ? <><PlayCircle size={13} /> Start</> : <><PlayCircle size={13} /> Continue</>}
                                </button>
                            </div>
                        </div>
                        {/* Expanded description */}
                        {expanded === i && (
                            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #f3f4f6', fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.6 }}>
                                {m.desc}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
