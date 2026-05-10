import { Outlet } from 'react-router-dom';
import DashboardSidebar from '../components/DashboardSidebar';
import AIAssistant from '../components/AIAssistant';

export default function DashboardLayout() {
    return (
        <div className="nil-dashboard-layout">
            <DashboardSidebar />
            <main className="nil-dashboard-main">
                <Outlet />
            </main>
            <AIAssistant />
        </div>
    );
}
