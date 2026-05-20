import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const ALL_STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut',
  'Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa',
  'Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan',
  'Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire',
  'New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio',
  'Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota',
  'Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia',
  'Wisconsin','Wyoming',
];

export default function SignupPage() {
    const navigate = useNavigate();
    const { signup } = useAppContext();
    const [role, setRole] = useState('athlete');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [school, setSchool] = useState('');
    const [sport, setSport] = useState('');
    const [schoolState, setSchoolState] = useState('');
    const [homeState, setHomeState] = useState('');
    const [agency, setAgency] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
        setLoading(true);
        try {
            const r = await signup({ name, email, password, role });
            // Pre-save tax profile so Tax Center is personalized immediately
            if (r === 'agent') {
                navigate('/agent-dashboard');
            } else {
                const stored = JSON.parse(localStorage.getItem('fd_offline_users') || '{}');
                const uid = stored[email]?.id;
                if (uid && (schoolState || homeState)) {
                    localStorage.setItem(`fd_taxprofile_${uid}`, JSON.stringify({ schoolState, homeState, nilActivityStates: [] }));
                }
                navigate('/athlete-dashboard');
            }
        } catch (err) {
            setError(err.message || 'Failed to create account.');
        } finally {
            setLoading(false);
        }
    };

    const inp = {
        width: '100%', padding: '0.82rem 1rem', borderRadius: '10px',
        border: '1.5px solid #e5e7eb', fontSize: '0.93rem', outline: 'none',
        boxSizing: 'border-box', background: 'white', color: '#111827',
        transition: 'border-color 0.15s, box-shadow 0.15s',
    };
    const focusInp = (e) => Object.assign(e.target.style, { borderColor: '#0052FF', boxShadow: '0 0 0 3px rgba(0,82,255,0.1)' });
    const blurInp  = (e) => Object.assign(e.target.style, { borderColor: '#e5e7eb', boxShadow: 'none' });
    const lbl = { display: 'block', fontSize: '0.83rem', fontWeight: 600, color: '#374151', marginBottom: '0.45rem' };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '3rem 1.5rem', fontFamily: "'Inter', system-ui, sans-serif" }}>

            {/* Logo — just plain text like the reference */}
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#111827', letterSpacing: '-0.5px', marginBottom: '2.5rem' }}>
                FrontDoor
            </div>

            <div style={{ width: '100%', maxWidth: '480px', background: 'white', borderRadius: '20px', padding: '2.75rem 2.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0' }}>

                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#111827', margin: '0 0 0.4rem', letterSpacing: '-0.5px' }}>Create Your Account</h1>
                    <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem' }}>Join the platform built for student-athletes and agents</p>
                </div>

                <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                    {error && (
                        <div style={{ background: '#fef2f2', color: '#dc2626', padding: '0.7rem 1rem', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600, border: '1px solid #fecaca' }}>
                            {error}
                        </div>
                    )}

                    {/* Role Selection */}
                    <div>
                        <label style={lbl}>I am a...</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                            {[
                                { id: 'athlete', icon: '🏃', label: 'Athlete' },
                                { id: 'agent',   icon: '💼', label: 'Agent'   },
                            ].map(r => (
                                <div
                                    key={r.id}
                                    onClick={() => setRole(r.id)}
                                    style={{
                                        border: `2px solid ${role === r.id ? '#0052FF' : '#e5e7eb'}`,
                                        background: role === r.id ? '#eff6ff' : 'white',
                                        borderRadius: '12px', padding: '1.25rem 1rem',
                                        textAlign: 'center', cursor: 'pointer',
                                        transition: 'all 0.15s',
                                        boxShadow: role === r.id ? '0 2px 10px rgba(0,82,255,0.12)' : 'none',
                                    }}
                                >
                                    <div style={{ fontSize: '1.6rem', marginBottom: '0.4rem' }}>{r.icon}</div>
                                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: role === r.id ? '#0052FF' : '#4b5563' }}>{r.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Full Name */}
                    <div>
                        <label style={lbl}>Full Name</label>
                        <input type="text" required placeholder="Jordan Adams" value={name} onChange={e => setName(e.target.value)} style={inp} onFocus={focusInp} onBlur={blurInp} />
                    </div>

                    {/* Email */}
                    <div>
                        <label style={lbl}>Email</label>
                        <input type="email" required placeholder="you@university.edu" value={email} onChange={e => setEmail(e.target.value)} style={inp} onFocus={focusInp} onBlur={blurInp} />
                    </div>

                    {/* Password row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                        <div>
                            <label style={lbl}>Password</label>
                            <input type="password" required placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} style={inp} onFocus={focusInp} onBlur={blurInp} />
                        </div>
                        <div>
                            <label style={lbl}>Confirm Password</label>
                            <input type="password" required placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} style={inp} onFocus={focusInp} onBlur={blurInp} />
                        </div>
                    </div>

                    {/* Role-specific fields */}
                    {role === 'athlete' && (
                        <>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                            <div>
                                <label style={lbl}>School / University</label>
                                <input type="text" placeholder="University of Example" value={school} onChange={e => setSchool(e.target.value)} style={inp} onFocus={focusInp} onBlur={blurInp} />
                            </div>
                            <div>
                                <label style={lbl}>Sport</label>
                                <input type="text" placeholder="Football" value={sport} onChange={e => setSport(e.target.value)} style={inp} onFocus={focusInp} onBlur={blurInp} />
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                            <div>
                                <label style={lbl}>School State <span style={{ color: '#9ca3af', fontWeight: 400 }}>(optional)</span></label>
                                <select value={schoolState} onChange={e => setSchoolState(e.target.value)} style={{ ...inp, cursor: 'pointer' }}>
                                    <option value="">Select state...</option>
                                    {ALL_STATES.map(s => <option key={s}>{s}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={lbl}>Home / Residency State <span style={{ color: '#9ca3af', fontWeight: 400 }}>(optional)</span></label>
                                <select value={homeState} onChange={e => setHomeState(e.target.value)} style={{ ...inp, cursor: 'pointer' }}>
                                    <option value="">Select state...</option>
                                    {ALL_STATES.map(s => <option key={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>
                        </>
                    )}

                    {role === 'agent' && (
                        <div>
                            <label style={lbl}>Agency / Organization</label>
                            <input type="text" required placeholder="Sports Agency LLC" value={agency} onChange={e => setAgency(e.target.value)} style={inp} onFocus={focusInp} onBlur={blurInp} />
                        </div>
                    )}

                    <button
                        type="submit" disabled={loading}
                        style={{ width: '100%', background: '#0052FF', color: 'white', border: 'none', borderRadius: '10px', padding: '0.9rem', fontSize: '1rem', fontWeight: 700, marginTop: '0.5rem', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, boxShadow: '0 4px 14px rgba(0,82,255,0.28)', transition: 'background 0.15s' }}
                        onMouseEnter={e => !loading && (e.target.style.background = '#0047e0')}
                        onMouseLeave={e => !loading && (e.target.style.background = '#0052FF')}
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: '#6b7280' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: '#0052FF', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
                </p>
            </div>
        </div>
    );
}
