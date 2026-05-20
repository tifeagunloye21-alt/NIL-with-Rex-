import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Receipt, AlertCircle, Download, ChevronDown, Search, MapPin, CheckCircle, Clock, ExternalLink, Crown } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import ProNilOrganizer from './ProNilOrganizerPage';

// ── All 50 states ─────────────────────────────────────────────────────────────
const ALL_STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut',
  'Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa',
  'Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan',
  'Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire',
  'New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio',
  'Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota',
  'Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia',
  'Wisconsin','Wyoming',
];

const NO_INCOME_TAX = ['Alaska','Florida','Nevada','New Hampshire','South Dakota','Tennessee','Texas','Washington','Wyoming'];

function stateInfo(state) {
  const noTax = NO_INCOME_TAX.includes(state);
  return {
    name: state,
    noIncomeTax: noTax,
    dorUrl: `https://www.google.com/search?q=${encodeURIComponent(state + ' Department of Revenue NIL athlete tax')}`,
    nilGuideUrl: `https://www.google.com/search?q=${encodeURIComponent(state + ' NIL college athlete income tax guide')}`,
    notes: noTax
      ? `${state} has no state income tax. Athletes may still owe federal taxes on NIL income.`
      : `NIL income earned in ${state} may be subject to ${state} state income tax. Keep records of all activity dates and amounts.`,
  };
}

const GUIDES = [
  { id: 'g1', title: 'Federal NIL Tax Overview', desc: 'How NIL income is treated by the IRS, self-employment tax basics, and deduction categories.', format: 'PDF', icon: '📄' },
  { id: 'g2', title: 'NIL Income Tracking Worksheet', desc: 'Track all NIL payments, fair market values, and non-cash compensation by deal.', format: 'XLSX', icon: '📊' },
  { id: 'g3', title: 'State Tax Checklist Template', desc: 'Multi-state activity checklist to help identify which states you may owe taxes in.', format: 'PDF', icon: '✅' },
  { id: 'g4', title: 'Document Organization Guide', desc: 'What records to keep, how long to keep them, and how to organize NIL contracts and 1099s.', format: 'PDF', icon: '🗂️' },
  { id: 'g5', title: 'Quarterly Estimated Tax Calendar', desc: 'Key IRS estimated tax deadlines for NIL earners who expect to owe $1,000+ annually.', format: 'PDF', icon: '📅' },
  { id: 'g6', title: 'Non-Cash NIL Income Guide', desc: 'How product endorsements, gear, meals, and other non-cash compensation are valued and reported.', format: 'PDF', icon: '🎁' },
];

const REMINDERS = [
  { date: 'Apr 15', label: 'Q1 Estimated Tax Payment', status: 'past' },
  { date: 'Jun 15', label: 'Q2 Estimated Tax Payment', status: 'upcoming' },
  { date: 'Sep 15', label: 'Q3 Estimated Tax Payment', status: 'future' },
  { date: 'Jan 15', label: 'Q4 Estimated Tax Payment', status: 'future' },
];

function usePersistedState(key, def) {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : def; } catch { return def; }
  });
  const set = v => { setVal(v); try { localStorage.setItem(key, JSON.stringify(v)); } catch {} };
  return [val, set];
}

function StateCard({ state }) {
  const info = stateInfo(state);
  return (
    <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontWeight: 700, fontSize: '1rem', color: '#111827' }}>{state}</div>
        {info.noIncomeTax && (
          <span style={{ background: '#f0fdf4', color: '#16a34a', fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '99px', border: '1px solid #bbf7d0' }}>No State Income Tax</span>
        )}
      </div>
      <p style={{ margin: 0, fontSize: '0.8rem', color: '#6b7280', lineHeight: 1.5 }}>{info.notes}</p>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <a href={info.dorUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', fontWeight: 600, color: '#0052FF', textDecoration: 'none', background: '#eff6ff', padding: '0.35rem 0.75rem', borderRadius: '8px' }}>
          <ExternalLink size={12} /> State DOR
        </a>
        <a href={info.nilGuideUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', fontWeight: 600, color: '#7c3aed', textDecoration: 'none', background: '#f5f3ff', padding: '0.35rem 0.75rem', borderRadius: '8px' }}>
          <ExternalLink size={12} /> NIL Guide
        </a>
      </div>
    </div>
  );
}

