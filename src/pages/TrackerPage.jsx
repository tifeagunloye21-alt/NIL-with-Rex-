import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Plus, ArrowRight, CheckCircle, AlertCircle, Clock, DollarSign, Users, Zap } from 'lucide-react';

const TIME_TABS = ['All Time', '3 Months', '1 Month', '1 Week', '1 Day'];

// ─── CHART ────────────────────────────────────────────────────────────────────

const CHART_DATA = {
    total: {
        'All Time': [0, 800, 2000, 3800, 5500, 6800, 7500, 8800, 9600, 11200, 12900, 14650],
        '3 Months': [8000, 9600, 11200, 12900, 14000, 14650],
        '1 Month': [12000, 12800, 13400, 13900, 14300, 14650],
        '1 Week': [14100, 14250, 14350, 14450, 14550, 14650],
        '1 Day': [14580, 14600, 14615, 14630, 14640, 14650],
    },
    cash: {
        'All Time': [0, 500, 1200, 2800, 4000, 5200, 6000, 7000, 7800, 9100, 9900, 10500],
        '3 Months': [6500, 7800, 9100, 9900, 10200, 10500],
        '1 Month': [9200, 9600, 10000, 10200, 10400, 10500],
        '1 Week': [10300, 10380, 10430, 10460, 10490, 10500],
        '1 Day': [10490, 10495, 10498, 10500, 10500, 10500],
    },
    nonCash: {
        'All Time': [0, 300, 800, 1000, 1500, 1600, 1500, 1800, 1800, 2100, 3000, 4150],
        '3 Months': [1500, 1800, 2100, 3000, 3800, 4150],
        '1 Month': [2800, 3200, 3400, 3700, 3950, 4150],
        '1 Week': [3900, 3970, 4020, 4080, 4120, 4150],
        '1 Day': [4140, 4143, 4147, 4149, 4150, 4150],
    },
};

const CHART_LABELS = {
    'All Time': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Jun'],
    '3 Months': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    '1 Month': ['Apr 1', 'Apr 8', 'Apr 15', 'Apr 22', 'Apr 29', 'May 5'],
    '1 Week': ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Today'],
    '1 Day': ['9am', '11am', '1pm', '3pm', '5pm', 'Now'],
};

const GRAPH_COLORS = { total: '#0052FF', cash: '#10b981', nonCash: '#8b5cf6' };
const GRAPH_LABELS = { total: 'Total NIL Value', cash: 'Cash Only', nonCash: 'Non-Monetary' };

function LineChart({ range, mode }) {
    const data = CHART_DATA[mode][range] || CHART_DATA.total['All Time'];
    const labels = CHART_LABELS[range];
    const W = 820, H = 200, padL = 72, padB = 32, padR = 20, padT = 20;
    const innerW = W - padL - padR;
    const innerH = H - padB - padT;
    const maxVal = Math.max(...Object.values(CHART_DATA.total['All Time'])) * 1.08;
    const yTicks = [0, 4000, 8000, 12000, 16000];
    const color = GRAPH_COLORS[mode];

    const toX = (i) => padL + (i / (data.length - 1)) * innerW;
    const toY = (v) => padT + innerH - (v / maxVal) * innerH;

    const pts = data.map((v, i) => [toX(i), toY(v)]);
    const linePath = `M ${pts.map(([x, y]) => `${x},${y}`).join(' L ')}`;
    const areaPath = `M ${padL},${padT + innerH} L ${pts.map(([x, y]) => `${x},${y}`).join(' L ')} L ${toX(data.length - 1)},${padT + innerH} Z`;

    return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: '200px' }}>
            <defs>
                <linearGradient id={`grad-${mode}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.13" />
                    <stop offset="100%" stopColor={color} stopOpacity="0.01" />
                </linearGradient>
            </defs>
            {yTicks.map(tick => {
                const y = toY(tick);
                return (
                    <g key={tick}>
                        <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="#f3f4f6" strokeWidth="1" />
                        <text x={padL - 8} y={y + 4} textAnchor="end" fontSize="10" fill="#9ca3af">
                            {tick === 0 ? '0' : `$${(tick / 1000).toFixed(0)}k`}
                        </text>
                    </g>
                );
            })}
            <path d={areaPath} fill={`url(#grad-${mode})`} />
            <path d={linePath} fill="none" stroke={color} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
            {data.map((v, i) => (
                <text key={i} x={toX(i)} y={H - 4} textAnchor="middle" fontSize="10" fill="#9ca3af">{labels[i]}</text>
            ))}
            <circle cx={toX(data.length - 1)} cy={toY(data[data.length - 1])} r="4.5" fill={color} />
        </svg>
    );
}

