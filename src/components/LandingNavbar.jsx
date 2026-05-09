import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';

const NAV_ITEMS = [
    { label: 'Home', to: '/' },
    { label: 'Explore NIL', to: '/explore' },
    { label: 'Resources', to: '/resources' },
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '#contact' },
];

export default function LandingNavbar() {
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const handleAnchorClick = (e, to) => {
        if (to.startsWith('#')) {
            e.preventDefault();
            const el = document.querySelector(to);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav className="nil-top-nav">
            <div className="nil-nav-container">
                <div className="nil-nav-logo">
                    <Link to="/" className="nil-logo-text">FrontDoor</Link>
                </div>

                <div className="nil-nav-links">
                    {NAV_ITEMS.map(({ label, to }) => {
                        const active = to === '/' ? pathname === '/' : false;
                        return (
                            <Link
                                key={label}
                                to={to.startsWith('#') ? pathname : to}
                                className={`nil-top-nav-item${active ? ' active' : ''}`}
                                onClick={(e) => handleAnchorClick(e, to)}
                            >
                                {label}
                            </Link>
                        );
                    })}
                </div>

                <div className="nil-nav-actions">
                    <Link to="/login" className="nil-nav-login">
                        Log In
                    </Link>
                    <button
                        className="nil-btn-primary nil-nav-btn"
                        onClick={() => navigate('/get-started')}
                    >
                        Get Started
                    </button>
                </div>
            </div>
        </nav>
    );
}