export default function TaxCenterPage() {
  const { currentUser } = useAppContext();
  const uid = currentUser?.id || 'anon';
  const [mainTab, setMainTab] = useState('resources');

  const [taxProfile, setTaxProfile] = usePersistedState(`fd_taxprofile_${uid}`, {
    schoolState: '', homeState: '', nilActivityStates: [], school: '', sport: '',
  });
  const [browseState, setBrowseState] = useState('');
  const [stateSearch, setStateSearch] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [draft, setDraft] = useState(taxProfile);

  const personalizedStates = [...new Set([
    taxProfile.schoolState, taxProfile.homeState, ...taxProfile.nilActivityStates,
  ])].filter(Boolean);

  const filteredStates = ALL_STATES.filter(s => s.toLowerCase().includes(stateSearch.toLowerCase()));

  const profileComplete = taxProfile.schoolState && taxProfile.homeState;

  const toggleActivityState = (state) => {
    const cur = draft.nilActivityStates || [];
    setDraft({ ...draft, nilActivityStates: cur.includes(state) ? cur.filter(s => s !== state) : [...cur, state] });
  };

  const saveProfile = () => {
    setTaxProfile(draft);
    setEditMode(false);
  };

  const card = { background: 'white', borderRadius: '20px', border: '1px solid #e5e7eb', padding: '1.75rem 2rem', marginBottom: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' };
  const sectionTitle = { fontSize: '1.05rem', fontWeight: 800, color: '#111827', margin: '0 0 1.25rem' };
  const sel = { padding: '0.7rem 1rem', borderRadius: '10px', border: '1.5px solid #e5e7eb', fontSize: '0.9rem', outline: 'none', background: '#fafafa', width: '100%', boxSizing: 'border-box' };

  return (
    <div style={{ padding: '2.25rem 2.5rem', background: '#f8fafc', minHeight: '100vh', fontFamily: "'Inter', system-ui, sans-serif", maxWidth: '960px' }}>

      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #0033cc, #0052FF)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Receipt size={20} color="white" />
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#111827', margin: 0, letterSpacing: '-0.5px' }}>Tax Center</h1>
        </div>
        <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem' }}>Stay organized and access NIL tax resources personalized to your states.</p>
      </div>

      {/* Main Tab Switcher */}
      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.75rem', background: '#f1f5f9', borderRadius: '14px', padding: '0.3rem' }}>
        <button onClick={() => setMainTab('resources')} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.7rem', borderRadius: '10px', border: 'none', background: mainTab === 'resources' ? 'white' : 'transparent', color: mainTab === 'resources' ? '#111827' : '#6b7280', fontWeight: mainTab === 'resources' ? 700 : 500, fontSize: '0.875rem', cursor: 'pointer', boxShadow: mainTab === 'resources' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.15s' }}>
          <Receipt size={15} /> Tax Resources
        </button>
        <button onClick={() => setMainTab('pro')} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.7rem', borderRadius: '10px', border: 'none', background: mainTab === 'pro' ? 'white' : 'transparent', color: mainTab === 'pro' ? '#d97706' : '#6b7280', fontWeight: mainTab === 'pro' ? 700 : 500, fontSize: '0.875rem', cursor: 'pointer', boxShadow: mainTab === 'pro' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.15s' }}>
          <Crown size={15} /> PRO: NIL Organizer
        </button>
      </div>

      {/* PRO Tab */}
      {mainTab === 'pro' && <ProNilOrganizer />}

      {/* Resources Tab */}
      {mainTab === 'resources' && (
        <>

      <div style={{ background: '#fefce8', border: '1px solid #fde68a', borderRadius: '14px', padding: '1rem 1.25rem', marginBottom: '1.75rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
        <AlertCircle size={18} color="#d97706" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
        <p style={{ margin: 0, fontSize: '0.8rem', color: '#92400e', lineHeight: 1.6 }}>
          <strong>Important:</strong> FrontDoor helps athletes organize NIL-related tax information and access educational resources. FrontDoor does <strong>not</strong> provide legal, tax, financial, or accounting advice. Athletes should consult a qualified tax professional or their school's compliance office for personalized guidance.
        </p>
      </div>

      {/* Tax Profile Card */}
      <div style={card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ ...sectionTitle, margin: 0 }}>Your Tax Profile</h2>
          <button onClick={() => { setDraft(taxProfile); setEditMode(!editMode); }} style={{ background: editMode ? '#f1f5f9' : '#0052FF', color: editMode ? '#374151' : 'white', border: 'none', borderRadius: '10px', padding: '0.5rem 1.1rem', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>
            {editMode ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {!profileComplete && !editMode && (
          <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '12px', padding: '0.85rem 1.1rem', marginBottom: '1.25rem', fontSize: '0.82rem', color: '#9a3412', fontWeight: 600 }}>
            ⚠️ Complete your tax profile to see personalized state resources.
          </div>
        )}

        {editMode ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '0.4rem' }}>School / University</label>
                <input value={draft.school} onChange={e => setDraft({ ...draft, school: e.target.value })} placeholder="University of Nebraska" style={{ ...sel }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '0.4rem' }}>Sport</label>
                <input value={draft.sport} onChange={e => setDraft({ ...draft, sport: e.target.value })} placeholder="Football" style={{ ...sel }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '0.4rem' }}>School State *</label>
                <select value={draft.schoolState} onChange={e => setDraft({ ...draft, schoolState: e.target.value })} style={sel}>
                  <option value="">Select state...</option>
                  {ALL_STATES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '0.4rem' }}>Home / Residency State *</label>
                <select value={draft.homeState} onChange={e => setDraft({ ...draft, homeState: e.target.value })} style={sel}>
                  <option value="">Select state...</option>
                  {ALL_STATES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '0.6rem' }}>States Where NIL Activity Has Occurred (select all that apply)</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {ALL_STATES.map(s => {
                  const active = (draft.nilActivityStates || []).includes(s);
                  return (
                    <button key={s} onClick={() => toggleActivityState(s)} style={{ padding: '0.3rem 0.75rem', borderRadius: '99px', border: `1.5px solid ${active ? '#0052FF' : '#e5e7eb'}`, background: active ? '#eff6ff' : 'white', color: active ? '#0052FF' : '#6b7280', fontSize: '0.75rem', fontWeight: active ? 700 : 500, cursor: 'pointer', transition: 'all 0.12s' }}>
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
            <button onClick={saveProfile} style={{ alignSelf: 'flex-start', background: '#0052FF', color: 'white', border: 'none', borderRadius: '10px', padding: '0.6rem 1.4rem', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={15} /> Save Tax Profile
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            {[
              { label: 'School State', value: taxProfile.schoolState || '—', icon: '🏫' },
              { label: 'Home State', value: taxProfile.homeState || '—', icon: '🏠' },
              { label: 'NIL Activity States', value: taxProfile.nilActivityStates?.length ? taxProfile.nilActivityStates.join(', ') : '—', icon: '📍' },
            ].map(f => (
              <div key={f.label} style={{ background: '#f8fafc', borderRadius: '12px', padding: '1rem 1.1rem' }}>
                <div style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{f.icon}</div>
                <div style={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{f.label}</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: f.value === '—' ? '#d1d5db' : '#111827', marginTop: '0.2rem', wordBreak: 'break-word' }}>{f.value}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tax Reminders */}
      <div style={card}>
        <h2 style={sectionTitle}>📅 Key Tax Dates</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
          {REMINDERS.map(r => (
            <div key={r.date} style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', background: r.status === 'upcoming' ? '#eff6ff' : '#f9fafb', border: `1px solid ${r.status === 'upcoming' ? '#bfdbfe' : '#f1f5f9'}`, borderRadius: '12px', padding: '0.85rem 1rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: r.status === 'past' ? '#f3f4f6' : r.status === 'upcoming' ? '#0052FF' : '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 900, color: r.status === 'upcoming' ? 'white' : '#6b7280', textAlign: 'center', flexShrink: 0, lineHeight: 1.2 }}>
                {r.date}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#111827' }}>{r.label}</div>
                <div style={{ fontSize: '0.72rem', color: r.status === 'past' ? '#9ca3af' : r.status === 'upcoming' ? '#0052FF' : '#6b7280', fontWeight: 600 }}>
                  {r.status === 'past' ? 'Past' : r.status === 'upcoming' ? '⚡ Coming up' : 'Upcoming'}
                </div>
              </div>
            </div>
          ))}
        </div>
        <p style={{ margin: '1rem 0 0', fontSize: '0.72rem', color: '#9ca3af' }}>These are general IRS estimated tax deadlines. Consult a tax professional to determine if estimated payments apply to you.</p>
      </div>

      {/* Personalized State Resources */}
      {personalizedStates.length > 0 && (
        <div style={card}>
          <h2 style={sectionTitle}>🗺️ Your State Resources</h2>
          <p style={{ margin: '-0.75rem 0 1.25rem', fontSize: '0.82rem', color: '#6b7280' }}>Based on your school state, home state, and NIL activity states.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
            {personalizedStates.map(s => <StateCard key={s} state={s} />)}
          </div>
        </div>
      )}

      {/* Downloadable Guides */}
      <div style={card}>
        <h2 style={sectionTitle}>📚 Educational Guides & Resources</h2>
        <p style={{ margin: '-0.75rem 0 1.25rem', fontSize: '0.82rem', color: '#6b7280' }}>Organizational guides to help you stay prepared. These are educational resources, not tax advice.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
          {GUIDES.map(g => (
            <div key={g.id} style={{ background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: '14px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div style={{ fontSize: '1.5rem' }}>{g.icon}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#111827', flex: 1 }}>{g.title}</div>
                <span style={{ background: '#e0e7ff', color: '#4338ca', fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '6px' }}>{g.format}</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#6b7280', lineHeight: 1.5 }}>{g.desc}</p>
              <button style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'white', border: '1.5px solid #e5e7eb', borderRadius: '9px', padding: '0.45rem 0.9rem', fontSize: '0.78rem', fontWeight: 700, color: '#374151', cursor: 'pointer', transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#0052FF'; e.currentTarget.style.color = '#0052FF'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#374151'; }}
              >
                <Download size={13} /> Download (Coming Soon)
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Browse All 50 States */}
      <div style={card}>
        <h2 style={sectionTitle}>🔍 Browse All States</h2>
        <p style={{ margin: '-0.75rem 0 1.25rem', fontSize: '0.82rem', color: '#6b7280' }}>Search any state to see its tax resource information.</p>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <Search size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input
              value={stateSearch}
              onChange={e => setStateSearch(e.target.value)}
              placeholder="Search states..."
              style={{ ...sel, paddingLeft: '2.3rem' }}
            />
          </div>
          <select value={browseState} onChange={e => { setBrowseState(e.target.value); setStateSearch(''); }} style={{ ...sel, width: 'auto', minWidth: '200px' }}>
            <option value="">— Or select from list —</option>
            {ALL_STATES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        {(browseState || stateSearch) && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
            {(stateSearch ? filteredStates : [browseState]).filter(Boolean).map(s => (
              <StateCard key={s} state={s} />
            ))}
          </div>
        )}

        {stateSearch && filteredStates.length === 0 && (
          <div style={{ textAlign: 'center', color: '#9ca3af', padding: '2rem', fontSize: '0.875rem' }}>No states found for "{stateSearch}"</div>
        )}

        {!browseState && !stateSearch && (
          <div style={{ textAlign: 'center', color: '#d1d5db', padding: '2rem 1rem', fontSize: '0.875rem' }}>Search or select a state above to view its resources.</div>
        )}
      </div>

        {/* Bottom disclaimer */}
        <div style={{ background: '#f1f5f9', borderRadius: '14px', padding: '1.25rem 1.5rem', fontSize: '0.78rem', color: '#64748b', lineHeight: 1.7, textAlign: 'center' }}>
          <strong>Disclaimer:</strong> FrontDoor is an organizational tool, not a tax service. All resources, dates, and information provided here are for general educational purposes only. Tax laws vary by state and individual situation. Always consult a licensed CPA, tax attorney, or your school's compliance office before making tax decisions.
        </div>

        </> 
      )}

    </div>
  );
}
