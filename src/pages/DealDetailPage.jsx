import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, CheckCircle, Clock, Archive, Trash2,
    Plus, Upload, FileText, Image, X, Edit2, Save, AlertTriangle
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const STATUSES = ['Pending', 'Active', 'In Progress', 'Completed', 'Archived'];

const STATUS_STYLE = {
    Active:      { bg: '#eff6ff', color: '#2563eb', dot: '#3b82f6' },
    'In Progress':{ bg: '#eff6ff', color: '#2563eb', dot: '#3b82f6' },
    Pending:     { bg: '#fffbeb', color: '#d97706', dot: '#f59e0b' },
    Completed:   { bg: '#ecfdf5', color: '#059669', dot: '#22c55e' },
    Archived:    { bg: '#f9fafb', color: '#6b7280', dot: '#9ca3af' },
};

const DEL_STATUSES = ['Upcoming', 'In Progress', 'Pending Approval', 'Completed', 'Overdue'];
const DEL_TYPES = ['Instagram Post', 'Instagram Story', 'TikTok', 'YouTube', 'Twitter/X', 'Appearance', 'Brand Shoot', 'Podcast', 'Newsletter', 'Affiliate Link', 'Other'];

function fmtSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ─── Confirm Modal ────────────────────────────────────────────────────────────
function ConfirmModal({ title, message, onConfirm, onCancel, danger = false }) {
    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: 'white', borderRadius: '20px', padding: '2rem', maxWidth: '420px', width: '90%', boxShadow: '0 24px 60px rgba(0,0,0,0.15)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <AlertTriangle size={22} color={danger ? '#dc2626' : '#f59e0b'} />
                    <h3 style={{ margin: 0, fontWeight: 800, fontSize: '1.05rem', color: '#111827' }}>{title}</h3>
                </div>
                <p style={{ margin: '0 0 1.75rem', color: '#6b7280', fontSize: '0.9rem', lineHeight: 1.6 }}>{message}</p>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                    <button onClick={onCancel} style={{ padding: '0.6rem 1.25rem', borderRadius: '10px', border: '1.5px solid #e5e7eb', background: 'white', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', color: '#374151' }}>Cancel</button>
                    <button onClick={onConfirm} style={{ padding: '0.6rem 1.25rem', borderRadius: '10px', border: 'none', background: danger ? '#dc2626' : '#f59e0b', color: 'white', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer' }}>Confirm</button>
                </div>
            </div>
        </div>
    );
}

// ─── Section Wrapper ──────────────────────────────────────────────────────────
function Section({ title, icon, children }) {
    return (
        <div style={{ background: 'white', borderRadius: '20px', padding: '1.75rem 2rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
                {icon}
                <h2 style={{ margin: 0, fontWeight: 700, fontSize: '1rem', color: '#111827' }}>{title}</h2>
            </div>
            {children}
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function DealDetailPage() {
    const { dealId } = useParams();
    const navigate = useNavigate();
    const {
        myDeals, myDeliverables,
        updateDealStatus, archiveDeal,
        updateDeliverable, addDeliverable, deleteDeliverable,
        attachDocument, deleteDocument,
    } = useAppContext();

    const deal = myDeals.find(d => d.id === dealId);
    const dealDeliverables = myDeliverables.filter(d => d.dealId === dealId);
    const fileInputRef = useRef(null);

    const [statusLoading, setStatusLoading] = useState(false);
    const [statusSuccess, setStatusSuccess] = useState(false);
    const [archiveModal, setArchiveModal] = useState(false);
    const [deleteDelModal, setDeleteDelModal] = useState(null);
    const [editingDel, setEditingDel] = useState(null); // deliverable id being edited
    const [editBuf, setEditBuf] = useState({});
    const [addingDel, setAddingDel] = useState(false);
    const [newDel, setNewDel] = useState({ name: '', type: 'Instagram Post', date: '', notes: '' });
    const [uploadLoading, setUploadLoading] = useState(false);
    const [deleteDocModal, setDeleteDocModal] = useState(null);

    if (!deal) {
        return (
            <div style={{ padding: '3rem', textAlign: 'center' }}>
                <h2 style={{ color: '#111827' }}>Deal not found</h2>
                <button onClick={() => navigate(-1)} style={{ marginTop: '1rem', background: '#0052FF', color: 'white', border: 'none', borderRadius: '10px', padding: '0.7rem 1.4rem', fontWeight: 700, cursor: 'pointer' }}>Go Back</button>
            </div>
        );
    }

    const sc = STATUS_STYLE[deal.status] || STATUS_STYLE.Pending;

    // ── A. Update Status ──────────────────────────────────────────────────────
    const handleStatusChange = async (newStatus) => {
        if (newStatus === deal.status) return;
        if (newStatus === 'Archived') { setArchiveModal(true); return; }
        setStatusLoading(true);
        setTimeout(() => {
            updateDealStatus(deal.id, newStatus);
            setStatusLoading(false);
            setStatusSuccess(true);
            setTimeout(() => setStatusSuccess(false), 2000);
        }, 400);
    };

    // ── B. Deliverables ───────────────────────────────────────────────────────
    const startEditDel = (del) => { setEditingDel(del.id); setEditBuf({ name: del.name, type: del.type, date: del.date, status: del.status, notes: del.notes || '' }); };
    const saveEditDel = () => { updateDeliverable(editingDel, editBuf); setEditingDel(null); };

    const handleAddDel = () => {
        if (!newDel.name.trim()) return;
        addDeliverable(deal.id, newDel);
        setNewDel({ name: '', type: 'Instagram Post', date: '', notes: '' });
        setAddingDel(false);
    };

    // ── C. Documents ──────────────────────────────────────────────────────────
    const handleFileUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        setUploadLoading(true);
        try {
            for (const file of files) await attachDocument(deal.id, file);
        } finally {
            setUploadLoading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    // ── D. Archive ────────────────────────────────────────────────────────────
    const confirmArchive = () => { archiveDeal(deal.id); setArchiveModal(false); navigate(-1); };

    const inp = { width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1.5px solid #e5e7eb', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' };
    const sel = { ...inp, background: 'white', cursor: 'pointer' };

    return (
        <div style={{ padding: '2.25rem 2.5rem', background: '#f8fafc', minHeight: '100vh' }}>
            {archiveModal && (
                <ConfirmModal
                    title="Archive Deal?"
                    message={`"${deal.brand} — ${deal.dealTitle}" will be moved to Archived. It will no longer appear in your active deals.`}
                    onConfirm={confirmArchive}
                    onCancel={() => setArchiveModal(false)}
                    danger
                />
            )}
            {deleteDelModal && (
                <ConfirmModal
                    title="Delete Deliverable?"
                    message="This deliverable will be permanently deleted and removed from this deal."
                    onConfirm={() => { deleteDeliverable(deleteDelModal); setDeleteDelModal(null); }}
                    onCancel={() => setDeleteDelModal(null)}
                    danger
                />
            )}
            {deleteDocModal && (
                <ConfirmModal
                    title="Delete Document?"
                    message="This document will be permanently removed from this deal."
                    onConfirm={() => { deleteDocument(deal.id, deleteDocModal); setDeleteDocModal(null); }}
                    onCancel={() => setDeleteDocModal(null)}
                    danger
                />
            )}

            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
                <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'none', border: 'none', color: '#6b7280', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', marginBottom: '1rem', padding: 0 }}>
                    <ArrowLeft size={16} /> Back
                </button>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                            <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.5px' }}>{deal.brand}</h1>
                            <span style={{ background: sc.bg, color: sc.color, padding: '0.2rem 0.75rem', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 700 }}>{deal.status}</span>
                        </div>
                        <p style={{ margin: 0, color: '#6b7280', fontSize: '0.95rem' }}>{deal.dealTitle} · {deal.dealType} · ${Number(deal.dealValue || 0).toLocaleString()}</p>
                    </div>
                    <button
                        onClick={() => setArchiveModal(true)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '10px', padding: '0.6rem 1.2rem', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
                    >
                        <Archive size={14} /> Archive Deal
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                {/* Left column */}
                <div>
                    {/* A. Update Status */}
                    <Section title="Update Status" icon={<Clock size={18} color="#0052FF" />}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                            {STATUSES.filter(s => s !== 'Archived').map(s => {
                                const ssc = STATUS_STYLE[s] || STATUS_STYLE.Pending;
                                const isActive = deal.status === s;
                                return (
                                    <button
                                        key={s}
                                        onClick={() => handleStatusChange(s)}
                                        disabled={statusLoading}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '0.75rem',
                                            padding: '0.85rem 1.1rem', borderRadius: '12px',
                                            border: `2px solid ${isActive ? ssc.dot : '#e5e7eb'}`,
                                            background: isActive ? ssc.bg : 'white',
                                            cursor: statusLoading ? 'not-allowed' : 'pointer',
                                            transition: 'all 0.15s', opacity: statusLoading ? 0.6 : 1,
                                            fontWeight: isActive ? 700 : 500, fontSize: '0.9rem',
                                            color: isActive ? ssc.color : '#374151',
                                        }}
                                    >
                                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: ssc.dot, flexShrink: 0 }} />
                                        {s}
                                        {isActive && <CheckCircle size={15} color={ssc.dot} style={{ marginLeft: 'auto' }} />}
                                    </button>
                                );
                            })}
                        </div>
                        {statusSuccess && (
                            <div style={{ marginTop: '1rem', background: '#ecfdf5', color: '#059669', padding: '0.6rem 1rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <CheckCircle size={14} /> Status updated successfully!
                            </div>
                        )}
                    </Section>

                    {/* Deal Info summary */}
                    <Section title="Deal Overview" icon={<FileText size={18} color="#6b7280" />}>
                        {[
                            ['Brand', deal.brand],
                            ['Deal Title', deal.dealTitle],
                            ['Type', deal.dealType],
                            ['Total Value', `$${Number(deal.dealValue || 0).toLocaleString()}`],
                            ['Cash', `$${Number(deal.cashValue || 0).toLocaleString()}`],
                            ['Non-Cash', `$${Number(deal.nonCashValue || 0).toLocaleString()}`],
                            ['Start Date', deal.startDate || '—'],
                            ['End Date', deal.endDate || '—'],
                            ['Agent', deal.agentName || 'None'],
                        ].map(([label, val]) => (
                            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid #f3f4f6', fontSize: '0.875rem' }}>
                                <span style={{ color: '#9ca3af', fontWeight: 600 }}>{label}</span>
                                <span style={{ color: '#111827', fontWeight: 600 }}>{val}</span>
                            </div>
                        ))}
                    </Section>
                </div>

                {/* Right column */}
                <div>
                    {/* B. Deliverables */}
                    <Section title="Deliverables" icon={<CheckCircle size={18} color="#22c55e" />}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                            {dealDeliverables.length === 0 && !addingDel && (
                                <p style={{ margin: 0, color: '#9ca3af', fontSize: '0.875rem', textAlign: 'center', padding: '1.5rem 0' }}>No deliverables yet. Add one below.</p>
                            )}
                            {dealDeliverables.map(del => {
                                const dsc = STATUS_STYLE[del.status] || STATUS_STYLE.Pending;
                                const isEditing = editingDel === del.id;
                                return (
                                    <div key={del.id} style={{ border: '1.5px solid #f1f5f9', borderRadius: '12px', padding: '1rem', background: '#fafafa' }}>
                                        {isEditing ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                                <input placeholder="Title" value={editBuf.name} onChange={e => setEditBuf(b => ({ ...b, name: e.target.value }))} style={inp} />
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                                                    <select value={editBuf.type} onChange={e => setEditBuf(b => ({ ...b, type: e.target.value }))} style={sel}>
                                                        {DEL_TYPES.map(t => <option key={t}>{t}</option>)}
                                                    </select>
                                                    <input type="date" value={editBuf.date} onChange={e => setEditBuf(b => ({ ...b, date: e.target.value }))} style={inp} />
                                                </div>
                                                <select value={editBuf.status} onChange={e => setEditBuf(b => ({ ...b, status: e.target.value }))} style={sel}>
                                                    {DEL_STATUSES.map(s => <option key={s}>{s}</option>)}
                                                </select>
                                                <input placeholder="Notes (optional)" value={editBuf.notes} onChange={e => setEditBuf(b => ({ ...b, notes: e.target.value }))} style={inp} />
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <button onClick={saveEditDel} style={{ flex: 1, background: '#0052FF', color: 'white', border: 'none', borderRadius: '8px', padding: '0.6rem', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                                                        <Save size={13} /> Save
                                                    </button>
                                                    <button onClick={() => setEditingDel(null)} style={{ flex: 1, background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '8px', padding: '0.6rem', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>Cancel</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#111827' }}>{del.name}</div>
                                                    <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.2rem' }}>{del.type} · {del.date}</div>
                                                    <span style={{ background: dsc.bg, color: dsc.color, padding: '0.15rem 0.55rem', borderRadius: '99px', fontSize: '0.7rem', fontWeight: 700, display: 'inline-block', marginTop: '0.4rem' }}>{del.status}</span>
                                                </div>
                                                <div style={{ display: 'flex', gap: '0.4rem' }}>
                                                    <button onClick={() => startEditDel(del)} style={{ background: '#eff6ff', color: '#2563eb', border: 'none', borderRadius: '7px', padding: '0.35rem 0.6rem', cursor: 'pointer' }}>
                                                        <Edit2 size={13} />
                                                    </button>
                                                    <button onClick={() => setDeleteDelModal(del.id)} style={{ background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: '7px', padding: '0.35rem 0.6rem', cursor: 'pointer' }}>
                                                        <Trash2 size={13} />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                            {/* Add new deliverable form */}
                            {addingDel && (
                                <div style={{ border: '2px dashed #0052FF', borderRadius: '12px', padding: '1rem', background: '#f8fbff', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                    <input placeholder="Deliverable title *" value={newDel.name} onChange={e => setNewDel(n => ({ ...n, name: e.target.value }))} style={inp} />
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                                        <select value={newDel.type} onChange={e => setNewDel(n => ({ ...n, type: e.target.value }))} style={sel}>
                                            {DEL_TYPES.map(t => <option key={t}>{t}</option>)}
                                        </select>
                                        <input type="date" value={newDel.date} onChange={e => setNewDel(n => ({ ...n, date: e.target.value }))} style={inp} />
                                    </div>
                                    <input placeholder="Notes (optional)" value={newDel.notes} onChange={e => setNewDel(n => ({ ...n, notes: e.target.value }))} style={inp} />
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button onClick={handleAddDel} style={{ flex: 1, background: '#0052FF', color: 'white', border: 'none', borderRadius: '8px', padding: '0.65rem', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>Add Deliverable</button>
                                        <button onClick={() => setAddingDel(false)} style={{ flex: 1, background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '8px', padding: '0.65rem', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>Cancel</button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {!addingDel && (
                            <button onClick={() => setAddingDel(true)} style={{ width: '100%', background: '#f8fafc', color: '#0052FF', border: '2px dashed #e0e7ff', borderRadius: '10px', padding: '0.7rem', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                                <Plus size={15} /> Add Deliverable
                            </button>
                        )}
                    </Section>

                    {/* C. Documents */}
                    <Section title="Documents" icon={<Upload size={18} color="#8b5cf6" />}>
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx,.xls,.xlsx,.txt"
                            onChange={handleFileUpload}
                            style={{ display: 'none' }}
                        />

                        {/* Upload Zone */}
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            style={{ border: '2px dashed #d8b4fe', borderRadius: '12px', padding: '1.75rem', textAlign: 'center', cursor: 'pointer', background: '#faf5ff', marginBottom: '1rem', transition: 'all 0.15s' }}
                            onMouseEnter={e => e.currentTarget.style.background = '#f3e8ff'}
                            onMouseLeave={e => e.currentTarget.style.background = '#faf5ff'}
                        >
                            {uploadLoading ? (
                                <p style={{ margin: 0, color: '#8b5cf6', fontWeight: 600 }}>Uploading...</p>
                            ) : (
                                <>
                                    <Upload size={24} color="#8b5cf6" style={{ marginBottom: '0.5rem' }} />
                                    <p style={{ margin: '0.25rem 0 0', fontWeight: 700, color: '#7c3aed', fontSize: '0.9rem' }}>Click to upload documents</p>
                                    <p style={{ margin: '0.2rem 0 0', color: '#a78bfa', fontSize: '0.78rem' }}>PDF, JPG, PNG, DOC, XLS — up to 10 MB each</p>
                                </>
                            )}
                        </div>

                        {/* Document list */}
                        {(deal.documents || []).length === 0 ? (
                            <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '0.85rem', margin: 0 }}>No documents uploaded yet.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                {(deal.documents || []).map(doc => {
                                    const isImg = doc.type?.startsWith('image/');
                                    return (
                                        <div key={doc.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #f1f5f9', background: '#fafafa' }}>
                                            {isImg ? <Image size={18} color="#8b5cf6" /> : <FileText size={18} color="#8b5cf6" />}
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.name}</div>
                                                <div style={{ fontSize: '0.73rem', color: '#9ca3af' }}>{fmtSize(doc.size)} · {new Date(doc.uploadedAt).toLocaleDateString()}</div>
                                            </div>
                                            <a href={doc.dataUrl} download={doc.name} style={{ color: '#0052FF', background: '#eff6ff', border: 'none', borderRadius: '7px', padding: '0.35rem 0.7rem', fontWeight: 700, fontSize: '0.75rem', textDecoration: 'none', cursor: 'pointer' }}>Download</a>
                                            <button onClick={() => setDeleteDocModal(doc.id)} style={{ background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: '7px', padding: '0.35rem 0.6rem', cursor: 'pointer' }}>
                                                <X size={13} />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </Section>
                </div>
            </div>
        </div>
    );
}
