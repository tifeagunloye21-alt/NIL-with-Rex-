import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAppContext } from './context/AppContext';
import Navbar from './components/Navbar';
import LandingNavbar from './components/LandingNavbar';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import ResourcesPage from './pages/ResourcesPage';
import ExploreNILPage from './pages/ExploreNILPage';
import AthleteDashboard from './pages/AthleteDashboard';
import AboutPage from './pages/AboutPage';
import GetStartedPage from './pages/GetStartedPage';
import ForAgentsPage from './pages/ForAgentsPage';
import AuthParams from './pages/AuthParams';
import AgentProfile from './pages/AgentProfile';
import Inbox from './pages/Inbox';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardLayout from './pages/DashboardLayout';
import TrackerPage from './pages/TrackerPage';
import DeliverablesPage from './pages/DeliverablesPage';
import ReportDealPage from './pages/ReportDealPage';
import AgentReportPage from './pages/AgentReportPage';
import EducationPage from './pages/EducationPage';
import CompliancePage from './pages/CompliancePage';
import ProfilePage from './pages/ProfilePage';
import DealDetailPage from './pages/DealDetailPage';

function App() {
  const { currentUser } = useAppContext();
  const { pathname } = useLocation();

  const isLandingPage = pathname === '/' && !currentUser;

  if (isLandingPage) {
    return (
      <div className="nil-page-wrapper">
        <LandingNavbar />
        <main className="nil-main-full">
          <LandingPage />
        </main>
      </div>
    );
  }

  // Public routes that use LandingNavbar (no auth required)
  const publicRoutes = ['/resources', '/about', '/explore', '/get-started', '/for-agents', '/login', '/signup'];
  const isPublicRoute = publicRoutes.some(r => pathname.startsWith(r));

  const dashboardRoutes = ['/athlete-dashboard', '/tracker', '/deliverables', '/deals', '/report-deal', '/agent', '/education', '/compliance', '/profile'];
  const isDashboardRoute = dashboardRoutes.some(r => pathname.startsWith(r));

  if (isPublicRoute) {
    // Auth pages render fullscreen (no LandingNavbar)
    const isAuthRoute = pathname === '/login' || pathname === '/signup';
    if (isAuthRoute) {
      return (
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      );
    }

    return (
      <div className="nil-page-wrapper">
        <LandingNavbar />
        <main className="nil-main-full">
          <Routes>
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/explore" element={<ExploreNILPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/get-started" element={<GetStartedPage />} />
            <Route path="/for-agents" element={<ForAgentsPage />} />
          </Routes>
        </main>
      </div>
    );
  }


  if (isDashboardRoute) {
    return (
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/athlete-dashboard" element={<ProtectedRoute><AthleteDashboard /></ProtectedRoute>} />
          <Route path="/tracker" element={<ProtectedRoute><TrackerPage /></ProtectedRoute>} />
          <Route path="/deliverables" element={<ProtectedRoute><DeliverablesPage /></ProtectedRoute>} />
          <Route path="/report-deal" element={<ProtectedRoute><ReportDealPage /></ProtectedRoute>} />
          <Route path="/education" element={<ProtectedRoute><EducationPage /></ProtectedRoute>} />
          <Route path="/compliance" element={<ProtectedRoute><CompliancePage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/agent/report-deal" element={<ProtectedRoute><AgentReportPage /></ProtectedRoute>} />
          <Route path="/deals/:dealId" element={<ProtectedRoute><DealDetailPage /></ProtectedRoute>} />
        </Route>
      </Routes>
    );
  }

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={!currentUser ? <LandingPage /> : <Navigate to={currentUser.role === 'athlete' ? '/athlete-dashboard' : '/inbox'} />} />
          <Route path="/auth" element={<AuthParams />} />
          <Route path="/dashboard" element={currentUser?.role === 'athlete' ? <AthleteDashboard /> : <Navigate to="/" />} />
          <Route path="/agents/:id" element={<AgentProfile />} />
          <Route path="/inbox" element={currentUser ? <Inbox /> : <Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
