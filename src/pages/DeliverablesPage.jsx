import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, CheckCircle, AlertCircle, Plus, Edit2, Save, X, ExternalLink } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const STATUS_CONFIG = {
    Completed:        { bg: '#ecfdf5', color: '#059669', dot: '#22c55e', pct: 100, barColor: '#22c55e' },
    'In Progress':    { bg: '#eff6ff', color: '#2563eb', dot: '#0052FF', pct: 60,  barColor: '#0052FF' },
    Upcoming:         { bg: '#eff6ff', color: '#4f46e5', dot: '#6366f1', pct: 20,  barColor: '#6366f1' },
    'Pending Approval':{ bg: '#fffbeb', color: '#d97706', dot: '#f59e0b', pct: 75, barColor: '#f59e0b' },
    Overdue:          { bg: '#fef2f2', color: '#dc2626', dot: '#ef4444', pct: 10,  barColor: '#ef4444' },
    Pending:          { bg: '#f9fafb', color: '#6b7280', dot: '#9ca3af', pct: 0,   barColor: '#e5e7eb' },
};

const FILTER_TABS = ['All', 'Upcoming', 'In Progress', 'Pending Approval', 'Completed', 'Overdue'];
const DEL_STATUSES = ['Upcoming', 'In Progress', 'Pending Approval', 'Completed', 'Overdue'];
const DEL_TYPES = ['Instagram Post', 'Instagram Story', 'TikTok', 'YouTube', 'Twitter/X', 'Appearance', 'Brand Shoot', 'Podcast', 'Newsletter', 'Affiliate Link', 'Other'];

