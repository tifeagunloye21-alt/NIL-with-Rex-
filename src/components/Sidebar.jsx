import { Link, useLocation } from 'react-router-dom';
import { Home, Info, Star, TrendingUp, Mail } from 'lucide-react';

const NAV_ITEMS = [
    { label: 'Home', icon: Home, to: '/' },
    { label: 'What We Do', icon: Star, to: '#what-we-do' },
    { label: 'About', icon: Info, to: '#about' },
    { label: 'Impact', icon: TrendingUp, to: '#impact' },
    { label: 'Contact', icon: Mail, to: '#contact' },
];

export default function Sidebar() {
    const { pathname } = useLocation();

    const handleAnchorClick = (e, to) => {
        if (to.startsWith('#')) {
            e.preventDefault();
            const el = document.querySelector(to);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <aside className="nil-sidebar">
            <div className="nil-sidebar-logo">
                <span className="nil-logo-mark">N</span>
                <span className="nil-logo-text">NIL Brief</span>
            </div>

            <nav className="nil-sidebar-nav">
                {NAV_ITEMS.map(({ label, icon: Icon, to }) => {
                    const active = to === '/' ? pathname === '/' : false;
                    return (
                        <Link
                            key={label}
                            to={to.startsWith('#') ? pathname : to}
                            className={`nil-nav-item${active ? ' active' : ''}`}
                            onClick={(e) => handleAnchorClick(e, to)}
                        >
                            <Icon size={18} strokeWidth={active ? 2.5 : 1.8} />
                            <span>{label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="nil-sidebar-footer">
                <span className="nil-sidebar-tagline">Built for athletes. By design.</span>
            </div>
        </aside>
    );
}
