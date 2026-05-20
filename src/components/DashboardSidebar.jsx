import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, LineChart, FileCheck, GraduationCap, ShieldCheck, User, LogOut, Plus, Briefcase, Receipt } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function DashboardSidebar() {
    const { pathname } = useLocation();
    const { currentUser, logout } = useAppContext();
    const navigate = useNavigate();

    const isAgent = currentUser?.role === 'agent';

    const ATHLETE_NAV = [
        { label: 'Overview', icon: Home, to: '/athlete-dashboard', section: 'MAIN' },
        { label: 'Financial Tracker', icon: LineChart, to: '/tracker', badge: '★', section: 'MAIN' },
        { label: 'Deals', icon: Briefcase, to: '/report-deal', section: 'MAIN' },
        { label: 'Deliverables', icon: FileCheck, to: '/deliverables', section: 'MAIN' },
        { label: 'Education', icon: GraduationCap, to: '/education', section: 'MAIN' },
        { label: 'Tax Center', icon: Receipt, to: '/tax-center', badge: 'NEW', section: 'MAIN' },
        { label: 'Compliance', icon: ShieldCheck, to: '/compliance', section: 'ACCOUNT' },
        { label: 'Profile', icon: User, to: '/profile', section: 'ACCOUNT' },
    ];

    const AGENT_NAV = [
        { label: 'Overview', icon: Home, to: '/agent-dashboard', section: 'MAIN' },
        { label: 'Financial Tracker', icon: LineChart, to: '/agent-tracker', badge: '★', section: 'MAIN' },
        { label: 'Report a Deal', icon: Plus, to: '/agent/report-deal', section: 'MAIN' },
        { label: 'Deliverables', icon: FileCheck, to: '/agent-deliverables', section: 'MAIN' },
        { label: 'Education', icon: GraduationCap, to: '/agent-education', section: 'MAIN' },
        { label: 'Compliance', icon: ShieldCheck, to: '/agent-compliance', section: 'ACCOUNT' },
        { label: 'Profile', icon: User, to: '/agent-profile', section: 'ACCOUNT' },
    ];

    const navItems = isAgent ? AGENT_NAV : ATHLETE_NAV;
    const mainItems = navItems.filter(i => i.section === 'MAIN');
    const accountItems = navItems.filter(i => i.section === 'ACCOUNT');

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const roleLabel = currentUser?.role === 'agent' ? 'Agent' : 'Student Athlete';
    const initials = currentUser?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'A';

    const NavItem = ({ label, icon: Icon, to, badge }) => {
        const active = pathname === to || pathname.startsWith(to + '/');
        return (
            <Link key={label} to={to} className={`nil-sidebar-nav-item${active ? ' active' : ''}`}>
                <Icon size={17} strokeWidth={active ? 2.5 : 1.8} />
                <span>{label}</span>
                {badge && (
                    <span style={{ marginLeft: 'auto', fontSize: '0.6rem', fontWeight: 800, background: 'rgba(0,82,255,0.85)', color: 'white', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                        PRO
                    </span>
                )}
            </Link>
        );
    };

    return (
        <aside className="nil-dashboard-sidebar">
            {/* Logo */}
            <div className="nil-sidebar-logo">
                <Link to="/" className="nil-nav-brand" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                    <div style={{ width: '28px', height: '28px', background: '#0052FF', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 900, color: 'white' }}>FD</div>
                    <span style={{ fontSize: '1rem', fontWeight: 800, color: '#0a0a0a', letterSpacing: '-0.3px' }}>FrontDoor</span>
                </Link>
            </div>

            {/* Nav */}
            <nav className="nil-sidebar-nav">
                {/* Main section */}
                <div style={{ fontSize: '0.62rem', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px', padding: '0.25rem 1rem 0.5rem' }}>Main</div>
                {mainItems.map(item => <NavItem key={item.label} {...item} />)}

                {/* Account section */}
                <div style={{ fontSize: '0.62rem', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px', padding: '1.25rem 1rem 0.5rem' }}>Account</div>
                {accountItems.map(item => <NavItem key={item.label} {...item} />)}
            </nav>

            {/* Footer */}
            <div className="nil-sidebar-footer">
                <div className="nil-sidebar-user">
                    <div className="nil-sidebar-avatar">{initials}</div>
                    <div className="nil-sidebar-user-info">
                        <span className="nil-sidebar-name">{currentUser?.name || 'Athlete'}</span>
                        <span className="nil-sidebar-role">{roleLabel}</span>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', padding: '0.6rem 1rem', width: '100%', marginTop: '0.5rem', borderRadius: '8px', transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'white'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; e.currentTarget.style.background = 'transparent'; }}
                >
                    <LogOut size={14} />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
