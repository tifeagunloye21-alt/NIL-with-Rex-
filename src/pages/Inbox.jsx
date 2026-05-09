import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Send, UserCircle } from 'lucide-react';

export default function Inbox() {
    const { currentUser, conversations, agents, replyMessage } = useAppContext();
    const [activeConvId, setActiveConvId] = useState(null);
    const [replyText, setReplyText] = useState('');

    // Filter conversations for the current user mock
    const userConversations = conversations.filter(c =>
        currentUser?.role === 'athlete' ? c.athleteId === currentUser.id : c.agentId === currentUser.id
    );

    const activeConv = userConversations.find(c => c.id === activeConvId) || userConversations[0];

    const handleReply = (e) => {
        e.preventDefault();
        if (!replyText.trim() || !activeConv || currentUser?.role !== 'agent') return;

        replyMessage(activeConv.id, replyText);
        setReplyText('');
    };

    if (!currentUser) {
        return <div style={{ textAlign: 'center', marginTop: '4rem' }}>Please log in to view messages.</div>;
    }

    return (
        <div style={{ display: 'flex', height: 'calc(100vh - 150px)', gap: '1.5rem' }}>
            {/* Sidebar: Conv List */}
            <div className="card" style={{ flex: '0 0 320px', display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto', padding: '1rem' }}>
                <h2 style={{ marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-gray-200)' }}>Inbox</h2>

                {userConversations.length === 0 ? (
                    <p style={{ color: 'var(--color-gray-500)', textAlign: 'center', padding: '2rem 0' }}>No messages yet.</p>
                ) : (
                    userConversations.map(conv => {
                        // Display logic
                        const otherPartyId = currentUser.role === 'athlete' ? conv.agentId : conv.athleteId;
                        const otherPartyName = currentUser.role === 'athlete'
                            ? agents.find(a => a.id === otherPartyId)?.name
                            : 'Demo Athlete'; // Mock athlete name

                        const lastMessage = conv.messages[conv.messages.length - 1];

                        return (
                            <div
                                key={conv.id}
                                onClick={() => setActiveConvId(conv.id)}
                                style={{
                                    padding: '1rem',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    backgroundColor: (activeConvId === conv.id || (!activeConvId && activeConv?.id === conv.id)) ? 'var(--color-gray-100)' : 'transparent',
                                    transition: 'background 0.2s'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                    <strong style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <UserCircle size={16} /> {otherPartyName}
                                    </strong>
                                </div>
                                <p style={{ fontSize: '0.85rem', color: 'var(--color-gray-500)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {lastMessage.text}
                                </p>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Chat Window */}
            <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0' }}>
                {activeConv ? (
                    <>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-gray-200)', flex: '0 0 auto' }}>
                            <h3 style={{ margin: 0 }}>
                                {currentUser.role === 'athlete'
                                    ? agents.find(a => a.id === activeConv.agentId)?.name
                                    : 'Demo Athlete'}
                            </h3>
                        </div>

                        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {activeConv.messages.map((msg, idx) => {
                                const isMe = msg.senderId === currentUser.id;
                                return (
                                    <div key={idx} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '70%' }}>
                                        <div style={{
                                            padding: '0.8rem 1.2rem',
                                            borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                                            backgroundColor: isMe ? 'var(--color-accent)' : 'var(--color-gray-100)',
                                            color: isMe ? 'var(--color-white)' : 'var(--color-black)'
                                        }}>
                                            {msg.text}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--color-gray-200)', flex: '0 0 auto' }}>
                            {currentUser.role === 'athlete' ? (
                                <p style={{ color: 'var(--color-gray-500)', fontSize: '0.9rem', textAlign: 'center' }}>
                                    Athletes can initiate new messages from the agent's profile.
                                </p>
                            ) : (
                                <form onSubmit={handleReply} style={{ display: 'flex', gap: '1rem' }}>
                                    <input
                                        type="text"
                                        placeholder="Type a reply..."
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        style={{ flex: 1 }}
                                    />
                                    <button type="submit" disabled={!replyText.trim()} style={{ opacity: replyText.trim() ? 1 : 0.5, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Send size={18} /> Reply
                                    </button>
                                </form>
                            )}
                        </div>
                    </>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-gray-500)' }}>
                        Select a conversation to view.
                    </div>
                )}
            </div>
        </div>
    );
}
