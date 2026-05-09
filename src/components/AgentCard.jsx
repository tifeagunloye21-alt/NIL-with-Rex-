import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

export default function AgentCard({ agent }) {
    return (
        <Link to={`/agents/${agent.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
            <div className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', transition: 'transform 0.2s', cursor: 'pointer' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
            >
                <img
                    src={agent.photo}
                    alt={agent.name}
                    style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{agent.name}</h3>
                    <p style={{ color: 'var(--color-accent)', fontWeight: 500, marginBottom: '0.25rem', fontSize: '0.9rem' }}>{agent.sport}</p>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-gray-500)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                        <MapPin size={14} /> {agent.location}
                    </p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-gray-800)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {agent.bio}
                    </p>
                </div>
            </div>
        </Link>
    );
}
