import { useState } from 'react';
import { Crown, Download, FileText, TrendingUp, Tag, Lock, Sparkles } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useProStatus, activateProDemo } from '../hooks/useProStatus';
import '../styles/print.css';

const DISCLAIMER = "FrontDoor does not provide legal, tax, financial, or accounting advice. This report is for organization and recordkeeping purposes only. Please consult a qualified tax professional or your school's compliance office.";

const CATEGORY_MAP = {
  'Social Post': 'Social Media',
  'Appearance': 'Appearance',
  'Autograph': 'Autograph / Event',
  'Apparel': 'Apparel / Gear',
  'Training': 'Training Partnership',
  'Content': 'Content Creation',
  'Affiliate': 'Affiliate',
};
const getCategory = (dealType) => CATEGORY_MAP[dealType] || 'Other';

function fmt(n) { return `$${Number(n || 0).toLocaleString()}`; }
function fmtDate(s) { try { return new Date(s).toLocaleDateString(); } catch { return s || '—'; } }

// ── Upgrade Wall ──────────────────────────────────────────────────────────────
function UpgradeWall({ uid, onUnlock }) {
  const features = [
    'Annual NIL earnings summary by year',
    'Full income log with cash + non-cash breakdown',
    'Categorized NIL activity view',
    'Exportable CSV income log',
    'Printable PDF report for your tax professional',
    'Document checklist per deal',
  ];
  return (
    <div style={{ textAlign: 'center', padding: '3rem 2rem', maxWidth: '520px', margin: '0 auto' }}>
      <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
        <Crown size={30} color="white" />
      </div>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'white', fontSize: '0.72rem', fontWeight: 800, padding: '0.25rem 0.8rem', borderRadius: '99px', marginBottom: '1rem', letterSpacing: '0.5px' }}>
        <Sparkles size={11} /> PRO FEATURE
      </div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#111827', margin: '0 0 0.75rem' }}>Unlock NIL Tax Organization</h2>
      <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: 1.6, margin: '0 0 1.5rem' }}>
        Upgrade to FrontDoor Pro to unlock annual NIL summaries, income logs, categorized activity, and exportable reports.
      </p>
      <ul style={{ textAlign: 'left', listStyle: 'none', padding: 0, margin: '0 0 2rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {features.map(f => (
          <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.875rem', color: '#374151' }}>
            <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Crown size={11} color="#d97706" />
            </div>
            {f}
          </li>
        ))}
      </ul>
      <button style={{ width: '100%', padding: '0.875rem', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', marginBottom: '0.75rem', boxShadow: '0 4px 16px rgba(245,158,11,0.35)' }}>
        Upgrade to PRO — Coming Soon
      </button>
      <button onClick={() => { activateProDemo(uid); onUnlock(); }} style={{ width: '100%', padding: '0.75rem', background: 'white', color: '#374151', border: '1.5px solid #e5e7eb', borderRadius: '12px', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer' }}>
        Try Demo Mode (Unlock Preview)
      </button>
      <p style={{ margin: '1.25rem 0 0', fontSize: '0.72rem', color: '#9ca3af', lineHeight: 1.5 }}>{DISCLAIMER}</p>
    </div>
  );
}

// ── Summary Cards ─────────────────────────────────────────────────────────────
function SummaryCards({ deals, deliverables }) {
  const total = deals.reduce((s, d) => s + Number(d.dealValue || 0), 0);
  const cash = deals.reduce((s, d) => s + Number(d.cashValue || 0), 0);
  const nonCash = deals.reduce((s, d) => s + Number(d.nonCashValue || 0), 0);
  const completed = deliverables.filter(d => d.status === 'Completed').length;

  const stats = [
    { label: 'Total NIL Value', value: fmt(total), color: '#0052FF', bg: '#eff6ff' },
    { label: 'Cash Earnings', value: fmt(cash), color: '#16a34a', bg: '#f0fdf4' },
    { label: 'Non-Cash Value', value: fmt(nonCash), color: '#7c3aed', bg: '#f5f3ff' },
    { label: 'Total Deals', value: deals.length, color: '#0369a1', bg: '#f0f9ff' },
    { label: 'Completed Deliverables', value: completed, color: '#b45309', bg: '#fffbeb' },
    { label: 'Deal Records', value: deals.length, color: '#374151', bg: '#f9fafb' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
      {stats.map(s => (
        <div key={s.label} style={{ background: s.bg, border: `1px solid ${s.color}22`, borderRadius: '16px', padding: '1.25rem 1.5rem' }}>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: s.color }}>{s.value}</div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600, marginTop: '0.2rem' }}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}

// ── Income Log Table ──────────────────────────────────────────────────────────
function IncomeLog({ deals }) {
  const th = { padding: '0.65rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#6b7280', background: '#f8fafc', whiteSpace: 'nowrap' };
  const td = { padding: '0.75rem 1rem', fontSize: '0.82rem', color: '#374151', borderBottom: '1px solid #f1f5f9' };
  const STATUS_COLORS = { Active: '#16a34a', Completed: '#0052FF', Pending: '#d97706', Expired: '#6b7280' };

  if (!deals.length) return <div style={{ textAlign: 'center', color: '#9ca3af', padding: '2rem' }}>No deals recorded for this year.</div>;

  return (
    <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
        <thead>
          <tr>
            {['Date', 'Brand', 'Deal Title', 'Cash', 'Non-Cash', 'Total', 'Status'].map(h => (
              <th key={h} style={th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {deals.map(d => (
            <tr key={d.id} style={{ transition: 'background 0.1s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
              onMouseLeave={e => e.currentTarget.style.background = 'white'}>
              <td style={td}>{fmtDate(d.startDate)}</td>
              <td style={{ ...td, fontWeight: 700 }}>{d.brand}</td>
              <td style={td}>{d.dealTitle}</td>
              <td style={{ ...td, color: '#16a34a', fontWeight: 600 }}>{fmt(d.cashValue)}</td>
              <td style={{ ...td, color: '#7c3aed', fontWeight: 600 }}>{fmt(d.nonCashValue)}</td>
              <td style={{ ...td, fontWeight: 800 }}>{fmt(d.dealValue)}</td>
              <td style={td}>
                <span style={{ background: `${STATUS_COLORS[d.status] || '#6b7280'}18`, color: STATUS_COLORS[d.status] || '#6b7280', fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '99px' }}>
                  {d.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Categorized Activity ──────────────────────────────────────────────────────
function CategoryCards({ deals }) {
  const grouped = {};
  deals.forEach(d => {
    const cat = getCategory(d.dealType);
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(d);
  });

  if (!Object.keys(grouped).length) return <div style={{ color: '#9ca3af', textAlign: 'center', padding: '2rem' }}>No categorized activity for this year.</div>;

  const catColors = ['#0052FF', '#7c3aed', '#16a34a', '#d97706', '#0369a1', '#b45309', '#374151'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {Object.entries(grouped).map(([cat, items], i) => {
        const total = items.reduce((s, d) => s + Number(d.dealValue || 0), 0);
        const color = catColors[i % catColors.length];
        return (
          <div key={cat} style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '14px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', background: `${color}08`, borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color }} />
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#111827' }}>{cat}</span>
                <span style={{ background: `${color}18`, color, fontSize: '0.72rem', fontWeight: 700, padding: '0.15rem 0.55rem', borderRadius: '99px' }}>{items.length} deal{items.length !== 1 ? 's' : ''}</span>
              </div>
              <span style={{ fontWeight: 800, color, fontSize: '0.95rem' }}>{fmt(total)}</span>
            </div>
            <div style={{ padding: '0.5rem 0' }}>
              {items.map(d => (
                <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 1.25rem', fontSize: '0.82rem' }}>
                  <div>
                    <span style={{ fontWeight: 600, color: '#374151' }}>{d.brand}</span>
                    <span style={{ color: '#9ca3af', marginLeft: '0.5rem' }}>— {d.dealTitle}</span>
                  </div>
                  <span style={{ fontWeight: 700, color: '#111827' }}>{fmt(d.dealValue)}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Export Helpers ────────────────────────────────────────────────────────────
function exportCSV(deals, year, profile) {
  const headers = ['Date', 'Brand', 'Deal Title', 'Type', 'Cash Value', 'Non-Cash Value', 'Total Value', 'Status'];
  const rows = deals.map(d => [
    fmtDate(d.startDate), d.brand, d.dealTitle, d.dealType,
    d.cashValue || 0, d.nonCashValue || 0, d.dealValue || 0, d.status,
  ]);
  const csv = [
    [`FrontDoor NIL Income Log — ${profile?.name || 'Athlete'} — ${year}`],
    [DISCLAIMER],
    [],
    headers,
    ...rows,
  ].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `FrontDoor_NIL_Income_${year}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}

function PrintReport({ deals, deliverables, year, profile, onClose }) {
  const total = deals.reduce((s, d) => s + Number(d.dealValue || 0), 0);
  const cash = deals.reduce((s, d) => s + Number(d.cashValue || 0), 0);
  const nonCash = deals.reduce((s, d) => s + Number(d.nonCashValue || 0), 0);

  return (
    <div id="fd-print-root" style={{ position: 'fixed', inset: 0, background: 'white', zIndex: 9999, overflowY: 'auto', padding: '2rem', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Screen-only controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }} className="no-print">
          <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', padding: '0.5rem 1rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}>← Back</button>
          <button onClick={() => window.print()} style={{ background: '#0052FF', color: 'white', border: 'none', borderRadius: '8px', padding: '0.5rem 1.25rem', cursor: 'pointer', fontWeight: 700, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <FileText size={14} /> Save as PDF
          </button>
        </div>

        {/* Report header */}
        <div className="print-header" style={{ borderBottom: '3px solid #0052FF', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0052FF' }}>FrontDoor NIL Activity Report</div>
          <div style={{ color: '#6b7280', marginTop: '0.25rem', fontSize: '0.875rem' }}>
            {profile?.name || 'Athlete'} · {year} Tax Year · Generated {new Date().toLocaleDateString()}
          </div>
          {profile?.school && <div style={{ color: '#6b7280', fontSize: '0.82rem' }}>{profile.school}</div>}
        </div>

        {/* Summary */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '0.75rem', color: '#111827' }}>Annual Summary</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
            {[
              { label: 'Total NIL Value', value: fmt(total) },
              { label: 'Cash Earnings', value: fmt(cash) },
              { label: 'Non-Cash Value', value: fmt(nonCash) },
              { label: 'Total Deals', value: deals.length },
              { label: 'Completed Deliverables', value: deliverables.filter(d => d.status === 'Completed').length },
              { label: 'Report Year', value: year },
            ].map(s => (
              <div key={s.label} style={{ background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '0.85rem 1rem' }}>
                <div style={{ fontWeight: 900, color: '#0052FF', fontSize: '1.1rem' }}>{s.value}</div>
                <div style={{ fontSize: '0.72rem', color: '#6b7280', fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Income Log */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '0.75rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.4rem', color: '#111827' }}>Income Log</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ background: '#f1f5f9' }}>
                {['Date', 'Brand', 'Deal Title', 'Type', 'Cash', 'Non-Cash', 'Total', 'Status'].map(h => (
                  <th key={h} style={{ padding: '0.5rem 0.75rem', textAlign: 'left', fontWeight: 700, color: '#374151', border: '1px solid #e5e7eb' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {deals.map((d, i) => (
                <tr key={d.id} style={{ background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                  <td style={{ padding: '0.45rem 0.75rem', border: '1px solid #e5e7eb' }}>{fmtDate(d.startDate)}</td>
                  <td style={{ padding: '0.45rem 0.75rem', border: '1px solid #e5e7eb', fontWeight: 600 }}>{d.brand}</td>
                  <td style={{ padding: '0.45rem 0.75rem', border: '1px solid #e5e7eb' }}>{d.dealTitle}</td>
                  <td style={{ padding: '0.45rem 0.75rem', border: '1px solid #e5e7eb' }}>{d.dealType}</td>
                  <td style={{ padding: '0.45rem 0.75rem', border: '1px solid #e5e7eb' }}>{fmt(d.cashValue)}</td>
                  <td style={{ padding: '0.45rem 0.75rem', border: '1px solid #e5e7eb' }}>{fmt(d.nonCashValue)}</td>
                  <td style={{ padding: '0.45rem 0.75rem', border: '1px solid #e5e7eb', fontWeight: 700 }}>{fmt(d.dealValue)}</td>
                  <td style={{ padding: '0.45rem 0.75rem', border: '1px solid #e5e7eb' }}>{d.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Disclaimer */}
        <div style={{ background: '#fefce8', border: '1px solid #fde68a', borderRadius: '10px', padding: '1rem 1.25rem', fontSize: '0.78rem', color: '#92400e', lineHeight: 1.6 }}>
          <strong>Important Disclaimer:</strong> {DISCLAIMER}
        </div>

        <div style={{ textAlign: 'center', fontSize: '0.72rem', color: '#9ca3af', marginTop: '1.25rem' }}>
          Generated by FrontDoor · {new Date().toLocaleDateString()} · For recordkeeping purposes only
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function ProNilOrganizer() {
  const { currentUser, myDeals, myDeliverables } = useAppContext();
  const uid = currentUser?.id;
  const { isPro } = useProStatus(uid);
  const [proUnlocked, setProUnlocked] = useState(false);
  const [activeTab, setActiveTab] = useState('summary');
  const [showReport, setShowReport] = useState(false);
  const [, forceUpdate] = useState(0);

  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear - 1, currentYear - 2];
  const [year, setYear] = useState(String(currentYear));

  const isProActive = isPro || proUnlocked;

  const yearDeals = myDeals.filter(d => {
    const y = d.startDate ? new Date(d.startDate).getFullYear() : currentYear;
    return String(y) === year;
  });

  const profileData = (() => {
    try { return JSON.parse(localStorage.getItem(`fd_profile_${uid}`) || '{}'); } catch { return {}; }
  })();

  if (!isProActive) {
    return <UpgradeWall uid={uid} onUnlock={() => { setProUnlocked(true); forceUpdate(n => n + 1); }} />;
  }

  if (showReport) {
    return <PrintReport deals={yearDeals} deliverables={myDeliverables} year={year} profile={profileData} onClose={() => setShowReport(false)} />;
  }

  const tabs = [
    { id: 'summary', label: 'Annual Summary', icon: TrendingUp },
    { id: 'log', label: 'Income Log', icon: FileText },
    { id: 'categories', label: 'By Category', icon: Tag },
  ];

  const card = { background: 'white', borderRadius: '20px', border: '1px solid #e5e7eb', padding: '1.5rem 1.75rem', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', marginBottom: '1.25rem' };

  return (
    <div>
      {/* PRO Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', borderRadius: '10px', padding: '0.4rem 0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Crown size={14} color="white" />
            <span style={{ color: 'white', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.5px' }}>PRO</span>
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#111827' }}>NIL Tax Organizer</span>
        </div>
        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <select value={year} onChange={e => setYear(e.target.value)} style={{ padding: '0.5rem 0.85rem', borderRadius: '10px', border: '1.5px solid #e5e7eb', fontSize: '0.875rem', fontWeight: 600, outline: 'none', cursor: 'pointer' }}>
            {years.map(y => <option key={y} value={y}>{y} Tax Year</option>)}
          </select>
          <button onClick={() => exportCSV(yearDeals, year, profileData)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#f0fdf4', color: '#16a34a', border: '1.5px solid #bbf7d0', borderRadius: '10px', padding: '0.5rem 1rem', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>
            <Download size={13} /> Export CSV
          </button>
          <button onClick={() => setShowReport(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#0052FF', color: 'white', border: 'none', borderRadius: '10px', padding: '0.5rem 1rem', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,82,255,0.25)' }}>
            <FileText size={13} /> Export PDF
          </button>
        </div>
      </div>

      {/* Disclaimer */}
      <div style={{ background: '#fefce8', border: '1px solid #fde68a', borderRadius: '12px', padding: '0.75rem 1.1rem', marginBottom: '1.25rem', fontSize: '0.75rem', color: '#92400e', lineHeight: 1.5 }}>
        ⚠️ {DISCLAIMER}
      </div>

      {/* Tab Nav */}
      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.25rem', background: '#f1f5f9', borderRadius: '12px', padding: '0.25rem' }}>
        {tabs.map(t => {
          const active = activeTab === t.id;
          return (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.6rem', borderRadius: '10px', border: 'none', background: active ? 'white' : 'transparent', color: active ? '#0052FF' : '#6b7280', fontWeight: active ? 700 : 500, fontSize: '0.82rem', cursor: 'pointer', boxShadow: active ? '0 1px 4px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.15s' }}>
              <t.icon size={14} /> {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div style={card}>
        {activeTab === 'summary' && (
          <>
            <h3 style={{ margin: '0 0 1.25rem', fontWeight: 800, fontSize: '0.95rem', color: '#111827' }}>{year} Annual Earnings Summary</h3>
            <SummaryCards deals={yearDeals} deliverables={myDeliverables} />
            {yearDeals.length === 0 && (
              <div style={{ textAlign: 'center', color: '#9ca3af', padding: '1rem', fontSize: '0.875rem' }}>No deals found for {year}. Add deals via Report a Deal.</div>
            )}
          </>
        )}
        {activeTab === 'log' && (
          <>
            <h3 style={{ margin: '0 0 1.25rem', fontWeight: 800, fontSize: '0.95rem', color: '#111827' }}>{year} Income Log</h3>
            <IncomeLog deals={yearDeals} />
          </>
        )}
        {activeTab === 'categories' && (
          <>
            <h3 style={{ margin: '0 0 1.25rem', fontWeight: 800, fontSize: '0.95rem', color: '#111827' }}>{year} NIL Activity by Category</h3>
            <CategoryCards deals={yearDeals} />
          </>
        )}
      </div>
    </div>
  );
}
