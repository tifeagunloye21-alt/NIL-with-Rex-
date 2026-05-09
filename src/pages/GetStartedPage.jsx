import { useNavigate } from 'react-router-dom';
import { User, Briefcase, Building2, ArrowRight } from 'lucide-react';

const ROLES = [
    {
        id: 'athlete',
        icon: User,
        title: 'Athlete',
        desc: 'Understand your NIL value and explore opportunities.',
        route: '/explore',
        color: 'var(--color-accent)',
        bg: '#EEF2FF',
    },
    {
        id: 'agent',
        icon: Briefcase,
        title: 'Agent',
        desc: 'Connect with athletes and manage opportunities with structure.',
        route: '/for-agents',
        color: '#10B981',
        bg: '#ECFDF5',
    },
    {
        id: 'school',
        icon: Building2,
        title: 'School',
        desc: 'Support athletes while staying compliant.',
        route: '/resources',
        color: '#F59E0B',
        bg: '#FFFBEB',
    },
];

export default function GetStartedPage() {
    const navigate = useNavigate();

    return (
        <div className="nil-page-wrapper">
            <div className="nil-gs-page">
                <div className="nil-gs-header">
                    <h1 className="nil-gs-title">Who are you using<br />Front Door as?</h1>
                    <p className="nil-gs-subtitle">
                        We'll guide you to the experience built for you.
                    </p>
                </div>

                <div className="nil-gs-grid">
                    {ROLES.map((role) => (
                        <button
                            key={role.id}
                            className="nil-gs-role-card"
                            onClick={() => navigate(role.route)}
                        >
                            <div className="nil-gs-role-icon" style={{ background: role.bg, color: role.color }}>
                                <role.icon size={28} />
                            </div>
                            <div className="nil-gs-role-text">
                                <h2>{role.title}</h2>
                                <p>{role.desc}</p>
                            </div>
                            <div className="nil-gs-role-arrow" style={{ color: role.color }}>
                                <ArrowRight size={20} />
                            </div>
                        </button>
                    ))}
                </div>

                <p className="nil-gs-back">
                    <button className="nil-btn-text" onClick={() => navigate('/')}>
                        ← Back to home
                    </button>
                </p>
            </div>
        </div>
    );
}
