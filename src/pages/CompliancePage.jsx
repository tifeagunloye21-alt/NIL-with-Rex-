import { useState } from 'react';
import { ShieldCheck, AlertCircle, FileText, CheckCircle, ExternalLink } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function CompliancePage() {
    const { myDeals: deals } = useAppContext();
    const [resolvedIds, setResolvedIds] = useState([]);

    const pending = deals.filter(d => d.disclosureRequired && !d.reportedToSchool && !resolvedIds.includes(d.id));
    const compliant = deals.filter(d => d.reportedToSchool || !d.disclosureRequired || resolvedIds.includes(d.id));
    const allClear = pending.length === 0;

    const COMPLIANCE_SCORE = Math.round((compliant.length / Math.max(deals.length, 1)) * 100);

    return (
        <div style={{ padding: '2.25rem 2.5rem', background: '#f8fafc', minHeight: '100vh' }}>

            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#0a0a0a', margin: 0 }}>Compliance Hub</h1>
                <p style={{ color: '#6b7280', marginTop: '0.3rem', fontSize: '0.95rem' }}>Review and settle your institutional clearance logs</p>
            </div>

            {/* Status Banner */}
            <div style={{
                background: allClear
                    ? 'linear-gradient(135deg, #f0fdf4, #dcfce7)'
                    : 'linear-gradient(135deg, #fffbeb, #fef9c3)',
                border: `1px solid ${allClear ? '#86efac' : '#fde68a'}`,
                borderRadius: '20px', padding: '1.75rem 2rem',
                display: 'flex', alignItems: 'center', gap: '1.5rem',
                marginBottom: '1.75rem', position: 'relative', overflow: 'hidden'
            }}>
                <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '120px', height: '120px', background: allClear ? 'rgba(34,197,94,0.06)' : 'rgba(245,158,11,0.08)', borderRadius: '50%' }} />
                <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: allClear ? '#22c55e' : '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: allClear ? '0 8px 24px rgba(34,197,94,0.25)' : '0 8px 24px rgba(245,158,11,0.25)' }}>
                    {allClear ? <ShieldCheck size={30} color="white" /> : <AlertCircle size={30} color="white" />}
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem', color: allClear ? '#14532d' : '#78350f' }}>
                        {allClear ? '✓ All Clear — Fully Compliant' : `${pending.length} Pending Disclosure${pending.length > 1 ? 's' : ''}`}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: allClear ? '#16a34a' : '#b45309', marginTop: '0.3rem' }}>
                        {allClear
                            ? 'All your deals are properly disclosed to your institution. Keep it up!'
                            : 'Report the deals below to your school to maintain good standing.'}
                    </div>
                </div>

                {/* Score meters */}
                <div style={{ display: 'flex', gap: '2rem', position: 'relative' }}>
                    {[
                        { label: 'Compliance Score', value: `${COMPLIANCE_SCORE}%`, color: allClear ? '#22c55e' : '#f59e0b' },
                        { label: 'Compliant Deals', value: compliant.length, color: '#22c55e' },
                        { label: 'Total Deals', value: deals.length, color: '#6b7280' },
                    ].map(s => (
                        <div key={s.label} style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: s.color }}>{s.value}</div>
                            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Pending Disclosures */}
            {pending.length > 0 && (
                <div style={{ background: 'white', borderRadius: '20px', padding: '1.75rem 2rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9', marginBottom: '1.5rem' }}>
                    <h2 style={{ margin: '0 0 1.25rem', fontSize: '1rem', fontWeight: 700, color: '#111827', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <AlertCircle size={18} color="#f59e0b" /> Action Required
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {pending.map((d, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.25rem', borderRadius: '14px', border: '1px solid #fde68a', background: 'linear-gradient(135deg, #fffbeb, #fefce8)' }}>
                                <div style={{ width: '44px', height: '44px', borderRadius: '11px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <AlertCircle size={20} color="#f59e0b" />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem', color: '#111827' }}>{d.brand} — {d.dealTitle}</h4>
                                    <p style={{ margin: '0.2rem 0 0', fontSize: '0.78rem', color: '#b45309' }}>
                                        {d.dealType} · Started {d.startDate} · ${Number(d.dealValue || 0).toLocaleString()} value
                                    </p>
                                </div>
                                <button
                                    onClick={() => setResolvedIds(prev => [...prev, d.id])}
                                    style={{ background: '#f59e0b', color: 'white', border: 'none', borderRadius: '10px', padding: '0.6rem 1.2rem', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', whiteSpace: 'nowrap' }}>
                                    <ExternalLink size={13} /> Report to School
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Cleared Deals */}
            <div style={{ background: 'white', borderRadius: '20px', padding: '1.75rem 2rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
                <h2 style={{ margin: '0 0 1.25rem', fontSize: '1rem', fontWeight: 700, color: '#111827', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FileText size={18} color="#6b7280" /> Past Submissions
                </h2>

                {compliant.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem 0', color: '#9ca3af' }}>
                        <FileText size={36} style={{ marginBottom: '0.75rem', opacity: 0.4 }} />
                        <p style={{ margin: 0, fontWeight: 600 }}>No cleared deals yet</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                        {compliant.map((d, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderRadius: '12px', background: '#f9fafb', border: '1px solid #f1f5f9' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }} />
                                    <div>
                                        <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827' }}>{d.brand}</span>
                                        <span style={{ fontSize: '0.78rem', color: '#9ca3af', marginLeft: '0.5rem' }}>{d.dealType} · ${Number(d.dealValue || 0).toLocaleString()}</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{d.startDate}</span>
                                    <span style={{ background: '#ecfdf5', color: '#059669', fontSize: '0.7rem', fontWeight: 800, padding: '0.2rem 0.65rem', borderRadius: '99px', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                        <CheckCircle size={10} /> CLEARED
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
