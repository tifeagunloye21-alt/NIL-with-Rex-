import { Navigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

// requiredRole: 'athlete' | 'agent' | undefined
// If set, users of the wrong role are bounced to their own dashboard.
export default function ProtectedRoute({ children, requiredRole }) {
    const { currentUser, authLoading } = useAppContext();

    if (authLoading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                <div style={{ color: '#6b7280', fontSize: '1rem' }}>Loading...</div>
            </div>
        );
    }

    if (!currentUser) return <Navigate to="/login" replace />;

    if (requiredRole && currentUser.role !== requiredRole) {
        const redirect = currentUser.role === 'agent' ? '/agent-dashboard' : '/athlete-dashboard';
        return <Navigate to={redirect} replace />;
    }

    return children;
}
