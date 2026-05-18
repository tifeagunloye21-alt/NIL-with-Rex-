import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Send, Minimize2, Maximize2, Sparkles, ChevronDown } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

// ── Quick prompt chips ────────────────────────────────────────────────────────
const QUICK_PROMPTS = [
    { label: '📋 Report a deal', text: 'How do I report a new deal?' },
    { label: '📅 Due this week', text: "What deliverables do I have due this week?" },
    { label: '💼 Active deals', text: "Show me my active deals." },
    { label: '📎 Upload document', text: "How do I upload a document to a deal?" },
    { label: '📚 Find resources', text: "Where can I find education resources?" },
    { label: '⚙️ Settings', text: "How do I update my profile settings?" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function MessageBubble({ msg }) {
    const isUser = msg.role === 'user';
    return (
        <div style={{
            display: 'flex',
            justifyContent: isUser ? 'flex-end' : 'flex-start',
            marginBottom: '0.75rem',
            alignItems: 'flex-end',
            gap: '0.5rem',
        }}>
            {!isUser && (
                <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #0033cc, #0052FF)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.7rem', fontWeight: 900, color: 'white', flexShrink: 0,
                }}>D</div>
            )}
            <div style={{
                maxWidth: '80%',
                background: isUser ? '#0052FF' : '#f8fafc',
                color: isUser ? 'white' : '#111827',
                borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                padding: '0.65rem 1rem',
                fontSize: '0.875rem',
                lineHeight: 1.55,
                border: isUser ? 'none' : '1px solid #e5e7eb',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
            }}>
                {msg.content}
            </div>
        </div>
    );
}

