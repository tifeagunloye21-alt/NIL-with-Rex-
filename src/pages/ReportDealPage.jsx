import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { CheckCircle, Plus, Trash2, ArrowRight } from 'lucide-react';

const NON_CASH_CATEGORIES = ['Gear', 'Travel', 'Lodging', 'Training Access', 'Meals', 'Equipment', 'Brand Exposure', 'Other'];
const DELIVERABLE_TYPES = ['Instagram Post', 'Instagram Story', 'TikTok', 'YouTube Video', 'Appearance', 'Autograph Session', 'Brand Shoot', 'Training Camp Promo', 'Other'];

export default function ReportDealPage() {
    const navigate = useNavigate();
    const { submitDealReport } = useAppContext();
    const [submitted, setSubmitted] = useState(false);
    const [submittedDeal, setSubmittedDeal] = useState(null);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        brand: '', dealTitle: '', dealType: '',
        compType: 'Cash',
        cashValue: '', nonCashValue: '', nonCashCategory: '', nonCashDescription: '',
        paymentStructure: 'One-time',
        startDate: '', endDate: '',
        agentName: '', agentId: '',
        disclosureRequired: false, reportedToSchool: false, notes: '',
        deliverables: []
    });

    const [draftDeliv, setDraftDeliv] = useState({ type: 'Instagram Post', date: '', description: '' });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleAddDeliverable = () => {
        if (!draftDeliv.date || !draftDeliv.type) return;
        setForm(prev => ({ ...prev, deliverables: [...prev.deliverables, { ...draftDeliv }] }));
        setDraftDeliv({ type: 'Instagram Post', date: '', description: '' });
    };

    const handleRemoveDeliverable = (index) => {
        setForm(prev => ({ ...prev, deliverables: prev.deliverables.filter((_, i) => i !== index) }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        submitDealReport({ ...form, submittedByRole: 'athlete' });
        setSubmittedDeal(form);
        setLoading(false);
        setSubmitted(true);
    };

    // ─── SUCCESS SCREEN ───────────────────────────────────────────────────────

    if (submitted && submittedDeal) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', background: '#f8fafc', padding: '2rem' }}>
                <div style={{ background: 'white', borderRadius: '24px', padding: '3rem 2.5rem', maxWidth: '480px', width: '100%', textAlign: 'center', boxShadow: '0 8px 40px rgba(0,82,255,0.1)', border: '1px solid #f1f5f9' }}>
                    <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, #0052FF, #00c6ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                        <CheckCircle size={36} color="white" />
                    </div>
                    <h2 style={{ fontWeight: 800, fontSize: '1.5rem', color: '#111827', margin: '0 0 0.5rem' }}>Deal Successfully Added!</h2>
                    <p style={{ color: '#6b7280', margin: '0 0 1.5rem', lineHeight: 1.5 }}>
                        <strong>{submittedDeal.brand}</strong> — {submittedDeal.dealTitle || 'New Deal'} has been logged in your Financial Tracker.
                    </p>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
                        <span style={{ background: '#ecfdf5', color: '#059669', padding: '0.3rem 0.75rem', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 700 }}>✓ Tracker Updated</span>
                        {submittedDeal.deliverables.length > 0 && (
                            <span style={{ background: '#eff6ff', color: '#2563eb', padding: '0.3rem 0.75rem', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 700 }}>
                                {submittedDeal.deliverables.length} Deliverable{submittedDeal.deliverables.length > 1 ? 's' : ''} Added
                            </span>
                        )}
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                        <button onClick={() => navigate('/athlete-dashboard')}
                            style={{ background: '#0052FF', color: 'white', border: 'none', borderRadius: '10px', padding: '0.75rem 1.5rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            View Dashboard <ArrowRight size={16} />
                        </button>
                        <button onClick={() => { setSubmitted(false); setForm({ brand: '', dealTitle: '', dealType: '', compType: 'Cash', cashValue: '', nonCashValue: '', nonCashCategory: '', nonCashDescription: '', paymentStructure: 'One-time', startDate: '', endDate: '', agentName: '', agentId: '', disclosureRequired: false, reportedToSchool: false, notes: '', deliverables: [] }); }}
                            style={{ background: 'white', color: '#374151', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '0.75rem 1.5rem', fontWeight: 700, cursor: 'pointer' }}>
                            Add Another Deal
                        </button>
                    </div>
                    <p style={{ margin: '1.25rem 0 0', fontSize: '0.72rem', color: '#d1d5db' }}>Deal ID: #FD-{Date.now().toString().slice(-6)}</p>
                </div>
            </div>
        );
    }

    // ─── FORM ─────────────────────────────────────────────────────────────────

    const sectionStyle = { background: 'white', borderRadius: '20px', padding: '2rem', marginBottom: '1.25rem', border: '1px solid #f1f5f9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' };
    const sectionHeadStyle = { fontSize: '0.72rem', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid #f3f4f6' };
    const rowStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' };
    const labelStyle = { display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '0.4rem' };
    const inputStyle = { width: '100%', padding: '0.7rem 0.9rem', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '0.9rem', color: '#111827', background: 'white', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' };
    const groupStyle = { marginBottom: '0' };

    const showNonCash = form.compType === 'Product' || form.compType === 'Both';
    const showCash = form.compType === 'Cash' || form.compType === 'Both';

    return (
        <div style={{ padding: '2.25rem 2.5rem', background: '#f8fafc', minHeight: '100vh' }}>
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#0a0a0a', margin: 0 }}>Report New Deal</h1>
                <p style={{ color: '#6b7280', marginTop: '0.3rem', fontSize: '0.95rem' }}>Log your NIL activity to stay organized and compliant.</p>
            </div>

            <form onSubmit={handleSubmit} style={{ maxWidth: '820px' }}>

                {/* A: BASIC DETAILS */}
                <div style={sectionStyle}>
                    <div style={sectionHeadStyle}>Basic Details</div>
                    <div style={{ ...rowStyle, marginBottom: '1rem' }}>
                        <div style={groupStyle}>
                            <label style={labelStyle}>Brand / Company Name *</label>
                            <input name="brand" value={form.brand} onChange={handleChange} required placeholder="e.g. Nike, LocalGym" style={inputStyle} />
                        </div>
                        <div style={groupStyle}>
                            <label style={labelStyle}>Deal Title</label>
                            <input name="dealTitle" value={form.dealTitle} onChange={handleChange} placeholder="e.g. Spring Social Campaign" style={inputStyle} />
                        </div>
                    </div>
                    <div style={groupStyle}>
                        <label style={labelStyle}>Deal Type *</label>
                        <select name="dealType" value={form.dealType} onChange={handleChange} required style={inputStyle}>
                            <option value="">Select a type...</option>
                            {['Social Post', 'Appearance', 'Product Exchange', 'Affiliate', 'Sponsorship', 'Camp / Clinic', 'Brand Ambassador', 'Other'].map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                </div>

                {/* B: COMPENSATION */}
                <div style={sectionStyle}>
                    <div style={sectionHeadStyle}>Compensation</div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={labelStyle}>Compensation Type</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {['Cash', 'Product', 'Both'].map(t => (
                                <button key={t} type="button" onClick={() => setForm(p => ({ ...p, compType: t }))}
                                    style={{ padding: '0.5rem 1.25rem', borderRadius: '99px', border: '2px solid', borderColor: form.compType === t ? '#0052FF' : '#e5e7eb', background: form.compType === t ? '#0052FF' : 'white', color: form.compType === t ? 'white' : '#374151', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.15s' }}>
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div style={rowStyle}>
                        {showCash && (
                            <div style={groupStyle}>
                                <label style={labelStyle}>Cash Value ($)</label>
                                <input type="number" name="cashValue" value={form.cashValue} onChange={handleChange} placeholder="0.00" style={inputStyle} />
                            </div>
                        )}
                        {showNonCash && (
                            <div style={groupStyle}>
                                <label style={labelStyle}>Estimated Non-Cash Value ($)</label>
                                <input type="number" name="nonCashValue" value={form.nonCashValue} onChange={handleChange} placeholder="0.00" style={inputStyle} />
                            </div>
                        )}
                    </div>
                    {showNonCash && (
                        <div style={{ ...rowStyle, marginTop: '1rem' }}>
                            <div style={groupStyle}>
                                <label style={labelStyle}>Non-Cash Category</label>
                                <select name="nonCashCategory" value={form.nonCashCategory} onChange={handleChange} style={inputStyle}>
                                    <option value="">Select category...</option>
                                    {NON_CASH_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div style={groupStyle}>
                                <label style={labelStyle}>Non-Cash Description</label>
                                <input name="nonCashDescription" value={form.nonCashDescription} onChange={handleChange} placeholder="e.g. Free gear + travel expenses" style={inputStyle} />
                            </div>
                        </div>
                    )}
                    <div style={{ marginTop: '1rem' }}>
                        <label style={labelStyle}>Payment Structure</label>
                        <select name="paymentStructure" value={form.paymentStructure} onChange={handleChange} style={{ ...inputStyle, maxWidth: '220px' }}>
                            <option value="One-time">One-time</option>
                            <option value="Installments">Installments</option>
                            <option value="Monthly">Monthly</option>
                        </select>
                    </div>
                </div>

                {/* C: TIMELINE */}
                <div style={sectionStyle}>
                    <div style={sectionHeadStyle}>Timeline</div>
                    <div style={rowStyle}>
                        <div style={groupStyle}>
                            <label style={labelStyle}>Start Date *</label>
                            <input type="date" name="startDate" value={form.startDate} onChange={handleChange} required style={inputStyle} />
                        </div>
                        <div style={groupStyle}>
                            <label style={labelStyle}>End Date</label>
                            <input type="date" name="endDate" value={form.endDate} onChange={handleChange} style={inputStyle} />
                        </div>
                    </div>
                </div>

                {/* D: AGENT */}
                <div style={sectionStyle}>
                    <div style={sectionHeadStyle}>Agent (Optional)</div>
                    <div style={rowStyle}>
                        <div style={groupStyle}>
                            <label style={labelStyle}>Agent Name</label>
                            <input name="agentName" value={form.agentName} onChange={handleChange} placeholder="e.g. James Carter" style={inputStyle} />
                        </div>
                        <div style={groupStyle}>
                            <label style={labelStyle}>Agent Email / ID</label>
                            <input name="agentId" value={form.agentId} onChange={handleChange} placeholder="agent@example.com" style={inputStyle} />
                        </div>
                    </div>
                    <p style={{ margin: '0.75rem 0 0', fontSize: '0.78rem', color: '#9ca3af' }}>
                        If your agent submits the same deal, the system will automatically match and confirm the report.
                    </p>
                </div>

                {/* E: DELIVERABLES */}
                <div style={sectionStyle}>
                    <div style={sectionHeadStyle}>Deliverables <span style={{ textTransform: 'none', fontSize: '0.72rem', fontWeight: 500, color: '#9ca3af' }}>(Optional)</span></div>
                    {form.deliverables.length > 0 && (
                        <div style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {form.deliverables.map((d, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: '#f9fafb', borderRadius: '10px', border: '1px solid #e5e7eb' }}>
                                    <div>
                                        <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{d.type}</span>
                                        <span style={{ fontSize: '0.8rem', color: '#6b7280', marginLeft: '0.5rem' }}>Due: {d.date} {d.description && `· ${d.description}`}</span>
                                    </div>
                                    <button type="button" onClick={() => handleRemoveDeliverable(i)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.25rem' }}><Trash2 size={16} /></button>
                                </div>
                            ))}
                        </div>
                    )}
                    <div style={{ padding: '1.25rem', background: '#f9fafb', borderRadius: '12px', border: '1px dashed #d1d5db' }}>
                        <div style={{ ...rowStyle, marginBottom: '0.75rem' }}>
                            <div style={groupStyle}>
                                <label style={labelStyle}>Type</label>
                                <select value={draftDeliv.type} onChange={e => setDraftDeliv(p => ({ ...p, type: e.target.value }))} style={inputStyle}>
                                    {DELIVERABLE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                            <div style={groupStyle}>
                                <label style={labelStyle}>Due Date</label>
                                <input type="date" value={draftDeliv.date} onChange={e => setDraftDeliv(p => ({ ...p, date: e.target.value }))} style={inputStyle} />
                            </div>
                        </div>
                        <div style={{ marginBottom: '0.75rem' }}>
                            <label style={labelStyle}>Description (Optional)</label>
                            <input value={draftDeliv.description} onChange={e => setDraftDeliv(p => ({ ...p, description: e.target.value }))} placeholder="e.g. Include promo code #NIL20" style={inputStyle} />
                        </div>
                        <button type="button" onClick={handleAddDeliverable}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'white', border: '1.5px solid #0052FF', color: '#0052FF', borderRadius: '8px', padding: '0.5rem 1rem', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
                            <Plus size={15} /> Add Deliverable
                        </button>
                    </div>
                </div>

                {/* F: COMPLIANCE */}
                <div style={sectionStyle}>
                    <div style={sectionHeadStyle}>Compliance</div>
                    <div style={{ display: 'flex', gap: '2rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                        {[
                            { id: 'disclosureRequired', label: 'Disclosure Required' },
                            { id: 'reportedToSchool', label: 'Reported to School' },
                        ].map(({ id, label }) => (
                            <label key={id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', color: '#374151' }}>
                                <input type="checkbox" id={id} name={id} checked={form[id]} onChange={handleChange}
                                    style={{ width: '18px', height: '18px', accentColor: '#0052FF', cursor: 'pointer' }} />
                                {label}
                            </label>
                        ))}
                    </div>
                    <div>
                        <label style={labelStyle}>Notes</label>
                        <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} placeholder="Any additional compliance notes..." style={{ ...inputStyle, resize: 'vertical' }} />
                    </div>
                </div>

                {/* Submit */}
                <div style={{ display: 'flex', gap: '0.75rem', paddingBottom: '2rem' }}>
                    <button type="submit" disabled={loading}
                        style={{ background: '#0052FF', color: 'white', border: 'none', borderRadius: '10px', padding: '0.85rem 2rem', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 4px 14px rgba(0,82,255,0.25)' }}>
                        {loading ? 'Submitting…' : 'Submit Deal'}
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
