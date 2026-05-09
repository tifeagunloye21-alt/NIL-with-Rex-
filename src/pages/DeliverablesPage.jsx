import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, CheckCircle, AlertCircle, Clock, Plus } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const STATUS_CONFIG = {
    Completed: { bg: '#ecfdf5', color: '#059669', dot: '#22c55e', pct: 100, barColor: '#22c55e' },
    'In Progress': { bg: '#eff6ff', color: '#2563eb', dot: '#0052FF', pct: 60, barColor: '#0052FF' },
    Upcoming: { bg: '#eff6ff', color: '#2563eb', dot: '#0052FF', pct: 20, barColor: '#0052FF' },
    'Pending Approval': { bg: '#fffbeb', color: '#d97706', dot: '#f59e0b', pct: 75, barColor: '#f59e0b' },
    Overdue: { bg: '#fef2f2', color: '#dc2626', dot: '#ef4444', pct: 10, barColor: '#ef4444' },
    Pending: { bg: '#f9fafb', color: '#6b7280', dot: '#9ca3af', pct: 0, barColor: '#e5e7eb' },
};

const FILTER_TABS = ['All', 'Upcoming', 'In Progress', 'Completed', 'Overdue', 'Pending Approval'];

export default function DeliverablesPage() {
    const { deliverables, markDeliverableComplete } = useAppContext();
    const navigate = useNavigate();
    const [filter, setFilter] = useState('All');

    const filtered = filter === 'All' ? deliverables : deliverables.filter(d => d.status === filter);

    const counts = FILTER_TABS.reduce((acc, tab) => {
        acc[tab] = tab === 'All' ? deliverables.length : deliverables.filter(d => d.status === tab).length;
        return acc;
    }, {});

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
                    <p style={{ margin: 0, fontWeight: 600, fontSize: '1rem' }}>No deliverables in this category</p>
                    <p style={{ margin: '0.5rem 0 1.25rem', fontSize: '0.875rem' }}>Your deliverables will appear here once you report a deal.</p>
                    <button onClick={() => navigate('/report-deal')}
                        style={{ background: '#0052FF', color: 'white', border: 'none', borderRadius: '8px', padding: '0.65rem 1.4rem', fontWeight: 700, cursor: 'pointer' }}>
                        Report a Deal
                    </button>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                    {filtered.map((item) => {
                        const sc = STATUS_CONFIG[item.status] || STATUS_CONFIG['Pending'];
                        return (
                            <div key={item.id} style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', border: '1px solid #f1f5f9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'box-shadow 0.15s' }}
                                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'}
                                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'}>
                                {/* Status + Type */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                    <span style={{ background: sc.bg, color: sc.color, padding: '0.2rem 0.65rem', borderRadius: '99px', fontSize: '0.72rem', fontWeight: 800 }}>{item.status}</span>
                                    <span style={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: 600 }}>{item.type}</span>
                                </div>
                                {/* Name */}
                                <h3 style={{ margin: '0 0 0.25rem', fontWeight: 700, fontSize: '1rem', color: '#111827' }}>{item.name}</h3>
                                <p style={{ margin: '0 0 0.75rem', fontSize: '0.82rem', color: '#6b7280', fontWeight: 500 }}>{item.brand}</p>
                                {/* Date */}
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
                                    {item.status !== 'Completed' && (
                                        <button onClick={() => markDeliverableComplete(item.id)}
                                            style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', background: '#ecfdf5', border: 'none', borderRadius: '7px', padding: '0.25rem 0.65rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                            <CheckCircle size={12} /> Mark Complete
                                        </button>
                                    )}
                                </div>
                                {item.notes && (
                                    <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #f3f4f6', fontSize: '0.78rem', color: '#9ca3af' }}>{item.notes}</div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
