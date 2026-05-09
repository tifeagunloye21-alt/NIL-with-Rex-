import { useState } from 'react';
import { User, Mail, MapPin, Edit3, Twitter, Instagram, LogOut, Camera } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
    const { currentUser, deals, deliverables, logout } = useAppContext();
    const navigate = useNavigate();
    const [editingBio, setEditingBio] = useState(false);
    const [bio, setBio] = useState('I am a specialized student athlete dedicated to maximizing platform brand potential and focusing deeply on integrating community growth tactics while maintaining the height of performance on the track.');

    const firstName = currentUser?.name?.split(' ')[0] || 'Athlete';
    const initials = currentUser?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'A';
    const totalNIL = deals.reduce((s, d) => s + Number(d.dealValue || 0), 0);
    const activeDeals = deals.filter(d => d.status === 'Active').length;
    const completedDels = deliverables.filter(d => d.status === 'Completed').length;

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <div style={{ padding: '2.25rem 2.5rem', background: '#f8fafc', minHeight: '100vh' }}>

            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#0a0a0a', margin: 0 }}>Profile</h1>
                <p style={{ color: '#6b7280', marginTop: '0.3rem', fontSize: '0.95rem' }}>Manage your account and NIL presence</p>
            </div>

            {/* Profile Hero Card */}
            <div style={{ background: 'linear-gradient(135deg, #0B0F1A 0%, #1a2340 100%)', borderRadius: '24px', padding: '2.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '2rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', background: 'rgba(0,82,255,0.08)', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', bottom: '-30px', left: '200px', width: '100px', height: '100px', background: 'rgba(255,255,255,0.03)', borderRadius: '50%' }} />

                {/* Avatar */}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                    <div style={{ width: '96px', height: '96px', borderRadius: '24px', background: 'linear-gradient(135deg, #0052FF, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 900, color: 'white', boxShadow: '0 8px 32px rgba(0,82,255,0.35)' }}>
                        {initials}
                    </div>
                    <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', width: '24px', height: '24px', background: '#22c55e', borderRadius: '50%', border: '3px solid #0B0F1A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'white' }} />
                    </div>
                </div>

                {/* Info */}
                <div style={{ position: 'relative', flex: 1 }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', marginBottom: '0.2rem' }}>
                        {currentUser?.name || 'Demo Athlete'}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginBottom: '1rem' }}>
                        Student Athlete · Class of 2028
                    </div>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem' }}>
                            <Mail size={13} /> {currentUser?.email || `${firstName.toLowerCase()}@university.edu`}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem' }}>
                            <MapPin size={13} /> Campus Housing
                        </div>
                    </div>
                </div>

                {/* NIL Stats */}
                <div style={{ display: 'flex', gap: '2rem', position: 'relative' }}>
                    {[
                        { label: 'Total NIL', value: `$${totalNIL.toLocaleString()}`, color: '#4ade80' },
                        { label: 'Active Deals', value: activeDeals, color: '#93c5fd' },
                        { label: 'Deliverables Done', value: completedDels, color: '#a78bfa' },
                    ].map(s => (
                        <div key={s.label} style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: s.color }}>{s.value}</div>
                            <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700 }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Content Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1.25rem' }}>

                {/* NIL Profile Card */}
                <div style={{ background: 'white', borderRadius: '20px', padding: '1.75rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#111827' }}>NIL Profile</h3>

                    {[
                        { label: 'Sport', value: 'Track & Field' },
                        { label: 'School', value: 'State University' },
                        { label: 'Followers', value: '12.4K' },
                        { label: 'Audience', value: 'College Sports' },
                        { label: 'NIL Market Value', value: '$85,000 est.' },
                    ].map(row => (
                        <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: '1px solid #f9fafb' }}>
                            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#9ca3af' }}>{row.label}</span>
                            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#111827' }}>{row.value}</span>
                        </div>
                    ))}

                    <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.6rem' }}>Social Profiles</div>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            {[
                                { Icon: Twitter, color: '#1DA1F2', label: '@frontdoor' },
                                { Icon: Instagram, color: '#E1306C', label: '@frontdoor' },
                            ].map(({ Icon, color, label }) => (
                                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#f9fafb', borderRadius: '8px', padding: '0.4rem 0.75rem', fontSize: '0.78rem', fontWeight: 600, color: '#374151' }}>
                                    <Icon size={13} color={color} /> {label}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                    {/* Biography */}
                    <div style={{ background: 'white', borderRadius: '20px', padding: '1.75rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#111827' }}>Biography</h3>
                            <button
                                onClick={() => setEditingBio(v => !v)}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'transparent', border: '1px solid #e5e7eb', color: '#374151', borderRadius: '8px', padding: '0.4rem 0.75rem', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                                <Edit3 size={13} /> {editingBio ? 'Cancel' : 'Edit'}
                            </button>
                        </div>
                        {editingBio ? (
                            <div>
                                <textarea
                                    value={bio}
                                    onChange={e => setBio(e.target.value)}
                                    style={{ width: '100%', minHeight: '100px', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '0.875rem', fontFamily: 'inherit', resize: 'vertical', outline: 'none', color: '#374151', lineHeight: 1.6 }}
                                />
                                <button onClick={() => setEditingBio(false)} style={{ marginTop: '0.75rem', background: '#0052FF', color: 'white', border: 'none', borderRadius: '8px', padding: '0.5rem 1.2rem', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
                                    Save Changes
                                </button>
                            </div>
                        ) : (
                            <p style={{ margin: 0, color: '#4b5563', lineHeight: 1.7, fontSize: '0.875rem' }}>{bio}</p>
                        )}
                    </div>

                    {/* Preferences */}
                    <div style={{ background: 'white', borderRadius: '20px', padding: '1.75rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
                        <h3 style={{ margin: '0 0 1.25rem', fontSize: '1rem', fontWeight: 700, color: '#111827' }}>Preferences</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            {[
                                { label: 'Email Notifications', options: ['All notifications', 'Important only', 'None'] },
                                { label: 'Profile Visibility', options: ['Public to Brands', 'Contacts Only', 'Private'] },
                            ].map(f => (
                                <div key={f.label} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#6b7280' }}>{f.label}</label>
                                    <select style={{ padding: '0.65rem 0.875rem', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '0.875rem', fontFamily: 'inherit', color: '#374151', background: 'white', outline: 'none' }}>
                                        {f.options.map(o => <option key={o}>{o}</option>)}
                                    </select>
                                </div>
                            ))}
                        </div>
                        <button style={{ marginTop: '1.25rem', background: '#0052FF', color: 'white', border: 'none', borderRadius: '10px', padding: '0.65rem 1.5rem', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,82,255,0.2)' }}>
                            Save Preferences
                        </button>
                    </div>

                    {/* Logout */}
                    <div style={{ background: 'white', borderRadius: '16px', padding: '1.25rem 1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#111827' }}>Sign out of FrontDoor</div>
                            <div style={{ fontSize: '0.78rem', color: '#9ca3af', marginTop: '0.1rem' }}>You'll need to log back in to access your dashboard</div>
                        </div>
                        <button
                            onClick={handleLogout}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#fef2f2', color: '#dc2626', border: '1px solid #fca5a5', borderRadius: '10px', padding: '0.6rem 1.2rem', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>
                            <LogOut size={14} /> Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
