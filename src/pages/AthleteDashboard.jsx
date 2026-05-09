import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    DollarSign, Briefcase, FileCheck, ShieldCheck, GraduationCap,
    Plus, ArrowRight, TrendingUp, Calendar, CheckCircle,
    AlertCircle, Clock, Award, PlayCircle
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const TABS = ['Overview', 'Deals', 'Deliverables', 'Compliance', 'Education'];

// ─── Mini Sparkline (SVG) ─────────────────────────────────────────────────────
function Sparkline({ data, color = '#0052FF' }) {
    const W = 240, H = 60, pad = 4;
    const max = Math.max(...data);
    const toX = (i) => pad + (i / (data.length - 1)) * (W - pad * 2);
    const toY = (v) => H - pad - (v / max) * (H - pad * 2);
    const pts = data.map((v, i) => [toX(i), toY(v)]);
    const line = `M ${pts.map(([x, y]) => `${x},${y}`).join(' L ')}`;
    const area = `M ${pad},${H - pad} L ${pts.map(([x, y]) => `${x},${y}`).join(' L ')} L ${toX(data.length - 1)},${H - pad} Z`;
    return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: '60px' }}>
            <defs>
                <linearGradient id={`sp-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.18" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <path d={area} fill={`url(#sp-${color.replace('#', '')})`} />
            <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx={toX(data.length - 1)} cy={toY(data[data.length - 1])} r="3.5" fill={color} />
        </svg>
    );
}

// ─── Circular Progress Ring ───────────────────────────────────────────────────
function RingProgress({ pct, size = 44, strokeWidth = 4, color = '#0052FF' }) {
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
                style={{ transition: 'stroke-dasharray 0.5s ease' }}
            />
            <text x={size / 2} y={size / 2 + 4} textAnchor="middle" fontSize="10" fontWeight="700" fill={color}>
                {pct}%
            </text>
        </svg>
    );
}

// ─── STATUS CONFIG ────────────────────────────────────────────────────────────
const STATUS_CHIP = {
    Active: { bg: '#eff6ff', color: '#2563eb' },
    Completed: { bg: '#ecfdf5', color: '#059669' },
    Pending: { bg: '#fffbeb', color: '#d97706' },
    Overdue: { bg: '#fef2f2', color: '#dc2626' },
};

const DEL_STATUS = {
    Completed: { bg: '#ecfdf5', color: '#059669', pct: 100, bar: '#22c55e' },
    'In Progress': { bg: '#eff6ff', color: '#2563eb', pct: 60, bar: '#0052FF' },
    Upcoming: { bg: '#f0f4ff', color: '#6366f1', pct: 20, bar: '#6366f1' },
    'Pending Approval': { bg: '#fffbeb', color: '#d97706', pct: 75, bar: '#f59e0b' },
    Overdue: { bg: '#fef2f2', color: '#dc2626', pct: 10, bar: '#ef4444' },
    Pending: { bg: '#f9fafb', color: '#6b7280', pct: 0, bar: '#e5e7eb' },
};

const EDU_MODULES = [
    { title: 'NIL Basics & The Law', progress: 100, duration: '15 mins', status: 'Completed', color: '#22c55e' },
    { title: 'Brand Building 101', progress: 80, duration: '20 mins', status: 'In Progress', color: '#0052FF' },
    { title: 'Financial Literacy', progress: 45, duration: '45 mins', status: 'In Progress', color: '#8b5cf6' },
    { title: 'Compliance & Disclosures', progress: 20, duration: '30 mins', status: 'In Progress', color: '#f59e0b' },
    { title: 'Tax Preparation Basics', progress: 0, duration: '25 mins', status: 'Not Started', color: '#9ca3af' },
];

