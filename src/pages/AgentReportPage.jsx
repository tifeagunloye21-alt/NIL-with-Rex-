import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { CheckCircle, Plus, Trash2, ArrowRight, Users } from 'lucide-react';

const DELIVERABLE_TYPES = ['Instagram Post', 'Instagram Story', 'TikTok', 'YouTube Video', 'Appearance', 'Autograph Session', 'Brand Shoot', 'Training Camp Promo', 'Other'];

/**
 * Agent Report Page
 * Allows agents to submit a deal report on behalf of an athlete.
 * The reconciliation engine in AppContext will detect if the athlete
 * already reported the same deal and auto-merge them into one record.
 */
export default function AgentReportPage() {
    const navigate = useNavigate();
    const { submitDealReport, currentUser } = useAppContext();
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        brand: '', dealTitle: '', dealType: '',
        compType: 'Cash', cashValue: '', nonCashValue: '', nonCashDescription: '', nonCashCategory: '',
        startDate: '', endDate: '',
        athleteId: '', athleteName: '',
        notes: '', deliverables: []
    });
    const [draftDeliv, setDraftDeliv] = useState({ type: 'Instagram Post', date: '', description: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleAddDeliverable = () => {
        if (!draftDeliv.date || !draftDeliv.type) return;
        setForm(prev => ({ ...prev, deliverables: [...prev.deliverables, { ...draftDeliv }] }));
        setDraftDeliv({ type: 'Instagram Post', date: '', description: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        submitDealReport({ ...form, submittedByRole: 'agent', agentId: currentUser?.id || '', agentName: currentUser?.name || '' });
        setLoading(false);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', background: '#f8fafc', padding: '2rem' }}>
                <div style={{ background: 'white', borderRadius: '24px', padding: '3rem 2.5rem', maxWidth: '460px', width: '100%', textAlign: 'center', boxShadow: '0 8px 40px rgba(0,82,255,0.1)' }}>
                    <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                        <CheckCircle size={36} color="white" />
                    </div>
                    <h2 style={{ fontWeight: 800, fontSize: '1.4rem', color: '#111827', margin: '0 0 0.5rem' }}>Deal Report Submitted!</h2>
                    <p style={{ color: '#6b7280', margin: '0 0 1.5rem', lineHeight: 1.5 }}>
                        Your report for <strong>{form.brand}</strong> has been submitted. If the athlete reported the same deal, it will be automatically matched.
                    </p>
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                        <button onClick={() => navigate('/athlete-dashboard')}
                            style={{ background: '#7c3aed', color: 'white', border: 'none', borderRadius: '10px', padding: '0.75rem 1.5rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            Back to Dashboard <ArrowRight size={16} />
                        </button>
                        <button onClick={() => { setSubmitted(false); setForm({ brand: '', dealTitle: '', dealType: '', compType: 'Cash', cashValue: '', nonCashValue: '', nonCashDescription: '', nonCashCategory: '', startDate: '', endDate: '', athleteId: '', athleteName: '', notes: '', deliverables: [] }); }}
                            style={{ background: 'white', color: '#374151', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '0.75rem 1.5rem', fontWeight: 700, cursor: 'pointer' }}>
                            Submit Another
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const sectionStyle = { background: 'white', borderRadius: '20px', padding: '2rem', marginBottom: '1.25rem', border: '1px solid #f1f5f9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' };
    const sectionHeadStyle = { fontSize: '0.72rem', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid #f3f4f6' };
    const rowStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' };
    const labelStyle = { display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '0.4rem' };
    const inputStyle = { width: '100%', padding: '0.7rem 0.9rem', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '0.9rem', color: '#111827', background: 'white', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' };

    return (
        <div style={{ padding: '2.25rem 2.5rem', background: '#f8fafc', minHeight: '100vh' }}>
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Users size={14} color="#7c3aed" />
                    </div>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Agent Portal</span>
                </div>
                <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#0a0a0a', margin: '0 0 0.25rem' }}>Report a Deal</h1>
                <p style={{ color: '#6b7280', fontSize: '0.95rem', margin: 0 }}>Submit a deal on behalf of your athlete. If they've already reported it, the system will automatically merge the records.</p>
            </div>

            <form onSubmit={handleSubmit} style={{ maxWidth: '820px' }}>
                {/* Athlete Info */}
                <div style={sectionStyle}>
                    <div style={sectionHeadStyle}>Athlete Information</div>
                    <div style={rowStyle}>
                        <div>
                            <label style={labelStyle}>Athlete Name *</label>
                            <input name="athleteName" value={form.athleteName} onChange={handleChange} required placeholder="e.g. Jordan Smith" style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>Athlete Email / ID</label>
                            <input name="athleteId" value={form.athleteId} onChange={handleChange} placeholder="athlete@university.edu" style={inputStyle} />
                        </div>
                    </div>
                </div>

                {/* Basic Details */}
                <div style={sectionStyle}>
                    <div style={sectionHeadStyle}>Deal Details</div>
                    <div style={{ ...rowStyle, marginBottom: '1rem' }}>
                        <div>
                            <label style={labelStyle}>Brand / Company Name *</label>
                            <input name="brand" value={form.brand} onChange={handleChange} required placeholder="e.g. Nike" style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>Deal Title</label>
                            <input name="dealTitle" value={form.dealTitle} onChange={handleChange} placeholder="e.g. Spring Campaign" style={inputStyle} />
                        </div>
                    </div>
                    <div>
                        <label style={labelStyle}>Deal Type *</label>
                        <select name="dealType" value={form.dealType} onChange={handleChange} required style={inputStyle}>
                            <option value="">Select type...</option>
                            {['Social Post', 'Appearance', 'Product Exchange', 'Affiliate', 'Sponsorship', 'Camp / Clinic', 'Brand Ambassador', 'Other'].map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                </div>

                {/* Compensation */}
                <div style={sectionStyle}>
                    <div style={sectionHeadStyle}>Compensation</div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={labelStyle}>Type</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {['Cash', 'Product', 'Both'].map(t => (
                                <button key={t} type="button" onClick={() => setForm(p => ({ ...p, compType: t }))}
                                    style={{ padding: '0.5rem 1.25rem', borderRadius: '99px', border: '2px solid', borderColor: form.compType === t ? '#7c3aed' : '#e5e7eb', background: form.compType === t ? '#7c3aed' : 'white', color: form.compType === t ? 'white' : '#374151', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer' }}>
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div style={rowStyle}>
                        {(form.compType === 'Cash' || form.compType === 'Both') && (
                            <div><label style={labelStyle}>Cash Value ($)</label><input type="number" name="cashValue" value={form.cashValue} onChange={handleChange} placeholder="0.00" style={inputStyle} /></div>
                        )}
                        {(form.compType === 'Product' || form.compType === 'Both') && (
                            <div><label style={labelStyle}>Non-Cash Estimated Value ($)</label><input type="number" name="nonCashValue" value={form.nonCashValue} onChange={handleChange} placeholder="0.00" style={inputStyle} /></div>
                        )}
                    </div>
                </div>

                {/* Timeline */}
                <div style={sectionStyle}>
                    <div style={sectionHeadStyle}>Timeline</div>
                    <div style={rowStyle}>
                        <div><label style={labelStyle}>Start Date *</label><input type="date" name="startDate" value={form.startDate} onChange={handleChange} required style={inputStyle} /></div>
                        <div><label style={labelStyle}>End Date</label><input type="date" name="endDate" value={form.endDate} onChange={handleChange} style={inputStyle} /></div>
                    </div>
                </div>

                {/* Deliverables */}
                <div style={sectionStyle}>
                    <div style={sectionHeadStyle}>Deliverables <span style={{ textTransform: 'none', fontWeight: 400, fontSize: '0.72rem' }}>(Optional)</span></div>
                    {form.deliverables.map((d, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: '#f9fafb', borderRadius: '10px', marginBottom: '0.5rem', border: '1px solid #e5e7eb' }}>
                            <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{d.type} — Due: {d.date}</span>
                            <button type="button" onClick={() => setForm(p => ({ ...p, deliverables: p.deliverables.filter((_, j) => j !== i) }))} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
                        </div>
                    ))}
                    <div style={{ padding: '1.25rem', background: '#f9fafb', borderRadius: '12px', border: '1px dashed #d1d5db' }}>
                        <div style={{ ...rowStyle, marginBottom: '0.75rem' }}>
                            <div><label style={labelStyle}>Type</label><select value={draftDeliv.type} onChange={e => setDraftDeliv(p => ({ ...p, type: e.target.value }))} style={inputStyle}>{DELIVERABLE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                            <div><label style={labelStyle}>Due Date</label><input type="date" value={draftDeliv.date} onChange={e => setDraftDeliv(p => ({ ...p, date: e.target.value }))} style={inputStyle} /></div>
                        </div>
                        <button type="button" onClick={handleAddDeliverable}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'white', border: '1.5px solid #7c3aed', color: '#7c3aed', borderRadius: '8px', padding: '0.5rem 1rem', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
                            <Plus size={15} /> Add Deliverable
                        </button>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', paddingBottom: '2rem' }}>
                    <button type="submit" disabled={loading}
                        style={{ background: '#7c3aed', color: 'white', border: 'none', borderRadius: '10px', padding: '0.85rem 2rem', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 4px 14px rgba(124,58,237,0.25)' }}>
                        {loading ? 'Submitting…' : 'Submit Deal Report'}
                    </button>
                    <button type="button" onClick={() => navigate('/athlete-dashboard')}
                        style={{ background: 'white', color: '#374151', border: '1.5px solid #e5e7eb', borderRadius: '10px', padding: '0.85rem 1.5rem', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' }}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
