import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { LogOut, Mail, User } from 'lucide-react';

export default function Navbar() {
    const { currentUser, logout } = useAppContext();

    return (
        <nav className="navbar">
            <Link to="/" className="nav-brand">Front Door</Link>
            <div className="nav-links">
                {currentUser ? (
                    <>
                        {currentUser.role === 'athlete' && <Link to="/dashboard">Dashboard</Link>}
                        <Link to="/inbox" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Mail size={18} /> Inbox</Link>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-gray-500)', marginLeft: '1rem' }}>
                            <User size={18} /> {currentUser.name || currentUser.role}
                        </span>
                        <button className="outline" onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4em 0.8em' }}>
                            <LogOut size={16} /> Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/auth?role=athlete&name=Demo+Athlete">Login as Athlete</Link>
                        <Link to="/auth?role=agent&name=Demo+Agent">Login as Agent</Link>
                    </>
                )}
            </div>
        </nav>
    );
}