// ─── OVERVIEW TAB ─────────────────────────────────────────────────────────────
function OverviewTab({ deals, deliverables, navigate }) {
    const totalNIL = deals.reduce((s, d) => s + Number(d.dealValue || 0), 0);
    const cashEarnings = deals.reduce((s, d) => s + Number(d.cashValue || 0), 0);
    const activeDeals = deals.filter(d => d.status === 'Active' || d.status === 'Pending').length;
    const pendingDels = deliverables.filter(d => d.status === 'Upcoming' || d.status === 'Pending Approval' || d.status === 'In Progress').length;
    const overdueDels = deliverables.filter(d => d.status === 'Overdue').length;
    const thisMonthGain = deals.filter(d => new Date(d.startDate || Date.now()).getMonth() === new Date().getMonth()).reduce((s, d) => s + Number(d.dealValue || 0), 0);
    const eduPct = Math.round(EDU_MODULES.reduce((s, m) => s + m.progress, 0) / (EDU_MODULES.length * 100) * 100);

    const STAT_CARDS = [
        {
            label: 'Total NIL Value', value: `$${totalNIL.toLocaleString()}`,
            sub: `+$${thisMonthGain.toLocaleString()} this month`, subColor: '#22c55e',
            icon: DollarSign, iconBg: '#e8f5e9', iconColor: '#22c55e',
            sparkData: [0, 800, 2000, 3800, 5500, 6800, 8800, 11200, totalNIL],
            sparkColor: '#22c55e', to: '/tracker'
        },
        {
            label: 'Active Deals', value: activeDeals,
            sub: `${deals.filter(d => d.status === 'Pending').length} pending approval`, subColor: '#6b7280',
            icon: Briefcase, iconBg: '#eff6ff', iconColor: '#0052FF',
            sparkData: [1, 1, 2, 2, 3, 3, 4, activeDeals, activeDeals],
            sparkColor: '#0052FF', to: '/report-deal'
        },
        {
            label: 'Pending Deliverables', value: pendingDels,
            sub: overdueDels > 0 ? `${overdueDels} overdue` : 'All on track', subColor: overdueDels > 0 ? '#ef4444' : '#22c55e',
            icon: FileCheck, iconBg: '#fffbeb', iconColor: '#f59e0b',
            sparkData: [3, 4, 4, 5, 6, 5, 5, pendingDels, pendingDels],
            sparkColor: '#f59e0b', to: '/deliverables'
        },
        {
            label: 'Compliance', value: '95%',
            sub: 'Excellent standing', subColor: '#22c55e',
            icon: ShieldCheck, iconBg: '#f0fdf4', iconColor: '#16a34a',
            sparkData: [80, 82, 85, 88, 90, 91, 93, 95, 95],
            sparkColor: '#22c55e', to: '/compliance'
        },
        {
            label: 'Education', value: `${eduPct}%`,
            sub: `${EDU_MODULES.filter(m => m.status === 'Completed').length} of ${EDU_MODULES.length} modules`, subColor: '#8b5cf6',
            icon: GraduationCap, iconBg: '#ede9fe', iconColor: '#7c3aed',
            sparkData: [0, 10, 20, 30, 45, 55, 60, eduPct, eduPct],
            sparkColor: '#8b5cf6', to: '/education'
        },
    ];

    const RECENT_ACTIVITY = [
        { dot: '#22c55e', label: 'Deal Approved', sub: 'Nike Spring Campaign was confirmed', time: '2 hours ago' },
        { dot: '#8b5cf6', label: 'Course Completed', sub: 'NIL Basics & The Law — 100%', time: '1 day ago' },
        { dot: '#0052FF', label: 'Payment Received', sub: '$800 received from LocalGym', time: '3 days ago' },
        { dot: '#f59e0b', label: 'Deliverable Due Soon', sub: 'Gym Check-In Post — overdue', time: '5 days ago' },
    ];

    const upcomingDels = deliverables
        .filter(d => d.status !== 'Completed')
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* 5-Card Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
                {STAT_CARDS.map(card => (
                    <div
                        key={card.label}
                        onClick={() => navigate(card.to)}
                        style={{
                            background: 'white', borderRadius: '18px', padding: '1.25rem 1.25rem 0.75rem',
                            boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9',
                            cursor: 'pointer', transition: 'transform 0.18s, box-shadow 0.18s', overflow: 'hidden',
                            display: 'flex', flexDirection: 'column', gap: '0.5rem'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'; }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: card.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <card.icon size={14} color={card.iconColor} />
                            </div>
                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{card.label}</span>
                        </div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', lineHeight: 1 }}>{card.value}</div>
                        <div style={{ fontSize: '0.74rem', color: card.subColor, fontWeight: 600 }}>{card.sub}</div>
                        <Sparkline data={card.sparkData} color={card.sparkColor} />
                    </div>
                ))}
            </div>

            {/* Middle Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>

                {/* Financial Tracker Widget */}
                <div style={{ background: 'linear-gradient(135deg, #0033cc 0%, #0052FF 60%, #2563eb 100%)', borderRadius: '20px', padding: '2rem', color: 'white', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '160px', height: '160px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
                    <div style={{ position: 'absolute', bottom: '-30px', left: '60px', width: '100px', height: '100px', background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem', position: 'relative' }}>
                        <div>
                            <div style={{ fontSize: '0.72rem', fontWeight: 700, opacity: 0.65, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.3rem' }}>Financial Tracker</div>
                            <div style={{ fontSize: '2.4rem', fontWeight: 900, lineHeight: 1 }}>${totalNIL.toLocaleString()}</div>
                            <div style={{ fontSize: '0.8rem', opacity: 0.75, marginTop: '0.3rem' }}>Total NIL Value</div>
                        </div>
                        <div style={{ fontSize: '1.5rem', opacity: 0.5 }}>$</div>
                    </div>
                    <div style={{ display: 'flex', gap: '1.5rem', margin: '1.25rem 0', position: 'relative' }}>
                        {[
                            { label: 'Cash', value: `$${cashEarnings.toLocaleString()}`, color: '#4ade80' },
                            { label: 'Non-Cash', value: `$${(totalNIL - cashEarnings).toLocaleString()}`, color: '#a78bfa' },
                            { label: 'Deals', value: activeDeals, color: 'white' },
                        ].map(r => (
                            <div key={r.label}>
                                <div style={{ fontSize: '0.65rem', opacity: 0.6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{r.label}</div>
                                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: r.color }}>{r.value}</div>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={() => navigate('/tracker')}
                        style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', borderRadius: '10px', padding: '0.6rem 1.2rem', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', backdropFilter: 'blur(4px)', position: 'relative' }}
                    >
                        Open Tracker <ArrowRight size={14} />
                    </button>
                </div>

                {/* NIL Calendar Strip */}
                <div style={{ background: 'white', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#111827' }}>NIL Calendar</h3>
                            <p style={{ margin: 0, fontSize: '0.75rem', color: '#9ca3af' }}>Upcoming obligations</p>
                        </div>
                        <Link to="/deliverables" style={{ fontSize: '0.78rem', fontWeight: 600, color: '#0052FF', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                            View All <ArrowRight size={12} />
                        </Link>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                        {upcomingDels.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '1.5rem 0', color: '#9ca3af', fontSize: '0.85rem' }}>🎉 Nothing due — you're all clear!</div>
                        ) : upcomingDels.map(d => {
                            const sc = DEL_STATUS[d.status] || DEL_STATUS.Pending;
                            return (
                                <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.75rem', borderRadius: '10px', border: '1px solid #f1f5f9', background: '#fafafa' }}>
                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: sc.bar, flexShrink: 0 }} />
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontWeight: 600, fontSize: '0.82rem', color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.name}</div>
                                        <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>{d.brand} · {d.date}</div>
                                    </div>
                                    <span style={{ background: sc.bg, color: sc.color, fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '99px', whiteSpace: 'nowrap' }}>{d.status}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Bottom Row: Education Preview + Recent Activity */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>

                {/* Education Progress */}
                <div style={{ background: 'white', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#111827' }}>Education Progress</h3>
                            <p style={{ margin: 0, fontSize: '0.75rem', color: '#9ca3af' }}>{EDU_MODULES.filter(m => m.status === 'Completed').length} of {EDU_MODULES.length} modules complete</p>
                        </div>
                        <Link to="/education" style={{ fontSize: '0.78rem', fontWeight: 600, color: '#8b5cf6', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>Continue <ArrowRight size={12} /></Link>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {EDU_MODULES.slice(0, 4).map(m => (
                            <div key={m.title} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <RingProgress pct={m.progress} size={40} strokeWidth={4} color={m.color} />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontWeight: 600, fontSize: '0.82rem', color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.title}</div>
                                    <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>{m.duration} · {m.status}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div style={{ background: 'white', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
                    <h3 style={{ margin: '0 0 1.25rem', fontSize: '0.95rem', fontWeight: 700, color: '#111827' }}>Recent Activity</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                        {RECENT_ACTIVITY.map((item, i) => (
                            <div key={i} style={{ display: 'flex', gap: '0.75rem', paddingBottom: i < RECENT_ACTIVITY.length - 1 ? '0.9rem' : 0, marginBottom: i < RECENT_ACTIVITY.length - 1 ? '0.9rem' : 0, borderBottom: i < RECENT_ACTIVITY.length - 1 ? '1px solid #f9fafb' : 'none' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.dot, marginTop: '5px', flexShrink: 0 }} />
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#111827' }}>{item.label}</div>
                                    <div style={{ fontSize: '0.78rem', color: '#6b7280', margin: '0.1rem 0' }}>{item.sub}</div>
                                    <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>{item.time}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button onClick={() => navigate('/report-deal')} style={{ width: '100%', marginTop: '1.25rem', background: '#0052FF', color: 'white', border: 'none', borderRadius: '10px', padding: '0.7rem', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <Plus size={15} /> Report New Deal
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── DEALS TAB ────────────────────────────────────────────────────────────────
function DealsTab({ deals, deliverables, navigate }) {
    return (
        <div style={{ background: 'white', borderRadius: '20px', padding: '1.75rem 2rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h2 style={{ margin: 0, fontWeight: 700, fontSize: '1rem', color: '#111827' }}>All Deals</h2>
                <button onClick={() => navigate('/report-deal')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#0052FF', color: 'white', border: 'none', borderRadius: '10px', padding: '0.6rem 1.2rem', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
                    <Plus size={14} /> Report Deal
                </button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                        {['Brand', 'Deal Title', 'Value', 'Type', 'Status', 'Deliverables'].map(h => (
                            <th key={h} style={{ textAlign: 'left', padding: '0.5rem 0.75rem', fontSize: '0.7rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.6px' }}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {deals.map((d, i) => {
                        const sc = STATUS_CHIP[d.status] || STATUS_CHIP['Pending'];
                        const delivCount = deliverables.filter(del => del.dealId === d.id).length;
                        return (
                            <tr key={d.id || i} style={{ borderBottom: '1px solid #f9fafb', transition: 'background 0.12s' }}
                                onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                <td style={{ padding: '0.9rem 0.75rem', fontWeight: 700, color: '#111827', fontSize: '0.875rem' }}>{d.brand}</td>
                                <td style={{ padding: '0.9rem 0.75rem', color: '#6b7280', fontSize: '0.875rem' }}>{d.dealTitle}</td>
                                <td style={{ padding: '0.9rem 0.75rem', fontWeight: 700, color: '#059669', fontSize: '0.875rem' }}>${Number(d.dealValue || 0).toLocaleString()}</td>
                                <td style={{ padding: '0.9rem 0.75rem', color: '#6b7280', fontSize: '0.875rem' }}>{d.dealType || '—'}</td>
                                <td style={{ padding: '0.9rem 0.75rem' }}>
                                    <span style={{ background: sc.bg, color: sc.color, padding: '0.2rem 0.6rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 700 }}>{d.status}</span>
                                </td>
                                <td style={{ padding: '0.9rem 0.75rem', color: '#6b7280', fontSize: '0.875rem' }}>{delivCount} item{delivCount !== 1 ? 's' : ''}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

// ─── DELIVERABLES TAB ─────────────────────────────────────────────────────────
function DeliverablesTab({ deliverables, markDeliverableComplete }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                {deliverables.map(item => {
                    const sc = DEL_STATUS[item.status] || DEL_STATUS.Pending;
                    return (
                        <div key={item.id} style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', border: '1px solid #f1f5f9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                <span style={{ background: sc.bg, color: sc.color, padding: '0.2rem 0.65rem', borderRadius: '99px', fontSize: '0.72rem', fontWeight: 800 }}>{item.status}</span>
                                <span style={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: 600 }}>{item.type}</span>
                            </div>
                            <h3 style={{ margin: '0 0 0.25rem', fontWeight: 700, fontSize: '0.95rem', color: '#111827' }}>{item.name}</h3>
                            <p style={{ margin: '0 0 0.75rem', fontSize: '0.8rem', color: '#6b7280' }}>{item.brand}</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: item.status === 'Overdue' ? '#ef4444' : '#9ca3af', marginBottom: '0.75rem', fontWeight: item.status === 'Overdue' ? 700 : 400 }}>
                                <Calendar size={12} /> Due: {item.date}
                            </div>
                            <div style={{ height: '5px', background: '#f3f4f6', borderRadius: '3px', overflow: 'hidden', marginBottom: '0.5rem' }}>
                                <div style={{ width: `${sc.pct}%`, height: '100%', background: sc.bar, borderRadius: '3px', transition: 'width 0.4s ease' }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.7rem', color: '#9ca3af' }}>{sc.pct}% complete</span>
                                {item.status !== 'Completed' && (
                                    <button onClick={() => markDeliverableComplete(item.id)}
                                        style={{ fontSize: '0.72rem', fontWeight: 700, color: '#059669', background: '#ecfdf5', border: 'none', borderRadius: '7px', padding: '0.25rem 0.65rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                        <CheckCircle size={11} /> Mark Done
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ─── COMPLIANCE TAB ───────────────────────────────────────────────────────────
function ComplianceTab({ deals }) {
    const pending = deals.filter(d => d.disclosureRequired && !d.reportedToSchool);
    const compliant = deals.filter(d => d.reportedToSchool || !d.disclosureRequired);
    const allClear = pending.length === 0;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Status Banner */}
            <div style={{ background: allClear ? 'linear-gradient(135deg, #dcfce7, #f0fdf4)' : 'linear-gradient(135deg, #fefce8, #fffbeb)', border: `1px solid ${allClear ? '#86efac' : '#fde68a'}`, borderRadius: '16px', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: allClear ? '#22c55e' : '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {allClear ? <ShieldCheck size={24} color="white" /> : <AlertCircle size={24} color="white" />}
                </div>
                <div>
                    <div style={{ fontWeight: 800, fontSize: '1rem', color: allClear ? '#15803d' : '#92400e' }}>
                        {allClear ? '✓ All Clear — You\'re Fully Compliant' : `⚠ ${pending.length} Pending Disclosure${pending.length > 1 ? 's' : ''}`}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: allClear ? '#16a34a' : '#b45309', marginTop: '0.15rem' }}>
                        {allClear ? 'All your deals are properly disclosed to your institution.' : 'Report the following deals to your school to stay compliant.'}
                    </div>
                </div>
                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 900, color: allClear ? '#22c55e' : '#f59e0b' }}>{compliant.length}/{deals.length}</div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: allClear ? '#22c55e' : '#f59e0b', textTransform: 'uppercase' }}>Compliant</div>
                </div>
            </div>

            {/* Pending */}
            {pending.length > 0 && (
                <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', border: '1px solid #f1f5f9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <h3 style={{ margin: '0 0 1rem', fontSize: '0.95rem', fontWeight: 700, color: '#111827', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <AlertCircle size={16} color="#f59e0b" /> Pending Disclosures
                    </h3>
                    {pending.map((d, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderRadius: '12px', border: '1px solid #fde68a', background: '#fffbeb', marginBottom: '0.75rem' }}>
                            <div>
                                <h4 style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem', color: '#111827' }}>{d.brand} — {d.dealType}</h4>
                                <p style={{ margin: 0, fontSize: '0.78rem', color: '#b45309', marginTop: '0.2rem' }}>Started: {d.startDate}</p>
                            </div>
                            <button style={{ background: '#f59e0b', color: 'white', border: 'none', borderRadius: '8px', padding: '0.5rem 1rem', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>
                                Report to School
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Past submissions */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', border: '1px solid #f1f5f9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <h3 style={{ margin: '0 0 1rem', fontSize: '0.95rem', fontWeight: 700, color: '#111827' }}>Cleared Deals</h3>
                {compliant.map((d, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', borderRadius: '10px', background: '#f9fafb', marginBottom: '0.5rem' }}>
                        <div>
                            <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827' }}>{d.brand}</span>
                            <span style={{ fontSize: '0.78rem', color: '#9ca3af', marginLeft: '0.5rem' }}>{d.dealType}</span>
                        </div>
                        <span style={{ background: '#ecfdf5', color: '#059669', fontSize: '0.72rem', fontWeight: 800, padding: '0.2rem 0.65rem', borderRadius: '99px' }}>CLEARED</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── EDUCATION TAB ────────────────────────────────────────────────────────────
function EducationTab({ navigate }) {
    const completed = EDU_MODULES.filter(m => m.status === 'Completed').length;
    const totalPct = Math.round(EDU_MODULES.reduce((s, m) => s + m.progress, 0) / (EDU_MODULES.length * 100) * 100);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Progress Banner */}
            <div style={{ background: 'linear-gradient(135deg, #ede9fe, #f5f3ff)', border: '1px solid #c4b5fd', borderRadius: '16px', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                    <RingProgress pct={totalPct} size={64} strokeWidth={6} color="#7c3aed" />
                </div>
                <div>
                    <div style={{ fontWeight: 800, fontSize: '1rem', color: '#4c1d95' }}>Overall Progress</div>
                    <div style={{ fontSize: '0.82rem', color: '#6d28d9', marginTop: '0.2rem' }}>{completed} of {EDU_MODULES.length} modules completed · Keep going!</div>
                </div>
                <button onClick={() => navigate('/education')} style={{ marginLeft: 'auto', background: '#7c3aed', color: 'white', border: 'none', borderRadius: '10px', padding: '0.6rem 1.2rem', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <GraduationCap size={14} /> Open Education Hub
                </button>
            </div>

            {/* Modules */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {EDU_MODULES.map((m, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '1.25rem 1.5rem', background: 'white', borderRadius: '14px', border: '1px solid #f1f5f9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', gap: '1rem', cursor: 'pointer', transition: 'box-shadow 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'}
                        onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: m.progress === 100 ? '#ecfdf5' : '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            {m.progress === 100 ? <Award size={20} color="#059669" /> : <PlayCircle size={20} color="#7c3aed" />}
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#111827', marginBottom: '0.2rem' }}>{m.title}</div>
                            <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{m.duration} · {m.status}</div>
                            <div style={{ height: '5px', background: '#f3f4f6', borderRadius: '3px', overflow: 'hidden', marginTop: '0.5rem' }}>
                                <div style={{ width: `${m.progress}%`, height: '100%', background: m.color, borderRadius: '3px', transition: 'width 0.4s ease' }} />
                            </div>
                        </div>
                        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: m.color }}>{m.progress}%</span>
                            <ArrowRight size={14} color="#9ca3af" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────
export default function AthleteDashboard() {
    const navigate = useNavigate();
    const { currentUser, deals, deliverables, markDeliverableComplete } = useAppContext();
    const [activeTab, setActiveTab] = useState('Overview');

    const name = currentUser?.name?.split(' ')[0] || 'Athlete';

    const renderTab = () => {
        switch (activeTab) {
            case 'Overview': return <OverviewTab deals={deals} deliverables={deliverables} navigate={navigate} />;
            case 'Deals': return <DealsTab deals={deals} deliverables={deliverables} navigate={navigate} />;
            case 'Deliverables': return <DeliverablesTab deliverables={deliverables} markDeliverableComplete={markDeliverableComplete} />;
            case 'Compliance': return <ComplianceTab deals={deals} />;
            case 'Education': return <EducationTab navigate={navigate} />;
            default: return null;
        }
    };

    return (
        <div style={{ padding: '2.25rem 2.5rem', background: '#f8fafc', minHeight: '100vh' }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#0a0a0a', margin: 0, letterSpacing: '-0.5px' }}>
                        Welcome back, {name} 👋
                    </h1>
                    <p style={{ color: '#6b7280', marginTop: '0.3rem', fontSize: '0.95rem' }}>
                        Here's your NIL command center
                    </p>
                </div>
                <button
                    onClick={() => navigate('/report-deal')}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#0052FF', color: 'white', border: 'none', borderRadius: '10px', padding: '0.7rem 1.4rem', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', boxShadow: '0 4px 14px rgba(0,82,255,0.25)' }}>
                    <Plus size={16} /> Report Deal
                </button>
            </div>

            {/* Tab Navigation */}
            <div className="nil-dash-tabs" style={{ marginBottom: '1.75rem' }}>
                {TABS.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`nil-dash-tab${activeTab === tab ? ' active' : ''}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {renderTab()}
        </div>
    );
}
