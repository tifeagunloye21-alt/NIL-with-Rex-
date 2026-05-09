import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const ROLES = [
    { value: 'athlete', icon: '🏅', label: 'Athlete', desc: 'Track your NIL deals & earnings' },
    { value: 'agent', icon: '🤝', label: 'Agent', desc: 'Manage your athletes & deals' },
    { value: 'school', icon: '🏫', label: 'School', desc: 'Monitor compliance & reports' },
];

export default function SignupPage() {
    const navigate = useNavigate();
    const { signup } = useAppContext();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('athlete');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const userRole = await signup({ name, email, password, role });
            if (userRole === 'agent') navigate('/for-agents');
            else if (userRole === 'school') navigate('/school-dashboard');
            else navigate('/athlete-dashboard');
        } catch (err) {
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const pwStrength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
    const pwColors = ['#e5e7eb', '#ef4444', '#f59e0b', '#22c55e'];
    const pwLabels = ['', 'Weak', 'Fair', 'Strong'];

    return (
        <div className="nil-auth-split">
            {/* Left Brand Panel */}
            <div className="nil-auth-brand-panel">
                <div className="nil-auth-brand-inner">
                    <div className="nil-auth-brand-logo">
                        <span className="nil-auth-logo-mark">FD</span>
                        <span className="nil-auth-logo-word">FrontDoor</span>
                    </div>
                    <h2 className="nil-auth-brand-headline">Your first step<br />into NIL.</h2>
                    <p className="nil-auth-brand-sub">Join hundreds of athletes, agents and schools using FrontDoor to manage NIL with confidence.</p>
                    <div className="nil-auth-features">
                        {[
                            { icon: '⚡', text: 'Set up in under 2 minutes' },
                            { icon: '🔒', text: 'Bank-grade security for your data' },
                            { icon: '🎓', text: 'Built for student-athletes first' },
                        ].map(f => (
                            <div key={f.text} className="nil-auth-feature-row">
                                <span className="nil-auth-feature-icon">{f.icon}</span>
                                <span>{f.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="nil-auth-deco nil-auth-deco--1" />
                <div className="nil-auth-deco nil-auth-deco--2" />
                <div className="nil-auth-deco nil-auth-deco--3" />
            </div>

            {/* Right Form Panel */}
            <div className="nil-auth-form-panel">
                <div className="nil-auth-form-card">
                    <div className="nil-auth-form-header">
                        <h1 className="nil-auth-form-title">Create account</h1>
                        <p className="nil-auth-form-subtitle">Start your NIL journey with FrontDoor</p>
                    </div>

                    <form className="nil-auth-form-body" onSubmit={handleSignup}>
                        {error && (
                            <div className="nil-auth-error">
                                <span>⚠</span> {error}
                            </div>
                        )}

                        <div className="nil-auth-field">
                            <label className="nil-auth-label" htmlFor="signup-name">Full Name</label>
                            <div className="nil-auth-input-wrap">
                                <span className="nil-auth-input-icon">👤</span>
                                <input
                                    id="signup-name"
                                    type="text"
                                    placeholder="Your full name"
                                    required
                                    className="nil-auth-input nil-auth-input--icon"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="nil-auth-field">
                            <label className="nil-auth-label" htmlFor="signup-email">Email address</label>
                            <div className="nil-auth-input-wrap">
                                <span className="nil-auth-input-icon">✉</span>
                                <input
                                    id="signup-email"
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
                            <label className="nil-auth-label" htmlFor="signup-password">Password</label>
                            <div className="nil-auth-input-wrap">
                                <span className="nil-auth-input-icon">🔒</span>
                                <input
                                    id="signup-password"
                                    type="password"
                                    placeholder="Min. 6 characters"
                                    required
                                    minLength={6}
                                    className="nil-auth-input nil-auth-input--icon"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            {password.length > 0 && (
                                <div className="nil-pw-strength">
                                    <div className="nil-pw-bars">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="nil-pw-bar"
                                                style={{ background: i <= pwStrength ? pwColors[pwStrength] : '#e5e7eb' }} />
                                        ))}
                                    </div>
                                    <span className="nil-pw-label" style={{ color: pwColors[pwStrength] }}>{pwLabels[pwStrength]}</span>
                                </div>
                            )}
                        </div>

                        <div className="nil-auth-field">
                            <label className="nil-auth-label">I am a…</label>
                            <div className="nil-role-cards">
                                {ROLES.map(r => (
                                    <label key={r.value} className={`nil-role-card${role === r.value ? ' active' : ''}`}>
                                        <input
                                            type="radio"
                                            name="role"
                                            value={r.value}
                                            checked={role === r.value}
                                            onChange={() => setRole(r.value)}
                                            style={{ display: 'none' }}
                                        />
                                        <span className="nil-role-card-icon">{r.icon}</span>
                                        <span className="nil-role-card-label">{r.label}</span>
                                        <span className="nil-role-card-desc">{r.desc}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <button type="submit" className="nil-auth-submit" disabled={loading}>
                            {loading ? 'Creating account…' : 'Create Account →'}
                        </button>
                    </form>

                    <div className="nil-auth-form-footer">
                        <p>Already have an account? <Link to="/login" className="nil-auth-link">Sign in</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
}
