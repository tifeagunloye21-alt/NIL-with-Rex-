import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAppContext();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const role = await login({ email, password });
            if (role === 'agent') navigate('/agent-dashboard');
            else if (role === 'school') navigate('/school-dashboard');
            else navigate('/athlete-dashboard');
        } catch (err) {
            setError(err.message || 'Invalid email or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const inp = {
        width: '100%', padding: '0.85rem 1rem', borderRadius: '10px',
        border: '1.5px solid #e5e7eb', fontSize: '0.95rem',
        outline: 'none', boxSizing: 'border-box', background: 'white',
        color: '#111827', transition: 'border-color 0.15s, box-shadow 0.15s',
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Inter', system-ui, sans-serif" }}>

            {/* ── Left blue panel ── */}
            <div style={{
                flex: '0 0 42%', background: 'linear-gradient(160deg, #0033cc 0%, #0052FF 60%, #2563eb 100%)',
                display: 'flex', flexDirection: 'column', justifyContent: 'center',
                padding: '4rem 3.5rem', position: 'relative', overflow: 'hidden',
            }}>
                {/* Decorative circles */}
                <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '300px', height: '300px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '220px', height: '220px', background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }} />

                <div style={{ position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
                        <div style={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 800, fontSize: '0.85rem', padding: '0.4rem 0.6rem', borderRadius: '8px' }}>FD</div>
                        <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white' }}>FrontDoor</span>
                    </div>
                    <h2 style={{ fontSize: '2.4rem', fontWeight: 900, color: 'white', lineHeight: 1.15, letterSpacing: '-1px', margin: '0 0 1.25rem' }}>
                        Your NIL<br />Journey,<br />Simplified.
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.95rem', lineHeight: 1.7, margin: '0 0 2.5rem' }}>
                        The operating system for college athletes navigating Name, Image & Likeness deals.
                    </p>
                    {[
                        { icon: '💰', text: 'Track every dollar of NIL value' },
                        { icon: '📋', text: 'Manage deals, deliverables & compliance' },
                        { icon: '📈', text: 'Grow your brand with data-backed insights' },
                    ].map(f => (
                        <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1rem' }}>
                            <span style={{ fontSize: '1.1rem' }}>{f.icon}</span>
                            <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem', fontWeight: 500 }}>{f.text}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Right form panel ── */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '3rem 2rem' }}>
                <div style={{ width: '100%', maxWidth: '400px' }}>
                    <div style={{ marginBottom: '2.5rem' }}>
                        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', margin: '0 0 0.5rem', letterSpacing: '-0.5px' }}>Welcome Back</h1>
                        <p style={{ margin: 0, color: '#6b7280', fontSize: '0.95rem' }}>Sign in to access your dashboard</p>
                    </div>

                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {error && (
                            <div style={{ background: '#fef2f2', color: '#dc2626', padding: '0.75rem 1rem', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600, border: '1px solid #fecaca' }}>
                                {error}
                            </div>
                        )}

                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Email address</label>
                            <input
                                type="email" required placeholder="name@example.com"
                                value={email} onChange={e => setEmail(e.target.value)}
                                style={inp}
                                onFocus={e => Object.assign(e.target.style, { borderColor: '#0052FF', boxShadow: '0 0 0 3px rgba(0,82,255,0.1)' })}
                                onBlur={e => Object.assign(e.target.style, { borderColor: '#e5e7eb', boxShadow: 'none' })}
                            />
                        </div>

                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151' }}>Password</label>
                                <a href="#" style={{ fontSize: '0.82rem', color: '#0052FF', textDecoration: 'none', fontWeight: 600 }}>Forgot?</a>
                            </div>
                            <input
                                type="password" required placeholder="••••••••"
                                value={password} onChange={e => setPassword(e.target.value)}
                                style={inp}
                                onFocus={e => Object.assign(e.target.style, { borderColor: '#0052FF', boxShadow: '0 0 0 3px rgba(0,82,255,0.1)' })}
                                onBlur={e => Object.assign(e.target.style, { borderColor: '#e5e7eb', boxShadow: 'none' })}
                            />
                        </div>

                        <button
                            type="submit" disabled={loading}
                            style={{ width: '100%', background: '#0052FF', color: 'white', border: 'none', borderRadius: '10px', padding: '0.9rem', fontSize: '1rem', fontWeight: 700, marginTop: '0.5rem', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, boxShadow: '0 4px 14px rgba(0,82,255,0.3)', transition: 'background 0.15s' }}
                            onMouseEnter={e => !loading && (e.target.style.background = '#0047e0')}
                            onMouseLeave={e => !loading && (e.target.style.background = '#0052FF')}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: '#6b7280' }}>
                        Don't have an account?{' '}
                        <Link to="/signup" style={{ color: '#0052FF', textDecoration: 'none', fontWeight: 600 }}>Sign up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
