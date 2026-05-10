import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Bell, Shield, Lock, Eye, FileText, LogOut, Camera, Check, Save, ChevronRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

// ── Helpers ────────────────────────────────────────────────────────────────
function usePersistedState(key, defaultVal) {
    const [val, setVal] = useState(() => {
        try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : defaultVal; } catch { return defaultVal; }
    });
    const set = (v) => { setVal(v); try { localStorage.setItem(key, JSON.stringify(v)); } catch {} };
    return [val, set];
}

function Toggle({ checked, onChange }) {
    return (
        <div onClick={() => onChange(!checked)} style={{ width: '44px', height: '24px', borderRadius: '99px', background: checked ? '#0052FF' : '#d1d5db', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
            <div style={{ position: 'absolute', top: '3px', left: checked ? '23px' : '3px', width: '18px', height: '18px', borderRadius: '50%', background: 'white', boxShadow: '0 1px 4px rgba(0,0,0,0.15)', transition: 'left 0.2s' }} />
        </div>
    );
}

function Section({ title, children }) {
    return (
        <div style={{ background: 'white', borderRadius: '18px', padding: '1.75rem 2rem', border: '1px solid #f1f5f9', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', marginBottom: '1.25rem' }}>
            <h3 style={{ margin: '0 0 1.5rem', fontWeight: 700, fontSize: '0.95rem', color: '#111827' }}>{title}</h3>
            {children}
        </div>
    );
}

function FieldRow({ label, hint, children }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 0', borderBottom: '1px solid #f9fafb' }}>
            <div style={{ flex: 1, paddingRight: '1.5rem' }}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827' }}>{label}</div>
                {hint && <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.15rem' }}>{hint}</div>}
            </div>
            {children}
        </div>
    );
}

function SaveBanner({ show }) {
    if (!show) return null;
    return (
        <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', background: '#111827', color: 'white', padding: '0.75rem 1.25rem', borderRadius: '12px', fontWeight: 700, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 8px 24px rgba(0,0,0,0.2)', zIndex: 999, animation: 'fadeIn 0.2s' }}>
            <Check size={16} color="#22c55e" /> Settings saved
        </div>
    );
}

const inp = { width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: '1.5px solid #e5e7eb', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', background: '#fafafa', transition: 'border-color 0.15s' };
const focusInp = e => Object.assign(e.target.style, { borderColor: '#0052FF', background: 'white', boxShadow: '0 0 0 3px rgba(0,82,255,0.08)' });
const blurInp  = e => Object.assign(e.target.style, { borderColor: '#e5e7eb', background: '#fafafa', boxShadow: 'none' });

const TABS = [
    { id: 'profile',      label: 'Profile',       icon: User },
    { id: 'notifications',label: 'Notifications', icon: Bell },
    { id: 'security',     label: 'Security',      icon: Lock },
    { id: 'privacy',      label: 'Privacy',       icon: Eye },
    { id: 'compliance',   label: 'Compliance',    icon: FileText },
];

export default function ProfilePage() {
    const { currentUser, myDeals, myDeliverables, logout, logActivity } = useAppContext();
    const navigate = useNavigate();
    const [tab, setTab] = useState('profile');
    const [saved, setSaved] = useState(false);
    const photoRef = useRef(null);

    const uid = currentUser?.id || 'anon';
    const totalNIL = myDeals.reduce((s, d) => s + Number(d.dealValue || 0), 0);
    const activeDeals = myDeals.filter(d => d.status === 'Active' || d.status === 'Pending').length;
    const completedDels = myDeliverables.filter(d => d.status === 'Completed').length;

    // ── Profile state ──────────────────────────────────────────────────────
    const [profile, setProfile] = usePersistedState(`fd_profile_${uid}`, {
        name: currentUser?.name || '', email: currentUser?.email || '',
        phone: '', school: '', sport: '', team: '', gradYear: '', bio: '', photoUrl: '',
    });

    // ── Notification state ─────────────────────────────────────────────────
    const [notifs, setNotifs] = usePersistedState(`fd_notifs_${uid}`, {
        agentMessages: true, dealStatus: true, deliverableReminders: true,
        complianceReminders: true, weeklySummary: false, marketing: false,
        pushPlaceholder: false, emailToggle: true,
    });

    // ── Security state ─────────────────────────────────────────────────────
    const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
    const [pwMsg, setPwMsg] = useState('');

    // ── Privacy state ──────────────────────────────────────────────────────
    const [privacy, setPrivacy] = usePersistedState(`fd_privacy_${uid}`, {
        profileVisibility: 'Public to Brands', agentDiscovery: true,
    });

    // ── Compliance prefs ───────────────────────────────────────────────────
    const [compPrefs, setCompPrefs] = usePersistedState(`fd_comp_${uid}`, {
        reminderFreq: 'Quarterly', daysBeforeDue: '7', universityContact: '', docReminders: true,
    });

    const showSaved = (label = 'Settings') => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2200);
        logActivity('settings_updated', `${label} updated`);
    };

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => setProfile({ ...profile, photoUrl: reader.result });
        reader.readAsDataURL(file);
    };

    const handleLogout = async () => { await logout(); navigate('/'); };

    const initials = (profile.name || 'A').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    return (
        <div style={{ padding: '2.25rem 2.5rem', background: '#f8fafc', minHeight: '100vh', fontFamily: "'Inter', system-ui, sans-serif" }}>
            <SaveBanner show={saved} />

            {/* Header Hero */}
            <div style={{ background: 'linear-gradient(135deg, #0B0F1A 0%, #1a2340 100%)', borderRadius: '24px', padding: '2.25rem 2.5rem', marginBottom: '1.75rem', display: 'flex', alignItems: 'center', gap: '2rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '240px', height: '240px', background: 'rgba(0,82,255,0.07)', borderRadius: '50%' }} />
                {/* Avatar */}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                    <div style={{ width: '88px', height: '88px', borderRadius: '22px', background: profile.photoUrl ? 'transparent' : 'linear-gradient(135deg, #0052FF, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 900, color: 'white', overflow: 'hidden', boxShadow: '0 8px 28px rgba(0,82,255,0.3)' }}>
                        {profile.photoUrl ? <img src={profile.photoUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
                    </div>
                    <button onClick={() => photoRef.current?.click()} style={{ position: 'absolute', bottom: '-4px', right: '-4px', width: '28px', height: '28px', borderRadius: '50%', background: '#0052FF', border: '3px solid #0B0F1A', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <Camera size={12} color="white" />
                    </button>
                    <input ref={photoRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoUpload} />
                </div>
                {/* Info */}
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white', marginBottom: '0.2rem' }}>{profile.name || 'Athlete'}</div>
                    <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.75rem' }}>
                        {profile.sport || 'Student Athlete'}{profile.school ? ` · ${profile.school}` : ''}{profile.gradYear ? ` · Class of ${profile.gradYear}` : ''}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>{profile.email || currentUser?.email}</div>
                </div>
                {/* Stats */}
                <div style={{ display: 'flex', gap: '2rem' }}>
                    {[
                        { label: 'Total NIL', value: `$${totalNIL.toLocaleString()}`, color: '#4ade80' },
                        { label: 'Active Deals', value: activeDeals, color: '#93c5fd' },
                        { label: 'Done', value: completedDels, color: '#a78bfa' },
                    ].map(s => (
                        <div key={s.label} style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: s.color }}>{s.value}</div>
                            <div style={{ fontSize: '0.67rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700 }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tab Nav + Content */}
            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '1.5rem', alignItems: 'start' }}>
                {/* Sidebar nav */}
                <div style={{ background: 'white', borderRadius: '18px', padding: '0.75rem', border: '1px solid #f1f5f9', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
                    {TABS.map(t => {
                        const active = tab === t.id;
                        return (
                            <button key={t.id} onClick={() => setTab(t.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.75rem 0.9rem', borderRadius: '10px', border: 'none', background: active ? '#eff6ff' : 'transparent', color: active ? '#0052FF' : '#6b7280', fontWeight: active ? 700 : 500, fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.15s', marginBottom: '0.2rem', textAlign: 'left' }}>
                                <t.icon size={16} /> {t.label}
                                {active && <ChevronRight size={14} style={{ marginLeft: 'auto' }} />}
                            </button>
                        );
                    })}
                    <div style={{ borderTop: '1px solid #f3f4f6', marginTop: '0.5rem', paddingTop: '0.5rem' }}>
                        <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.75rem 0.9rem', borderRadius: '10px', border: 'none', background: 'transparent', color: '#dc2626', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}>
                            <LogOut size={16} /> Sign Out
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div>
                    {/* ── A. Profile ── */}
                    {tab === 'profile' && (
                        <>
                            <Section title="Personal Information">
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    {[
                                        { key: 'name', label: 'Full Name', placeholder: 'Jordan Adams' },
                                        { key: 'email', label: 'Email Address', placeholder: 'you@university.edu', type: 'email' },
                                        { key: 'phone', label: 'Phone Number', placeholder: '+1 (555) 000-0000', type: 'tel' },
                                        { key: 'school', label: 'School / University', placeholder: 'State University' },
                                        { key: 'sport', label: 'Sport', placeholder: 'Track & Field' },
                                        { key: 'team', label: 'Team', placeholder: 'Varsity Sprint' },
                                        { key: 'gradYear', label: 'Graduation Year', placeholder: '2028' },
                                    ].map(f => (
                                        <div key={f.key}>
                                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '0.4rem' }}>{f.label}</label>
                                            <input type={f.type || 'text'} placeholder={f.placeholder} value={profile[f.key]} onChange={e => setProfile({ ...profile, [f.key]: e.target.value })} style={inp} onFocus={focusInp} onBlur={blurInp} />
                                        </div>
                                    ))}
                                </div>
                                <div style={{ marginTop: '1rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '0.4rem' }}>Bio</label>
                                    <textarea value={profile.bio} onChange={e => setProfile({ ...profile, bio: e.target.value })} placeholder="Tell brands about yourself..." rows={3} style={{ ...inp, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6 }} onFocus={focusInp} onBlur={blurInp} />
                                </div>
                                <button onClick={() => showSaved('Profile')} style={{ marginTop: '1.25rem', background: '#0052FF', color: 'white', border: 'none', borderRadius: '10px', padding: '0.7rem 1.6rem', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(0,82,255,0.25)' }}>
                                    <Save size={15} /> Save Profile
                                </button>
                            </Section>
                        </>
                    )}

                    {/* ── B. Notifications ── */}
                    {tab === 'notifications' && (
                        <Section title="Notification Preferences">
                            {[
                                { key: 'emailToggle', label: 'Email Notifications', hint: 'Receive notifications via email' },
                                { key: 'agentMessages', label: 'Agent Messages', hint: 'When an agent sends you a message' },
                                { key: 'dealStatus', label: 'Deal Status Changes', hint: 'When a deal is updated or matched' },
                                { key: 'deliverableReminders', label: 'Deliverable Reminders', hint: 'Reminders before upcoming due dates' },
                                { key: 'complianceReminders', label: 'Compliance Reminders', hint: 'Quarterly compliance check-ins' },
                                { key: 'weeklySummary', label: 'Weekly Summary', hint: 'A weekly digest of your NIL activity' },
                                { key: 'marketing', label: 'Marketing & Newsletter', hint: 'Product updates and tips from FrontDoor' },
                                { key: 'pushPlaceholder', label: 'Push Notifications', hint: 'Coming soon — mobile app' },
                            ].map(n => (
                                <FieldRow key={n.key} label={n.label} hint={n.hint}>
                                    <Toggle checked={notifs[n.key]} onChange={v => setNotifs({ ...notifs, [n.key]: v })} />
                                </FieldRow>
                            ))}
                            <button onClick={() => showSaved()} style={{ marginTop: '1.25rem', background: '#0052FF', color: 'white', border: 'none', borderRadius: '10px', padding: '0.7rem 1.6rem', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(0,82,255,0.25)' }}>
                                <Save size={15} /> Save Preferences
                            </button>
                        </Section>
                    )}

                    {/* ── C. Security ── */}
                    {tab === 'security' && (
                        <>
                            <Section title="Change Password">
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '420px' }}>
                                    {[
                                        { key: 'current', label: 'Current Password', placeholder: '••••••••' },
                                        { key: 'next',    label: 'New Password',     placeholder: '••••••••' },
                                        { key: 'confirm', label: 'Confirm New Password', placeholder: '••••••••' },
                                    ].map(f => (
                                        <div key={f.key}>
                                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '0.4rem' }}>{f.label}</label>
                                            <input type="password" placeholder={f.placeholder} value={pwForm[f.key]} onChange={e => setPwForm({ ...pwForm, [f.key]: e.target.value })} style={inp} onFocus={focusInp} onBlur={blurInp} />
                                        </div>
                                    ))}
                                    {pwMsg && <div style={{ fontSize: '0.82rem', color: pwMsg.includes('✓') ? '#059669' : '#dc2626', fontWeight: 600 }}>{pwMsg}</div>}
                                    <button onClick={() => {
                                        if (!pwForm.next || pwForm.next !== pwForm.confirm) { setPwMsg('Passwords do not match.'); return; }
                                        if (pwForm.next.length < 6) { setPwMsg('Password must be at least 6 characters.'); return; }
                                        setPwMsg('✓ Password updated successfully!');
                                        setPwForm({ current: '', next: '', confirm: '' });
                                        logActivity('security_updated', 'Password changed');
                                    }} style={{ background: '#0052FF', color: 'white', border: 'none', borderRadius: '10px', padding: '0.7rem 1.4rem', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', width: 'fit-content' }}>
                                        Update Password
                                    </button>
                                </div>
                            </Section>
                            <Section title="Advanced Security">
                                {[
                                    { label: 'Two-Factor Authentication', hint: 'Coming soon — adds an extra layer of security', tag: 'Soon' },
                                    { label: 'Active Sessions', hint: 'Manage devices where you\'re signed in', tag: '1 device' },
                                ].map(r => (
                                    <FieldRow key={r.label} label={r.label} hint={r.hint}>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6b7280', background: '#f3f4f6', padding: '0.2rem 0.7rem', borderRadius: '99px' }}>{r.tag}</span>
                                    </FieldRow>
                                ))}
                                <FieldRow label="Sign Out All Devices" hint="Ends all active sessions except this one">
                                    <button onClick={() => showSaved()} style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '8px', padding: '0.4rem 0.9rem', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}>Sign Out All</button>
                                </FieldRow>
                            </Section>
                        </>
                    )}

                    {/* ── D. Privacy ── */}
                    {tab === 'privacy' && (
                        <>
                            <Section title="Profile & Discovery">
                                <FieldRow label="Profile Visibility" hint="Who can view your NIL profile">
                                    <select value={privacy.profileVisibility} onChange={e => setPrivacy({ ...privacy, profileVisibility: e.target.value })} style={{ padding: '0.5rem 0.85rem', borderRadius: '8px', border: '1.5px solid #e5e7eb', fontSize: '0.85rem', outline: 'none', background: 'white', cursor: 'pointer' }}>
                                        {['Public to Brands', 'Contacts Only', 'Private'].map(o => <option key={o}>{o}</option>)}
                                    </select>
                                </FieldRow>
                                <FieldRow label="Agent Discovery" hint="Allow agents to find and message you">
                                    <Toggle checked={privacy.agentDiscovery} onChange={v => setPrivacy({ ...privacy, agentDiscovery: v })} />
                                </FieldRow>
                            </Section>
                            <Section title="Data & Account">
                                <FieldRow label="Export My Data" hint="Download a copy of all your NIL records">
                                    <button onClick={() => showSaved()} style={{ background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '0.4rem 0.9rem', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}>Export</button>
                                </FieldRow>
                                <FieldRow label="Delete Account" hint="Permanently delete your FrontDoor account and all data">
                                    <button style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '8px', padding: '0.4rem 0.9rem', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}>Delete</button>
                                </FieldRow>
                            </Section>
                            <button onClick={() => showSaved('Privacy settings')} style={{ background: '#0052FF', color: 'white', border: 'none', borderRadius: '10px', padding: '0.7rem 1.6rem', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,82,255,0.25)' }}>Save Privacy Settings</button>
                        </>
                    )}

                    {/* ── E. Compliance Prefs ── */}
                    {tab === 'compliance' && (
                        <Section title="Compliance Preferences">
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '0.4rem' }}>Reminder Frequency</label>
                                    <select value={compPrefs.reminderFreq} onChange={e => setCompPrefs({ ...compPrefs, reminderFreq: e.target.value })} style={{ ...inp, cursor: 'pointer' }}>
                                        {['Monthly', 'Quarterly', 'Semester', 'Annual'].map(o => <option key={o}>{o}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '0.4rem' }}>Days Before Due Date</label>
                                    <select value={compPrefs.daysBeforeDue} onChange={e => setCompPrefs({ ...compPrefs, daysBeforeDue: e.target.value })} style={{ ...inp, cursor: 'pointer' }}>
                                        {['3', '7', '14', '30'].map(o => <option key={o}>{o} days</option>)}
                                    </select>
                                </div>
                            </div>
                            <div style={{ marginBottom: '1.25rem' }}>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '0.4rem' }}>University Compliance Contact Email</label>
                                <input type="email" placeholder="compliance@university.edu" value={compPrefs.universityContact} onChange={e => setCompPrefs({ ...compPrefs, universityContact: e.target.value })} style={inp} onFocus={focusInp} onBlur={blurInp} />
                            </div>
                            <FieldRow label="Required Documentation Reminders" hint="Get reminded to upload proof documents for each deal">
                                <Toggle checked={compPrefs.docReminders} onChange={v => setCompPrefs({ ...compPrefs, docReminders: v })} />
                            </FieldRow>
                            <button onClick={() => showSaved()} style={{ marginTop: '1.25rem', background: '#0052FF', color: 'white', border: 'none', borderRadius: '10px', padding: '0.7rem 1.6rem', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(0,82,255,0.25)' }}>
                                <Save size={15} /> Save Compliance Prefs
                            </button>
                        </Section>
                    )}
                </div>
            </div>
        </div>
    );
}