// ─── STATUS HELPERS ───────────────────────────────────────────────────────────

const STATUS_CHIP = {
    Active: { bg: '#eff6ff', color: '#2563eb' },
    Completed: { bg: '#ecfdf5', color: '#059669' },
    Pending: { bg: '#fffbeb', color: '#d97706' },
    Overdue: { bg: '#fef2f2', color: '#dc2626' },
};
const DEL_STATUS = {
    Completed: { bg: '#ecfdf5', color: '#059669', pct: 100, barColor: '#22c55e' },
    'In Progress': { bg: '#eff6ff', color: '#2563eb', pct: 60, barColor: '#0052FF' },
    Upcoming: { bg: '#eff6ff', color: '#2563eb', pct: 20, barColor: '#0052FF' },
    'Pending Approval': { bg: '#fffbeb', color: '#d97706', pct: 75, barColor: '#f59e0b' },
    Overdue: { bg: '#fef2f2', color: '#dc2626', pct: 100, barColor: '#ef4444' },
    Pending: { bg: '#f9fafb', color: '#6b7280', pct: 0, barColor: '#e5e7eb' },
};

const SOURCE_LABEL = { athlete: '🔵 Athlete', agent: '🟣 Agent', both: '✅ Both' };

const EVENT_CONFIG = {
    deal_reported: { icon: Plus, color: '#0052FF', bg: '#eff6ff', label: 'Deal Reported' },
    deal_matched: { icon: CheckCircle, color: '#059669', bg: '#ecfdf5', label: 'Deal Matched' },
    deal_completed: { icon: CheckCircle, color: '#059669', bg: '#ecfdf5', label: 'Deal Completed' },
    deliverable_done: { icon: CheckCircle, color: '#059669', bg: '#ecfdf5', label: 'Deliverable Done' },
    payment_received: { icon: DollarSign, color: '#059669', bg: '#ecfdf5', label: 'Payment Received' },
    default: { icon: AlertCircle, color: '#d97706', bg: '#fffbeb', label: 'Update' },
};