export default function DeliverablesPage() {
    const { myDeliverables, myDeals, markDeliverableComplete, updateDeliverable, deleteDeliverable } = useAppContext();
    const navigate = useNavigate();
    const [filter, setFilter] = useState('All');
    const [editingId, setEditingId] = useState(null);
    const [editBuf, setEditBuf] = useState({});
    const [savingId, setSavingId] = useState(null);
    const [successId, setSuccessId] = useState(null);

    const filtered = filter === 'All' ? myDeliverables : myDeliverables.filter(d => d.status === filter);

    const counts = FILTER_TABS.reduce((acc, tab) => {
        acc[tab] = tab === 'All' ? myDeliverables.length : myDeliverables.filter(d => d.status === tab).length;
        return acc;
    }, {});

    const startEdit = (item) => {
        setEditingId(item.id);
        setEditBuf({ name: item.name, type: item.type, date: item.date, status: item.status, notes: item.notes || '' });
    };

    const saveEdit = useCallback((id) => {
        setSavingId(id);
        setTimeout(() => {
            updateDeliverable(id, editBuf);
            setSavingId(null);
            setEditingId(null);
            setSuccessId(id);
            setTimeout(() => setSuccessId(null), 1800);
        }, 350);
    }, [editBuf, updateDeliverable]);

    const handleMarkComplete = (id) => {
        markDeliverableComplete(id);
        setSuccessId(id);
        setTimeout(() => setSuccessId(null), 1800);
    };

    const inp = { width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1.5px solid #e5e7eb', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box', background: 'white' };

    return (
        <div style={{ padding: '2.25rem 2.5rem', background: '#f8fafc', minHeight: '100vh' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#0a0a0a', margin: 0 }}>Deliverables</h1>
                    <p style={{ color: '#6b7280', marginTop: '0.3rem', fontSize: '0.95rem' }}>Track your content obligations and appearances</p>
                </div>
                <button onClick={() => navigate('/report-deal')}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#0052FF', color: 'white', border: 'none', borderRadius: '10px', padding: '0.75rem 1.4rem', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 4px 14px rgba(0,82,255,0.25)' }}>
                    <Plus size={16} /> Report New Deal
                </button>
            </div>

            {/* Summary Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', marginBottom: '1.75rem' }}>
                {[
                    { label: 'Total', count: myDeliverables.length, color: '#6b7280', bg: '#f9fafb' },
                    { label: 'In Progress', count: counts['In Progress'], color: '#2563eb', bg: '#eff6ff' },
                    { label: 'Overdue', count: counts['Overdue'], color: '#dc2626', bg: '#fef2f2' },
                    { label: 'Pending Review', count: counts['Pending Approval'], color: '#d97706', bg: '#fffbeb' },
                    { label: 'Completed', count: counts['Completed'], color: '#059669', bg: '#ecfdf5' },
                ].map(s => (
                    <div key={s.label} style={{ background: s.bg, borderRadius: '14px', padding: '1rem 1.25rem', border: `1px solid ${s.bg}` }}>
                        <div style={{ fontSize: '1.6rem', fontWeight: 900, color: s.color }}>{s.count}</div>
                        <div style={{ fontSize: '0.73rem', fontWeight: 700, color: s.color, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
                {FILTER_TABS.map(tab => {
                    const count = counts[tab];
                    const active = filter === tab;
                    return (
                        <button key={tab} onClick={() => setFilter(tab)}
                            style={{ padding: '0.45rem 1rem', borderRadius: '99px', border: '2px solid', borderColor: active ? '#0052FF' : '#e5e7eb', background: active ? '#0052FF' : 'white', color: active ? 'white' : '#374151', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            {tab}
                            {count > 0 && <span style={{ background: active ? 'rgba(255,255,255,0.25)' : '#f3f4f6', color: active ? 'white' : '#6b7280', borderRadius: '99px', padding: '0 0.4rem', fontSize: '0.72rem', fontWeight: 800 }}>{count}</span>}
                        </button>
                    );
                })}
            </div>

            {/* Cards Grid */}
            {filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 0', color: '#9ca3af' }}>
                    <CheckCircle size={40} style={{ marginBottom: '0.75rem', opacity: 0.4 }} />
                    <p style={{ margin: 0, fontWeight: 600, fontSize: '1rem' }}>
                        {filter === 'All' ? 'No deliverables yet' : `No ${filter.toLowerCase()} deliverables`}
                    </p>
                    <p style={{ margin: '0.5rem 0 1.25rem', fontSize: '0.875rem' }}>
                        {filter === 'All' ? 'Your deliverables will appear here once you report a deal.' : 'Nothing in this category right now.'}
                    </p>
                    {filter === 'All' && (
                        <button onClick={() => navigate('/report-deal')} style={{ background: '#0052FF', color: 'white', border: 'none', borderRadius: '8px', padding: '0.65rem 1.4rem', fontWeight: 700, cursor: 'pointer' }}>
                            Report a Deal
                        </button>
                    )}
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                    {filtered.map((item) => {
                        const sc = STATUS_CONFIG[item.status] || STATUS_CONFIG['Pending'];
                        const isEditing = editingId === item.id;
                        const isSaving = savingId === item.id;
                        const justSaved = successId === item.id && !isEditing;
                        const dealName = myDeals.find(d => d.id === item.dealId)?.brand;

                        return (
                            <div key={item.id}
                                style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', border: `1px solid ${justSaved ? '#86efac' : '#f1f5f9'}`, boxShadow: justSaved ? '0 0 0 3px rgba(34,197,94,0.1)' : '0 2px 8px rgba(0,0,0,0.04)', transition: 'all 0.25s' }}>
                                {isEditing ? (
                                    /* ── Edit Mode ── */
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                                        <input value={editBuf.name} onChange={e => setEditBuf(b => ({ ...b, name: e.target.value }))} placeholder="Deliverable title" style={inp} />
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                                            <select value={editBuf.type} onChange={e => setEditBuf(b => ({ ...b, type: e.target.value }))} style={{ ...inp, cursor: 'pointer' }}>
                                                {DEL_TYPES.map(t => <option key={t}>{t}</option>)}
                                            </select>
                                            <input type="date" value={editBuf.date} onChange={e => setEditBuf(b => ({ ...b, date: e.target.value }))} style={inp} />
                                        </div>
                                        <select value={editBuf.status} onChange={e => setEditBuf(b => ({ ...b, status: e.target.value }))} style={{ ...inp, cursor: 'pointer' }}>
                                            {DEL_STATUSES.map(s => <option key={s}>{s}</option>)}
                                        </select>
                                        <input value={editBuf.notes} onChange={e => setEditBuf(b => ({ ...b, notes: e.target.value }))} placeholder="Notes (optional)" style={inp} />
                                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                                            <button onClick={() => saveEdit(item.id)} disabled={isSaving}
                                                style={{ flex: 1, background: '#0052FF', color: 'white', border: 'none', borderRadius: '8px', padding: '0.6rem', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', opacity: isSaving ? 0.7 : 1 }}>
                                                <Save size={13} /> {isSaving ? 'Saving...' : 'Save Changes'}
                                            </button>
                                            <button onClick={() => setEditingId(null)}
                                                style={{ flex: 1, background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '8px', padding: '0.6rem', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    /* ── View Mode ── */
                                    <>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                            <span style={{ background: sc.bg, color: sc.color, padding: '0.2rem 0.65rem', borderRadius: '99px', fontSize: '0.72rem', fontWeight: 800 }}>{item.status}</span>
                                            <div style={{ display: 'flex', gap: '0.35rem' }}>
                                                <span style={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: 600 }}>{item.type}</span>
                                                <button onClick={() => startEdit(item)} title="Edit" style={{ background: '#eff6ff', color: '#2563eb', border: 'none', borderRadius: '6px', padding: '0.25rem 0.45rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                                    <Edit2 size={12} />
                                                </button>
                                                <button onClick={() => deleteDeliverable(item.id)} title="Delete" style={{ background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: '6px', padding: '0.25rem 0.45rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        </div>

                                        <h3 style={{ margin: '0 0 0.2rem', fontWeight: 700, fontSize: '1rem', color: '#111827' }}>{item.name}</h3>
                                        <p style={{ margin: '0 0 0.75rem', fontSize: '0.82rem', color: '#6b7280', fontWeight: 500 }}>{item.brand}</p>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: item.status === 'Overdue' ? '#ef4444' : '#9ca3af', marginBottom: '1rem', fontWeight: item.status === 'Overdue' ? 700 : 400 }}>
                                            {item.status === 'Overdue' ? <AlertCircle size={13} /> : <Calendar size={13} />}
                                            Due: {item.date}
                                        </div>

                                        {/* Progress Bar */}
                                        <div style={{ height: '6px', background: '#f3f4f6', borderRadius: '3px', overflow: 'hidden', marginBottom: '0.5rem' }}>
                                            <div style={{ width: `${sc.pct}%`, height: '100%', background: sc.barColor, borderRadius: '3px', transition: 'width 0.4s ease' }} />
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{sc.pct}% Complete</span>
                                            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                                                {dealName && (
                                                    <button onClick={() => navigate(`/deals/${item.dealId}`)} title="View deal" style={{ background: '#f8fafc', color: '#6b7280', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '0.22rem 0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.7rem', fontWeight: 600 }}>
                                                        <ExternalLink size={11} /> {dealName}
                                                    </button>
                                                )}
                                                {item.status !== 'Completed' && (
                                                    <button onClick={() => handleMarkComplete(item.id)}
                                                        style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', background: '#ecfdf5', border: 'none', borderRadius: '7px', padding: '0.25rem 0.65rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                                        <CheckCircle size={12} /> Mark Complete
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {justSaved && (
                                            <div style={{ marginTop: '0.75rem', background: '#ecfdf5', color: '#059669', padding: '0.4rem 0.75rem', borderRadius: '7px', fontSize: '0.78rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                <CheckCircle size={13} /> Saved!
                                            </div>
                                        )}

                                        {item.notes && (
                                            <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #f3f4f6', fontSize: '0.78rem', color: '#9ca3af' }}>{item.notes}</div>
                                        )}
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
