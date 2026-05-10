import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Plus, ArrowRight, CheckCircle, AlertCircle, DollarSign, TrendingUp, Zap, Shield, Clock, Star } from 'lucide-react';

const TABS = ['ALL', '3M', '1M', '1W', '1D'];

const CHART_DATA = {
  ALL: [0, 800, 2000, 3800, 5500, 6800, 8800, 11200, 12900, 14650],
  '3M': [8000, 9600, 11200, 12900, 14000, 14650],
  '1M': [12000, 12800, 13400, 13900, 14300, 14650],
  '1W': [14100, 14250, 14350, 14450, 14550, 14650],
  '1D': [14580, 14600, 14615, 14630, 14640, 14650],
};

const CHART_LABELS = {
  ALL: ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov', 'Jan', 'Mar', 'May', 'Now'],
  '3M': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Now'],
  '1M': ['Apr 1', 'Apr 8', 'Apr 15', 'Apr 22', 'Apr 29', 'Now'],
  '1W': ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Now'],
  '1D': ['9am', '11am', '1pm', '3pm', '5pm', 'Now'],
};

function PremiumChart({ tab, totalNIL }) {
  const [hover, setHover] = useState(null);
  const svgRef = useRef(null);
  const data = CHART_DATA[tab];
  const labels = CHART_LABELS[tab];
  const W = 900, H = 220, padL = 0, padR = 0, padT = 20, padB = 36;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const maxVal = 16000;
  const toX = i => padL + (i / (data.length - 1)) * innerW;
  const toY = v => padT + innerH - (v / maxVal) * innerH;
  const pts = data.map((v, i) => [toX(i), toY(v)]);
  const linePath = `M ${pts.map(([x, y]) => `${x},${y}`).join(' L ')}`;
  const areaPath = `M ${padL},${padT + innerH} L ${pts.map(([x, y]) => `${x},${y}`).join(' L ')} L ${toX(data.length - 1)},${padT + innerH} Z`;
  const gain = data[data.length - 1] - data[0];
  const gainPct = data[0] > 0 ? ((gain / data[0]) * 100).toFixed(1) : gain > 0 ? 'New' : '0.0';
  const isUp = gain >= 0;

  const handleMouseMove = e => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * W;
    let closest = 0;
    let minDist = Infinity;
    pts.forEach(([px], i) => {
      const d = Math.abs(px - x);
      if (d < minDist) { minDist = d; closest = i; }
    });
    setHover(closest);
  };

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.75rem', marginBottom: '0.25rem' }}>
        <div style={{ fontSize: '3rem', fontWeight: 900, color: '#fff', lineHeight: 1, letterSpacing: '-2px' }}>
          {hover !== null ? `$${data[hover].toLocaleString()}` : `$${totalNIL.toLocaleString()}`}
        </div>
        <div style={{ paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '1rem', fontWeight: 700, color: isUp ? '#00d4a1' : '#ff6b6b' }}>
          <TrendingUp size={16} />
          {isUp ? '+' : ''}{gainPct}%
        </div>
      </div>
      <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', marginBottom: '1.5rem' }}>
        {hover !== null ? labels[hover] : 'Total NIL Value'}
      </div>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: '100%', height: '180px', cursor: 'crosshair' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00d4a1" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#00d4a1" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#chartGrad)" />
        <path d={linePath} fill="none" stroke="#00d4a1" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        {hover !== null && (
          <>
            <line x1={pts[hover][0]} y1={padT} x2={pts[hover][0]} y2={padT + innerH} stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="4 3" />
            <circle cx={pts[hover][0]} cy={pts[hover][1]} r="6" fill="#00d4a1" />
            <circle cx={pts[hover][0]} cy={pts[hover][1]} r="10" fill="rgba(0,212,161,0.2)" />
          </>
        )}
        {!hover && <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="5" fill="#00d4a1" />}
        {labels.map((l, i) => (
          <text key={i} x={toX(i)} y={H - 4} textAnchor={i === 0 ? 'start' : i === labels.length - 1 ? 'end' : 'middle'} fontSize="11" fill="rgba(255,255,255,0.3)" fontFamily="Inter,sans-serif">{l}</text>
        ))}
      </svg>
    </div>
  );
}