function timeAgo(iso) {
    const diff = Date.now() - new Date(iso).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 30) return `${days} days ago`;
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function TrackerPage() {
    const { deals, deliverables, activityLog, currentUser, markDeliverableComplete } = useAppContext();
    const navigate = useNavigate();
    const [activeRange, setActiveRange] = useState('All Time');
    const [graphMode, setGraphMode] = useState('total');

    // Role gate — redirect non-athletes
    if (currentUser && currentUser.role !== 'athlete') {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: '1rem' }}>
                <AlertCircle size={40} color="#ef4444" />
                <h2 style={{ color: '#111827', margin: 0 }}>Access Restricted</h2>
                <p style={{ color: '#6b7280' }}>The Financial Tracker is only available to athlete accounts.</p>
            </div>
        );
    }

    const totalNIL = deals.reduce((s, d) => s + Number(d.dealValue || 0), 0);
    const cashEarnings = deals.reduce((s, d) => s + Number(d.cashValue || 0), 0);
    const nonMonetary = deals.reduce((s, d) => s + Number(d.nonCashValue || 0), 0);
    const activeDs = deals.filter(d => d.status === 'Active' || d.status === 'Pending').length;
    const pendingDels = deliverables.filter(d => d.status === 'Upcoming' || d.status === 'Pending Approval' || d.status === 'In Progress').length;

    const STATS = [
        { label: 'Total NIL Value', value: `$${totalNIL.toLocaleString()}`, sub: '+$2,450 this month', subColor: '#22c55e' },
        { label: 'Cash Earnings', value: `$${cashEarnings.toLocaleString()}`, sub: `${totalNIL ? Math.round(cashEarnings / totalNIL * 100) : 0}% of total`, subColor: '#6b7280' },
        { label: 'Non-Monetary Value', value: `$${nonMonetary.toLocaleString()}`, sub: 'Products & services', subColor: '#6b7280' },
        { label: 'Active Deals', value: activeDs, sub: `${deals.filter(d => d.status === 'Pending').length} pending approval`, subColor: '#6b7280' },
        { label: 'Pending Deliverables', value: pendingDels, sub: `${deliverables.filter(d => d.status === 'Overdue').length} overdue`, subColor: deliverables.filter(d => d.status === 'Overdue').length > 0 ? '#ef4444' : '#6b7280' },
    ];

    return (
        <div style={{ padding: '2.25rem 2.5rem', background: '#f8fafc', minHeight: '100vh' }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#0a0a0a', margin: 0 }}>Financial Tracker</h1>
                    <p style={{ color: '#6b7280', marginTop: '0.3rem', fontSize: '0.95rem' }}>Track your NIL earnings, deal performance, and deliverables</p>
                </div>
                <button onClick={() => navigate('/report-deal')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#0052FF', color: 'white', border: 'none', borderRadius: '10px', padding: '0.75rem 1.4rem', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 4px 14px rgba(0,82,255,0.25)' }}>
                    <Plus size={16} /> Report New Deal
                </button>
            </div>

            {/* Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', marginBottom: '1.75rem' }}>
                {STATS.map(card => (
                    <div key={card.label} style={{ background: 'white', borderRadius: '14px', padding: '1.2rem 1.35rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
                        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '0.5rem' }}>{card.label}</div>
                        <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#111827', lineHeight: 1 }}>{card.value}</div>
                        <div style={{ fontSize: '0.75rem', color: card.subColor, marginTop: '0.3rem', fontWeight: 500 }}>{card.sub}</div>
                    </div>
                ))}
            </div>

            {/* Chart Card */}
            <div style={{ background: 'white', borderRadius: '20px', padding: '1.75rem 2rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', marginBottom: '1.75rem', border: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div>
                        <h2 style={{ margin: 0, fontWeight: 700, fontSize: '1rem', color: '#111827' }}>NIL Value Over Time</h2>
                        <p style={{ margin: '0.2rem 0 0', color: '#9ca3af', fontSize: '0.8rem' }}>Track your earnings growth and deal momentum</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        {/* Graph mode toggle */}
                        <div style={{ display: 'flex', background: '#f3f4f6', borderRadius: '8px', padding: '0.2rem', gap: '0.1rem' }}>
                            {Object.entries(GRAPH_LABELS).map(([key, label]) => (
                                <button key={key} onClick={() => setGraphMode(key)}
                                    style={{ background: graphMode === key ? GRAPH_COLORS[key] : 'transparent', color: graphMode === key ? 'white' : '#6b7280', border: 'none', borderRadius: '6px', padding: '0.3rem 0.7rem', fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer', transition: 'all 0.15s' }}>
                                    {label}
                                </button>
                            ))}
                        </div>
                        {/* Time range tabs */}
                        <div style={{ display: 'flex', background: '#f3f4f6', borderRadius: '8px', padding: '0.2rem', gap: '0.1rem' }}>
                            {TIME_TABS.map(t => (
                                <button key={t} onClick={() => setActiveRange(t)}
                                    style={{ background: activeRange === t ? '#0052FF' : 'transparent', color: activeRange === t ? 'white' : '#6b7280', border: 'none', borderRadius: '6px', padding: '0.3rem 0.7rem', fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer', transition: 'all 0.15s' }}>
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <LineChart range={activeRange} mode={graphMode} />
            </div>

            {/* Deal Activity Table */}
            <div style={{ background: 'white', borderRadius: '20px', padding: '1.75rem 2rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', marginBottom: '1.75rem', border: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <h2 style={{ margin: 0, fontWeight: 700, fontSize: '1rem', color: '#111827' }}>Deal Activity</h2>
                    <Link to="/report-deal" style={{ fontSize: '0.82rem', fontWeight: 600, color: '#0052FF', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>View All Deals <ArrowRight size={13} /></Link>
                </div>
                {deals.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem 0', color: '#9ca3af' }}>
                        <Zap size={36} style={{ marginBottom: '0.75rem', opacity: 0.4 }} />
                        <p style={{ margin: 0, fontWeight: 600 }}>No deals reported yet</p>
                        <p style={{ margin: '0.5rem 0 1rem', fontSize: '0.875rem' }}>Start tracking your NIL journey by reporting your first deal.</p>
                        <button onClick={() => navigate('/report-deal')} style={{ background: '#0052FF', color: 'white', border: 'none', borderRadius: '8px', padding: '0.6rem 1.2rem', fontWeight: 600, cursor: 'pointer' }}>Report a Deal</button>
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                                {['Brand', 'Cash Value', 'Non-Cash', 'Type', 'Status', 'Source', 'Deliverables', 'Date'].map(h => (
                                    <th key={h} style={{ textAlign: 'left', padding: '0.5rem 0.75rem', fontSize: '0.72rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.6px' }}>{h}</th>
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
                                        <td style={{ padding: '0.9rem 0.75rem', fontWeight: 700, color: '#059669', fontSize: '0.875rem' }}>${Number(d.cashValue || 0).toLocaleString()}</td>
                                        <td style={{ padding: '0.9rem 0.75rem', color: '#8b5cf6', fontWeight: 600, fontSize: '0.875rem' }}>{Number(d.nonCashValue || 0) > 0 ? `$${Number(d.nonCashValue).toLocaleString()}` : '—'}</td>
                                        <td style={{ padding: '0.9rem 0.75rem', color: '#6b7280', fontSize: '0.875rem' }}>{d.dealType || '—'}</td>
                                        <td style={{ padding: '0.9rem 0.75rem' }}>
                                            <span style={{ background: sc.bg, color: sc.color, padding: '0.2rem 0.6rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 700 }}>{d.status}</span>
                                        </td>
                                        <td style={{ padding: '0.9rem 0.75rem', fontSize: '0.8rem', color: '#6b7280' }}>{SOURCE_LABEL[d.reportedSource] || '—'}</td>
                                        <td style={{ padding: '0.9rem 0.75rem', color: '#6b7280', fontSize: '0.875rem' }}>{delivCount} item{delivCount !== 1 ? 's' : ''}</td>
                                        <td style={{ padding: '0.9rem 0.75rem', color: '#9ca3af', fontSize: '0.82rem' }}>{d.startDate}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Upcoming Deliverables 2×2 Grid */}
            <div style={{ background: 'white', borderRadius: '20px', padding: '1.75rem 2rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', marginBottom: '1.75rem', border: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <h2 style={{ margin: 0, fontWeight: 700, fontSize: '1rem', color: '#111827' }}>Upcoming Deliverables</h2>
                    <Link to="/deliverables" style={{ fontSize: '0.82rem', fontWeight: 600, color: '#0052FF', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>Manage All <ArrowRight size={13} /></Link>
                </div>
                {deliverables.length === 0 ? (
                    <p style={{ color: '#9ca3af', textAlign: 'center', padding: '2rem 0', margin: 0 }}>No deliverables yet. Add deliverables when reporting a deal.</p>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        {deliverables.slice(0, 4).map((d) => {
                            const sc = DEL_STATUS[d.status] || DEL_STATUS['Pending'];
                            return (
                                <div key={d.id} style={{ padding: '1.25rem 1.5rem', border: '1px solid #f1f5f9', borderRadius: '14px', background: '#fafafa' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                                        <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#111827' }}>{d.name}</span>
                                        <span style={{ background: sc.bg, color: sc.color, padding: '0.15rem 0.55rem', borderRadius: '99px', fontSize: '0.72rem', fontWeight: 700, whiteSpace: 'nowrap', marginLeft: '0.5rem' }}>{d.status}</span>
                                    </div>
                                    <div style={{ fontSize: '0.78rem', color: '#9ca3af', marginBottom: '0.75rem' }}>📅 Due: {d.date}</div>
                                    <div style={{ height: '6px', background: '#e5e7eb', borderRadius: '3px', overflow: 'hidden', marginBottom: '0.35rem' }}>
                                        <div style={{ width: `${sc.pct}%`, height: '100%', background: sc.barColor, borderRadius: '3px', transition: 'width 0.4s ease' }} />
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{sc.pct}% Complete</span>
                                        {d.status !== 'Completed' && (
                                            <button onClick={() => markDeliverableComplete(d.id)}
                                                style={{ fontSize: '0.72rem', fontWeight: 700, color: '#059669', background: '#ecfdf5', border: 'none', borderRadius: '6px', padding: '0.2rem 0.55rem', cursor: 'pointer' }}>
                                                Mark Complete
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Activity Timeline */}
            <div style={{ background: 'white', borderRadius: '20px', padding: '1.75rem 2rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
                <h2 style={{ margin: '0 0 1.5rem', fontWeight: 700, fontSize: '1rem', color: '#111827' }}>Activity Timeline</h2>
                {activityLog.length === 0 ? (
                    <p style={{ color: '#9ca3af', margin: 0 }}>No activity yet.</p>
                ) : (
                    <div style={{ position: 'relative' }}>
                        {/* Vertical line */}
                        <div style={{ position: 'absolute', left: '15px', top: 0, bottom: 0, width: '2px', background: '#f3f4f6' }} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {activityLog.slice(0, 8).map((event, i) => {
                                const cfg = EVENT_CONFIG[event.eventType] || EVENT_CONFIG.default;
                                return (
                                    <div key={event.id || i} style={{ display: 'flex', gap: '1rem', paddingLeft: '0.5rem' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1 }}>
                                            <cfg.icon size={14} color={cfg.color} />
                                        </div>
                                        <div style={{ paddingTop: '0.3rem' }}>
                                            <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827' }}>{event.message}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.2rem' }}>{timeAgo(event.timestamp)} · {event.role}</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
