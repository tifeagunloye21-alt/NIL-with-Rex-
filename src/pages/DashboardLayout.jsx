import { Outlet } from 'react-router-dom';
import DashboardSidebar from '../components/DashboardSidebar';

export default function DashboardLayout() {
    return (
        <div className="nil-dashboard-layout">
            <DashboardSidebar />
            <main className="nil-dashboard-main">
                <Outlet />
            </main>
        </div>
    );
}
