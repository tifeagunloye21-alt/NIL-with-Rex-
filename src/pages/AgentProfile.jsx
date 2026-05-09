import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { MapPin, Briefcase, Award, ArrowLeft, Send } from 'lucide-react';

export default function AgentProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { agents, currentUser, sendMessage } = useAppContext();
    const [message, setMessage] = useState('');
    const [sent, setSent] = useState(false);

    const agent = agents.find(a => a.id === id);

    if (!agent) {
        return <div style={{ textAlign: 'center', marginTop: '4rem' }}>Agent not found.</div>;
    }

    const handleSend = (e) => {
        e.preventDefault();
        if (!message.trim() || currentUser?.role !== 'athlete') return;

        sendMessage(agent.id, message);
        setMessage('');
        setSent(true);
        setTimeout(() => setSent(false), 3000);
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <button className="outline" onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', border: 'none', padding: '0.5em 0' }}>
                <ArrowLeft size={16} /> Back
            </button>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                    <img
                        src={agent.photo}
                        alt={agent.name}
                        style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1, minWidth: '300px' }}>
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{agent.name}</h1>
                        <p style={{ color: 'var(--color-accent)', fontWeight: 600, fontSize: '1.25rem', marginBottom: '1rem' }}>{agent.sport} Agent</p>

                        <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--color-gray-500)', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={18} /> {agent.location}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Briefcase size={18} /> {agent.experience} Experience</span>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Award size={18} /> About Me
                            </h3>
                            <p style={{ color: 'var(--color-gray-800)', lineHeight: '1.7' }}>{agent.bio}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card" style={{ backgroundColor: 'var(--color-gray-100)', border: '1px solid var(--color-gray-200)' }}>
                <h3 style={{ marginBottom: '1rem' }}>Contact {agent.name.split(' ')[0]}</h3>

                {currentUser ? (
                    currentUser.role === 'athlete' ? (
                        <form onSubmit={handleSend}>
                            <textarea
                                rows="4"
                                placeholder={`Hi ${agent.name.split(' ')[0]}, I'm interested in discussing representation...`}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                style={{ marginBottom: '1rem', resize: 'vertical' }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <p style={{ fontSize: '0.85rem', color: 'var(--color-gray-500)', maxWidth: '60%' }}>
                                    <i>Front Door facilitates introductions between athletes and agents but does not negotiate NIL deals.</i>
                                </p>
                                <button type="submit" disabled={!message.trim()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: message.trim() ? 1 : 0.5 }}>
                                    <Send size={16} /> {sent ? 'Sent!' : 'Send Message'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <p style={{ color: 'var(--color-gray-500)' }}>As an agent, you cannot initiate conversations with other agents.</p>
                    )
                ) : (
                    <p style={{ color: 'var(--color-gray-500)' }}>Please sign in as an athlete to send a message.</p>
                )}
            </div>
        </div>
    );
}
