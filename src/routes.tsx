import type { ReactNode } from 'react';
import LandingPage from './pages/LandingPage';
import SubmitComplaintPage from './pages/SubmitComplaintPage';
import TrackComplaintPage from './pages/TrackComplaintPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import ComplaintsListPage from './pages/admin/ComplaintsListPage';
import ComplaintDetailPage from './pages/admin/ComplaintDetailPage';
import AnalyticsDashboardPage from './pages/admin/AnalyticsDashboardPage';
import AuditVerificationPage from './pages/admin/AuditVerificationPage';
import UserManagementPage from './pages/admin/UserManagementPage';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Home',
    path: '/',
    element: <LandingPage />
  },
  {
    name: 'Submit Complaint',
    path: '/submit',
    element: <SubmitComplaintPage />
  },
  {
    name: 'Track Complaint',
    path: '/track',
    element: <TrackComplaintPage />
  },
  {
    name: 'Login',
    path: '/login',
    element: <LoginPage />
  },
  {
    name: 'Admin Dashboard',
    path: '/admin',
    element: <AdminDashboard />
  },
  {
    name: 'Complaints List',
    path: '/admin/complaints',
    element: <ComplaintsListPage />
  },
  {
    name: 'Complaint Detail',
    path: '/admin/complaints/:id',
    element: <ComplaintDetailPage />
  },
  {
    name: 'Analytics',
    path: '/admin/analytics',
    element: <AnalyticsDashboardPage />
  },
  {
    name: 'Audit Queue',
    path: '/admin/audit',
    element: <AuditVerificationPage />
  },
  {
    name: 'User Management',
    path: '/admin/users',
    element: <UserManagementPage />
  }
];

export default routes;
