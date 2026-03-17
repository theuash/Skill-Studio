import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ui/ProtectedRoute'

import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import VerifyOtpPage from './pages/VerifyOtpPage'
import DashboardPage from './pages/DashboardPage'
import SectorPage from './pages/SectorPage'
import CompanyDetailsPage from './pages/CompanyDetailsPage'
import RoadmapPage from './pages/RoadmapPage'
import ProjectPage from './pages/ProjectPage'
import AnalysisPage from './pages/AnalysisPage'
import ProfilePage from './pages/ProfilePage'
import NewsPage from './pages/NewsPage'
import JobsPage from './pages/JobsPage'
import JobDetailPage from './pages/JobDetailPage'
import NewsDetailPage from './pages/NewsDetailPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                borderRadius: '12px',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '14px',
              },
            }}
          />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify-otp" element={<VerifyOtpPage />} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/sector/:sectorName" element={<ProtectedRoute><SectorPage /></ProtectedRoute>} />
            <Route path="/company/:companyId" element={<ProtectedRoute><CompanyDetailsPage /></ProtectedRoute>} />
            <Route path="/roadmap/:companyId/:jobRole" element={<ProtectedRoute><RoadmapPage /></ProtectedRoute>} />
            <Route path="/project/:roadmapId" element={<ProtectedRoute><ProjectPage /></ProtectedRoute>} />
            <Route path="/analysis/:projectId" element={<ProtectedRoute><AnalysisPage /></ProtectedRoute>} />
            <Route path="/news" element={<ProtectedRoute><NewsPage /></ProtectedRoute>} />
            <Route path="/news/:articleId" element={<ProtectedRoute><NewsDetailPage /></ProtectedRoute>} />
            <Route path="/jobs" element={<ProtectedRoute><JobsPage /></ProtectedRoute>} />
            <Route path="/jobs/detail/:jobId" element={<ProtectedRoute><JobDetailPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}