function TypingIndicator() {
    return (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <div style={{
                width: '28px', height: '28px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #0033cc, #0052FF)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.7rem', fontWeight: 900, color: 'white', flexShrink: 0,
            }}>D</div>
            <div style={{
                background: '#f8fafc', border: '1px solid #e5e7eb',
                borderRadius: '18px 18px 18px 4px', padding: '0.75rem 1rem',
                display: 'flex', gap: '0.3rem', alignItems: 'center',
            }}>
                {[0, 1, 2].map(i => (
                    <div key={i} style={{
                        width: '6px', height: '6px', borderRadius: '50%',
                        background: '#0052FF', opacity: 0.6,
                        animation: `doorwayBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }} />
                ))}
            </div>
        </div>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function AIAssistant() {
    const navigate = useNavigate();
    const { currentUser, myDeals, myDeliverables } = useAppContext();

    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [hasUnread, setHasUnread] = useState(false);
    const [showQuickPrompts, setShowQuickPrompts] = useState(true);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Build user context to send to backend (min necessary data)
    const userContext = useCallback(() => {
        const totalNIL = (myDeals || []).reduce((s, d) => s + Number(d.dealValue || 0), 0);
        const activeDeals = (myDeals || []).filter(d => d.status === 'Active' || d.status === 'Pending').length;
        const pendingDeliverables = (myDeliverables || []).filter(d => d.status !== 'Completed').length;
        const overdueDels = (myDeliverables || []).filter(d => d.status === 'Overdue').length;

        return {
            userName: currentUser?.name || 'Athlete',
            userRole: currentUser?.role || 'athlete',
            totalNIL,
            activeDeals,
            pendingDeliverables,
            overdueDels,
            deals: (myDeals || []).map(d => ({
                id: d.id,
                brand: d.brand,
                dealTitle: d.dealTitle,
                dealValue: d.dealValue,
                cashValue: d.cashValue,
                status: d.status,
                dealType: d.dealType,
                startDate: d.startDate,
                endDate: d.endDate,
            })),
            deliverables: (myDeliverables || []).map(d => ({
                id: d.id,
                name: d.name,
                brand: d.brand,
                type: d.type,
                date: d.date,
                status: d.status,
                dealId: d.dealId,
            })),
        };
    }, [currentUser, myDeals, myDeliverables]);

    // Intro message when first opened
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            const name = currentUser?.name?.split(' ')[0] || 'there';
            setMessages([{
                role: 'assistant',
                content: `Hey ${name}! 👋 I'm **Doorway**, your FrontDoor assistant.\n\nI can help you navigate the app, check your deals and deliverables, find resources, and stay organized.\n\nWhat can I help you with today?`,
            }]);
        }
    }, [isOpen]);

    // Auto scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && !isMinimized) {
            setTimeout(() => inputRef.current?.focus(), 200);
        }
    }, [isOpen, isMinimized]);

    const handleOpen = () => {
        setIsOpen(true);
        setIsMinimized(false);
        setHasUnread(false);
    };

    // Handle action returned from Claude
    const handleAction = useCallback((action) => {
        if (!action) return;
        if (action.type === 'navigate' && action.path) {
            setTimeout(() => navigate(action.path), 600);
        }
    }, [navigate]);

    const sendMessage = async (text) => {
        const trimmed = (text || input).trim();
        if (!trimmed || loading) return;

        setInput('');
        setShowQuickPrompts(false);
        const userMsg = { role: 'user', content: trimmed };
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setLoading(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: newMessages,
                    userContext: userContext(),
                }),
            });

            // Server returned a response (even errors come back as 200 from our backend)
            const data = await res.json();

            if (data.content) {
                setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
                if (data.action) handleAction(data.action);
            } else {
                throw new Error('Empty response from server');
            }

            if (!isOpen || isMinimized) setHasUnread(true);
        } catch (err) {
            // Only show "backend not running" for genuine network failures (fetch threw)
            const isNetworkError = err instanceof TypeError && err.message.includes('fetch');
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: isNetworkError
                    ? "⚠️ Can't reach the AI backend. Make sure it's running in a separate terminal:\n\nnpm run server:ai"
                    : "Something went wrong. Please try again.",
            }]);
            console.error('[Doorway frontend error]', err.message);

        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    };

    // Don't render if not logged in
    if (!currentUser) return null;

    return (
        <>
            {/* ── Inject animation keyframes ── */}
            <style>{`
                @keyframes doorwayBounce {
                    0%, 60%, 100% { transform: translateY(0); opacity: 0.6; }
                    30% { transform: translateY(-6px); opacity: 1; }
                }
                @keyframes doorwayPulse {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(0,82,255,0.4); }
                    50% { box-shadow: 0 0 0 8px rgba(0,82,255,0); }
                }
                @keyframes doorwayFadeIn {
                    from { opacity: 0; transform: translateY(12px) scale(0.97); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                .doorway-window { animation: doorwayFadeIn 0.22s ease; }
                .doorway-fab:hover { transform: scale(1.08) !important; }
                .doorway-chip:hover { background: #eff6ff !important; border-color: #0052FF !important; color: #0052FF !important; }
            `}</style>

            {/* ── FAB Button (bottom-right) ── */}
            {!isOpen && (
                <button
                    className="doorway-fab"
                    onClick={handleOpen}
                    title="Open Doorway AI Assistant"
                    style={{
                        position: 'fixed', bottom: '1.75rem', right: '1.75rem',
                        width: '54px', height: '54px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, #0033cc 0%, #0052FF 100%)',
                        border: 'none', cursor: 'pointer', zIndex: 9999,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 20px rgba(0,82,255,0.4)',
                        transition: 'transform 0.18s ease, box-shadow 0.18s ease',
                        animation: 'doorwayPulse 3s ease infinite',
                    }}
                >
                    <Sparkles size={22} color="white" />
                    {hasUnread && (
                        <div style={{
                            position: 'absolute', top: '6px', right: '6px',
                            width: '10px', height: '10px', borderRadius: '50%',
                            background: '#ef4444', border: '2px solid white',
                        }} />
                    )}
                </button>
            )}

            {/* ── Chat Window ── */}
            {isOpen && (
                <div
                    className="doorway-window"
                    style={{
                        position: 'fixed', bottom: '1.75rem', right: '1.75rem',
                        width: '380px',
                        height: isMinimized ? '60px' : '560px',
                        borderRadius: '20px',
                        background: 'white',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.15), 0 4px 20px rgba(0,0,0,0.08)',
                        display: 'flex', flexDirection: 'column',
                        overflow: 'hidden', zIndex: 9999,
                        border: '1px solid rgba(0,0,0,0.08)',
                        transition: 'height 0.25s cubic-bezier(0.4,0,0.2,1)',
                    }}
                >
                    {/* Header */}
                    <div style={{
                        background: 'linear-gradient(135deg, #0033cc 0%, #0052FF 100%)',
                        padding: '0.85rem 1.1rem',
                        display: 'flex', alignItems: 'center', gap: '0.65rem',
                        flexShrink: 0, cursor: isMinimized ? 'pointer' : 'default',
                    }}
                        onClick={() => isMinimized && setIsMinimized(false)}
                    >
                        <div style={{
                            width: '34px', height: '34px', borderRadius: '50%',
                            background: 'rgba(255,255,255,0.15)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0,
                        }}>
                            <Sparkles size={16} color="white" />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'white', lineHeight: 1 }}>Doorway</div>
                            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.65)', marginTop: '0.15rem' }}>FrontDoor AI Assistant</div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                            <button
                                onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}
                                style={{ background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: '8px', padding: '0.35rem', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center' }}
                                title={isMinimized ? 'Expand' : 'Minimize'}
                            >
                                {isMinimized ? <Maximize2 size={13} /> : <Minimize2 size={13} />}
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                style={{ background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: '8px', padding: '0.35rem', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center' }}
                                title="Close"
                            >
                                <X size={13} />
                            </button>
                        </div>
                    </div>

                    {/* Status bar */}
                    {!isMinimized && (
                        <div style={{
                            padding: '0.45rem 1.1rem',
                            background: '#f0fdf4',
                            borderBottom: '1px solid #d1fae5',
                            display: 'flex', alignItems: 'center', gap: '0.4rem',
                            fontSize: '0.7rem', color: '#059669', fontWeight: 600, flexShrink: 0,
                        }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }} />
                            Doorway is online · Organizational help only
                        </div>
                    )}

                    {/* Messages area */}
                    {!isMinimized && (
                        <div style={{
                            flex: 1, overflowY: 'auto', padding: '1rem 1rem 0.5rem',
                            display: 'flex', flexDirection: 'column',
                        }}>
                            {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}
                            {loading && <TypingIndicator />}
                            <div ref={messagesEndRef} />
                        </div>
                    )}

                    {/* Quick prompts */}
                    {!isMinimized && showQuickPrompts && messages.length <= 1 && (
                        <div style={{
                            padding: '0.5rem 1rem 0.25rem',
                            display: 'flex', flexWrap: 'wrap', gap: '0.35rem', flexShrink: 0,
                        }}>
                            {QUICK_PROMPTS.map(qp => (
                                <button
                                    key={qp.label}
                                    className="doorway-chip"
                                    onClick={() => sendMessage(qp.text)}
                                    style={{
                                        background: '#f9fafb',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '99px',
                                        padding: '0.25rem 0.7rem',
                                        fontSize: '0.72rem',
                                        fontWeight: 600,
                                        color: '#374151',
                                        cursor: 'pointer',
                                        transition: 'all 0.15s',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {qp.label}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input area */}
                    {!isMinimized && (
                        <div style={{
                            padding: '0.75rem 1rem',
                            borderTop: '1px solid #f1f5f9',
                            display: 'flex', gap: '0.5rem', alignItems: 'flex-end', flexShrink: 0,
                        }}>
                            <textarea
                                ref={inputRef}
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Ask Doorway anything…"
                                rows={1}
                                style={{
                                    flex: 1,
                                    resize: 'none',
                                    border: '1.5px solid #e5e7eb',
                                    borderRadius: '12px',
                                    padding: '0.6rem 0.85rem',
                                    fontSize: '0.875rem',
                                    fontFamily: 'inherit',
                                    outline: 'none',
                                    lineHeight: 1.5,
                                    maxHeight: '100px',
                                    overflowY: 'auto',
                                    transition: 'border-color 0.15s',
                                }}
                                onFocus={e => e.target.style.borderColor = '#0052FF'}
                                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                            />
                            <button
                                onClick={() => sendMessage()}
                                disabled={!input.trim() || loading}
                                style={{
                                    width: '38px', height: '38px', borderRadius: '12px',
                                    background: input.trim() && !loading ? '#0052FF' : '#e5e7eb',
                                    border: 'none', cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'background 0.15s', flexShrink: 0,
                                }}
                            >
                                <Send size={15} color={input.trim() && !loading ? 'white' : '#9ca3af'} />
                            </button>
                        </div>
                    )}

                    {/* Disclaimer footer */}
                    {!isMinimized && (
                        <div style={{
                            padding: '0.4rem 1rem 0.6rem',
                            fontSize: '0.62rem',
                            color: '#9ca3af',
                            textAlign: 'center',
                            flexShrink: 0,
                            lineHeight: 1.4,
                        }}>
                            Doorway provides organizational help only. Not legal, tax, or financial advice.
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
