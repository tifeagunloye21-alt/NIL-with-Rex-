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
    const [showPw, setShowPw] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const role = await login({ email, password });
            if (role === 'agent') navigate('/for-agents');
            else if (role === 'school') navigate('/school-dashboard');
            else navigate('/athlete-dashboard');
        } catch (err) {
            setError(err.message || 'Invalid email or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="nil-auth-split">
            {/* Left Brand Panel */}
            <div className="nil-auth-brand-panel">
                <div className="nil-auth-brand-inner">
                    <div className="nil-auth-brand-logo">
                        <span className="nil-auth-logo-mark">FD</span>
                        <span className="nil-auth-logo-word">FrontDoor</span>
                    </div>
                    <h2 className="nil-auth-brand-headline">Your NIL,<br />under control.</h2>
                    <p className="nil-auth-brand-sub">The operating system for college athletes navigating Name, Image & Likeness deals.</p>
                    <div className="nil-auth-features">
                        {[
                            { icon: '💰', text: 'Track every dollar of NIL value' },
                            { icon: '📋', text: 'Manage deals, deliverables & compliance' },
                            { icon: '📈', text: 'Grow your brand with data-backed insights' },
                        ].map(f => (
                            <div key={f.text} className="nil-auth-feature-row">
                                <span className="nil-auth-feature-icon">{f.icon}</span>
                                <span>{f.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Decorative circles */}
                <div className="nil-auth-deco nil-auth-deco--1" />
                <div className="nil-auth-deco nil-auth-deco--2" />
                <div className="nil-auth-deco nil-auth-deco--3" />
            </div>

            {/* Right Form Panel */}
            <div className="nil-auth-form-panel">
                <div className="nil-auth-form-card">
                    <div className="nil-auth-form-header">
                        <h1 className="nil-auth-form-title">Welcome back</h1>
                        <p className="nil-auth-form-subtitle">Sign in to your FrontDoor account</p>
                    </div>

                    <form className="nil-auth-form-body" onSubmit={handleLogin}>
                        {error && (
                            <div className="nil-auth-error">
                                <span>⚠</span> {error}
                            </div>
                        )}

                        <div className="nil-auth-field">
                            <label className="nil-auth-label" htmlFor="login-email">Email address</label>
                            <div className="nil-auth-input-wrap">
                                <span className="nil-auth-input-icon">✉</span>
                                <input
                                    id="login-email"
                                    type="email"
                                    placeholder="you@university.edu"
                                    required
                                    className="nil-auth-input nil-auth-input--icon"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="nil-auth-field">
                            <label className="nil-auth-label" htmlFor="login-password">Password</label>
                            <div className="nil-auth-input-wrap">
                                <span className="nil-auth-input-icon">🔒</span>
                                <input
                                    id="login-password"
                                    type={showPw ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    required
                                    className="nil-auth-input nil-auth-input--icon"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="nil-auth-toggle-pw"
                                    onClick={() => setShowPw(v => !v)}
                                >
                                    {showPw ? '🙈' : '👁'}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="nil-auth-submit" disabled={loading}>
                            {loading ? (
                                <span className="nil-auth-spinner">Signing in…</span>
                            ) : (
                                'Sign In →'
                            )}
                        </button>
                    </form>

                    <div className="nil-auth-form-footer">
                        <p>Don't have an account? <Link to="/signup" className="nil-auth-link">Create one free</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
}
