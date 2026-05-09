import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function AuthParams() {
    const [searchParams] = useSearchParams();
    const { login } = useAppContext();
    const navigate = useNavigate();

    useEffect(() => {
        const role = searchParams.get('role');
        const name = searchParams.get('name') || (role === 'athlete' ? 'Demo Athlete' : 'Demo Agent');
        console.log("Logging in as", role, name)

        if (role === 'athlete' || role === 'agent') {
            login({ role, name }); // ID is mock-hardcoded in context ('u1' or 'a1' realistically, but context uses 'u1')
            navigate(role === 'athlete' ? '/dashboard' : '/inbox');
        } else {
            navigate('/');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    return <div style={{ textAlign: 'center', padding: '2rem' }}>Authenticating...</div>;
}