const SC = {
  Active: { bg: 'rgba(0,212,161,0.12)', color: '#00d4a1' },
  Completed: { bg: 'rgba(0,212,161,0.12)', color: '#00d4a1' },
  Pending: { bg: 'rgba(255,184,0,0.12)', color: '#ffb800' },
  Overdue: { bg: 'rgba(255,80,80,0.12)', color: '#ff5050' },
};

const DEL_SC = {
  Completed: { color: '#00d4a1', pct: 100 },
  'In Progress': { color: '#3d9bff', pct: 60 },
  Upcoming: { color: '#3d9bff', pct: 20 },
  'Pending Approval': { color: '#ffb800', pct: 75 },
  Overdue: { color: '#ff5050', pct: 10 },
  Pending: { color: '#555', pct: 0 },
};

function timeAgo(iso) {
  const d = Math.floor((Date.now() - new Date(iso)) / 86400000);
  if (d === 0) return 'Today';
  if (d === 1) return 'Yesterday';
  if (d < 30) return `${d}d ago`;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function TrackerPage() {
  const { myDeals: deals, myDeliverables: deliverables, myActivity: activityLog, currentUser, markDeliverableComplete } = useAppContext();
  const navigate = useNavigate();
  const [tab, setTab] = useState('ALL');

  if (currentUser && currentUser.role !== 'athlete') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: '1rem' }}>
        <AlertCircle size={40} color="#ff5050" />
        <h2>Access Restricted</h2>
        <p style={{ color: '#6b7280' }}>Financial Tracker is only available to athlete accounts.</p>
      </div>
    );
  }

  const totalNIL = deals.reduce((s, d) => s + Number(d.dealValue || 0), 0);
  const cashEarnings = deals.reduce((s, d) => s + Number(d.cashValue || 0), 0);
  const nonMonetary = deals.reduce((s, d) => s + Number(d.nonCashValue || 0), 0);
  const activeDeals = deals.filter(d => d.status === 'Active' || d.status === 'Pending').length;
  const pendingDels = deliverables.filter(d => ['Upcoming', 'Pending Approval', 'In Progress'].includes(d.status)).length;
  const completedDels = deliverables.filter(d => d.status === 'Completed').length;
  const overdueDels = deliverables.filter(d => d.status === 'Overdue').length;
  const complianceScore = deals.length ? Math.round((deals.filter(d => d.reportedToSchool || !d.disclosureRequired).length / deals.length) * 100) : 100;

  const QUICK_STATS = [
    { label: 'Active Deals', value: activeDeals, icon: Zap, color: '#3d9bff', sub: `${deals.filter(d => d.status === 'Pending').length} pending` },
    { label: 'Pending', value: pendingDels, icon: Clock, color: '#ffb800', sub: `${overdueDels} overdue` },
    { label: 'Completed', value: completedDels, icon: CheckCircle, color: '#00d4a1', sub: 'deliverables' },
    { label: 'Compliance', value: `${complianceScore}%`, icon: Shield, color: complianceScore >= 90 ? '#00d4a1' : '#ff5050', sub: complianceScore >= 90 ? 'Excellent' : 'Needs attention' },
  ];

  const s = { /* shared dark card */
    card: { background: '#131722', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '1.75rem 2rem' },
  };

  return (
    <div style={{ padding: '2.25rem 2.5rem', background: '#0d1117', minHeight: '100vh' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', margin: 0 }}>Financial Tracker</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '0.3rem', fontSize: '0.9rem' }}>Track your NIL growth, deals, and compliance.</p>
        </div>
        <button onClick={() => navigate('/report-deal')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#00d4a1', color: '#0d1117', border: 'none', borderRadius: '12px', padding: '0.75rem 1.4rem', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,212,161,0.3)' }}>
          <Plus size={16} /> Report New Deal
        </button>
      </div>

      {/* ── Hero Chart Card ── */}
      <div style={{ ...s.card, background: 'linear-gradient(135deg, #0d1f3c 0%, #0a1628 60%, #0d1117 100%)', marginBottom: '1.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(0,212,161,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

        {/* Earnings split */}
        <div style={{ display: 'flex', gap: '2rem', marginBottom: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '1px' }}>Cash</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#00d4a1' }}>${cashEarnings.toLocaleString()}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '1px' }}>Non-Monetary</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#a78bfa' }}>${nonMonetary.toLocaleString()}</div>
          </div>
        </div>

        <PremiumChart tab={tab} totalNIL={totalNIL} />

        {/* Time tabs */}
        <div style={{ display: 'flex', gap: '0.25rem', marginTop: '1rem' }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ background: tab === t ? 'rgba(0,212,161,0.15)' : 'transparent', color: tab === t ? '#00d4a1' : 'rgba(255,255,255,0.3)', border: tab === t ? '1px solid rgba(0,212,161,0.3)' : '1px solid transparent', borderRadius: '8px', padding: '0.4rem 1rem', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.15s' }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* ── Quick Stats ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {QUICK_STATS.map(q => (
          <div key={q.label} style={{ ...s.card, padding: '1.25rem 1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '1px' }}>{q.label}</div>
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: `${q.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <q.icon size={14} color={q.color} />
              </div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', lineHeight: 1, marginBottom: '0.3rem' }}>{q.value}</div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>{q.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Deal Activity ── */}
      <div style={{ ...s.card, marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0, fontWeight: 700, fontSize: '1rem', color: '#fff' }}>Deal Activity</h2>
          <Link to="/report-deal" style={{ fontSize: '0.8rem', fontWeight: 600, color: '#00d4a1', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            View All <ArrowRight size={13} />
          </Link>
        </div>
        {deals.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'rgba(255,255,255,0.25)' }}>
            <Star size={36} style={{ marginBottom: '0.75rem' }} />
            <p style={{ margin: 0, fontWeight: 600, color: 'rgba(255,255,255,0.4)' }}>Start tracking your NIL journey.</p>
            <p style={{ margin: '0.5rem 0 1.25rem', fontSize: '0.875rem' }}>Report your first deal to see it here.</p>
            <button onClick={() => navigate('/report-deal')} style={{ background: '#00d4a1', color: '#0d1117', border: 'none', borderRadius: '10px', padding: '0.65rem 1.4rem', fontWeight: 800, cursor: 'pointer' }}>Report a Deal</button>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Brand', 'Value', 'Type', 'Status', 'Date'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '0.5rem 0.75rem', fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.8px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {deals.map((d, i) => {
                const sc = SC[d.status] || SC.Pending;
                return (
                  <tr key={d.id || i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.12s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '1rem 0.75rem', fontWeight: 700, color: '#fff', fontSize: '0.875rem' }}>{d.brand}</td>
                    <td style={{ padding: '1rem 0.75rem', fontWeight: 700, color: '#00d4a1', fontSize: '0.875rem' }}>${Number(d.dealValue || 0).toLocaleString()}</td>
                    <td style={{ padding: '1rem 0.75rem', color: 'rgba(255,255,255,0.45)', fontSize: '0.875rem' }}>{d.dealType || '—'}</td>
                    <td style={{ padding: '1rem 0.75rem' }}>
                      <span style={{ background: sc.bg, color: sc.color, padding: '0.2rem 0.65rem', borderRadius: '99px', fontSize: '0.72rem', fontWeight: 700 }}>{d.status}</span>
                    </td>
                    <td style={{ padding: '1rem 0.75rem', color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>{d.startDate}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Deliverables ── */}
      <div style={{ ...s.card, marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0, fontWeight: 700, fontSize: '1rem', color: '#fff' }}>Deliverables</h2>
          <Link to="/deliverables" style={{ fontSize: '0.8rem', fontWeight: 600, color: '#00d4a1', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            Manage All <ArrowRight size={13} />
          </Link>
        </div>
        {deliverables.length === 0 ? (
          <p style={{ color: 'rgba(255,255,255,0.25)', textAlign: 'center', padding: '2rem 0', margin: 0 }}>No deliverables yet. Add deliverables when reporting a deal.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {deliverables.slice(0, 6).map(d => {
              const sc = DEL_SC[d.status] || DEL_SC.Pending;
              return (
                <div key={d.id} style={{ padding: '1.25rem', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', background: 'rgba(255,255,255,0.02)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#fff' }}>{d.name}</span>
                    <span style={{ background: `${sc.color}18`, color: sc.color, padding: '0.15rem 0.55rem', borderRadius: '99px', fontSize: '0.7rem', fontWeight: 700, whiteSpace: 'nowrap', marginLeft: '0.5rem' }}>{d.status}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', marginBottom: '0.75rem' }}>📅 Due: {d.date} · {d.brand}</div>
                  <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden', marginBottom: '0.5rem' }}>
                    <div style={{ width: `${sc.pct}%`, height: '100%', background: sc.color, borderRadius: '2px', transition: 'width 0.4s ease' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)' }}>{sc.pct}% complete</span>
                    {d.status !== 'Completed' && (
                      <button onClick={() => markDeliverableComplete(d.id)} style={{ fontSize: '0.7rem', fontWeight: 700, color: '#00d4a1', background: 'rgba(0,212,161,0.12)', border: 'none', borderRadius: '6px', padding: '0.2rem 0.55rem', cursor: 'pointer' }}>
                        Mark Done
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Compliance ── */}
      <div style={{ ...s.card, marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0, fontWeight: 700, fontSize: '1rem', color: '#fff' }}>Compliance Overview</h2>
          <Link to="/compliance" style={{ fontSize: '0.8rem', fontWeight: 600, color: '#00d4a1', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            Details <ArrowRight size={13} />
          </Link>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          {[
            { label: 'Reported Deals', value: deals.filter(d => d.reportedToSchool).length, color: '#00d4a1' },
            { label: 'Needs Attention', value: deals.filter(d => d.disclosureRequired && !d.reportedToSchool).length, color: '#ff5050' },
            { label: 'Compliance Score', value: `${complianceScore}%`, color: complianceScore >= 90 ? '#00d4a1' : '#ffb800' },
          ].map(item => (
            <div key={item.label} style={{ flex: 1, minWidth: '120px', padding: '1.25rem', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '0.5rem' }}>{item.label}</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: item.color, lineHeight: 1 }}>{item.value}</div>
            </div>
          ))}
          <div style={{ flex: 2, minWidth: '200px', padding: '1.25rem', border: `1px solid ${complianceScore >= 90 ? 'rgba(0,212,161,0.2)' : 'rgba(255,80,80,0.2)'}`, borderRadius: '14px', background: complianceScore >= 90 ? 'rgba(0,212,161,0.05)' : 'rgba(255,80,80,0.05)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Shield size={24} color={complianceScore >= 90 ? '#00d4a1' : '#ff5050'} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>{complianceScore >= 90 ? 'Fully Compliant ✓' : 'Action Required'}</div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginTop: '0.2rem' }}>{complianceScore >= 90 ? 'All deals properly disclosed.' : 'Some deals need school reporting.'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Activity Timeline ── */}
      <div style={{ ...s.card }}>
        <h2 style={{ margin: '0 0 1.5rem', fontWeight: 700, fontSize: '1rem', color: '#fff' }}>Activity Timeline</h2>
        {activityLog.length === 0 ? (
          <p style={{ color: 'rgba(255,255,255,0.25)', margin: 0 }}>No activity yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {activityLog.slice(0, 8).map((ev, i) => {
              const color = ev.eventType === 'payment_received' ? '#00d4a1' : ev.eventType === 'deal_matched' ? '#3d9bff' : ev.eventType === 'deal_reported' ? '#a78bfa' : '#ffb800';
              return (
                <div key={ev.id || i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, marginTop: '6px', flexShrink: 0, boxShadow: `0 0 8px ${color}` }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#fff' }}>{ev.message}</div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.15rem' }}>{timeAgo(ev.timestamp)} · {ev.role}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
