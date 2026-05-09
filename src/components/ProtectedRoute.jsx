import { Navigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function ProtectedRoute({ children }) {
    const { currentUser, authLoading } = useAppContext();

    // While session is being restored on load, show nothing (no flash redirect)
    if (authLoading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                <div style={{ color: '#6b7280', fontSize: '1rem' }}>Loading...</div>
            </div>
        );
    }

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
