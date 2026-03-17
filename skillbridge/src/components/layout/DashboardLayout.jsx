import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Map, FolderGit2, User, LogOut,
  ChevronLeft, ChevronRight, Zap, Newspaper, Briefcase,
  ChevronDown, Compass
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Logo from '../ui/Logo'
import ThemeToggle from '../ui/ThemeToggle'
import toast from 'react-hot-toast'
import api from '../../api/axios'

const SECTORS = [
  { id: 'web-development', name: 'Tech', icon: '💻' },
  { id: 'finance', name: 'Finance', icon: '💰' },
  { id: 'healthcare', name: 'Healthcare', icon: '🏥' },
  { id: 'education', name: 'Education', icon: '🎓' },
  { id: 'manufacturing', name: 'Manufacturing', icon: '🏭' },
]

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/news', icon: Newspaper, label: 'News' },
  { to: '/jobs', icon: Briefcase, label: 'Jobs' },
  { to: '/sector/web-development', icon: Map, label: 'My Roadmaps' },
  { to: '/project/sample', icon: FolderGit2, label: 'Projects' },
  { to: '/profile', icon: User, label: 'Profile' },
]

export default function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false)
  const [sectorsOpen, setSectorsOpen] = useState(false)
  const [jobsCount, setJobsCount] = useState(0)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Fetch jobs count for badge
    const fetchJobsCount = async () => {
      try {
        const res = await api.get('/jobs/count')
        setJobsCount(res.data?.data?.count || 0)
      } catch (err) {
        // Silently fail, badge will show 0
      }
    }
    fetchJobsCount()
  }, [])

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/')
  }

  const handleSectorSelect = (sector) => {
    navigate(`/dashboard?sector=${sector.id}`)
    setSectorsOpen(false)
  }

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'SB'

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 260, x: 0 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="fixed top-0 left-0 h-screen z-40 flex flex-col overflow-hidden hidden md:flex"
        style={{
          background: 'var(--surface)',
          borderRight: '1px solid var(--border)',
        }}
      >
        {/* Logo area */}
        <div className="h-16 flex items-center px-4 flex-shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
          {collapsed ? (
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mx-auto"
              style={{ background: 'linear-gradient(135deg, var(--accent), var(--secondary))' }}>
              <Zap size={16} color="white" />
            </div>
          ) : (
            <Logo size="sm" to="/dashboard" />
          )}
        </div>

        {/* User profile */}
        <div className={`px-3 py-4 flex-shrink-0 ${collapsed ? 'items-center' : ''}`}
          style={{ borderBottom: '1px solid var(--border)' }}>
          <div className={`flex ${collapsed ? 'justify-center' : 'items-center gap-3'}`}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 font-heading font-bold text-sm text-white"
              style={{ background: 'linear-gradient(135deg, var(--accent), var(--secondary))' }}>
              {initials}
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>
                  {user?.name || 'User'}
                </p>
                <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                  {user?.email || 'user@example.com'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {/* Browse by Sector - Collapsible */}
          <div className="space-y-1">
            <button
              onClick={() => setSectorsOpen(o => !o)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full transition-all
                ${collapsed ? 'justify-center' : ''}`}
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(108,99,255,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              title={collapsed ? 'Browse by Sector' : undefined}
            >
              <Compass size={18} className="flex-shrink-0" />
              {!collapsed && (
                <>
                  <span>Sectors</span>
                  <ChevronDown size={14} className={`ml-auto transition-transform ${sectorsOpen ? 'rotate-180' : ''}`} />
                </>
              )}
            </button>

            <AnimatePresence>
              {sectorsOpen && !collapsed && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="ml-6 space-y-1 overflow-hidden"
                >
                  {SECTORS.map(sector => (
                    <button
                      key={sector.id}
                      onClick={() => handleSectorSelect(sector)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs w-full text-left transition-colors"
                      style={{ color: 'var(--text-muted)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(108,99,255,0.1)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <span>{sector.icon}</span>
                      <span>{sector.name}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Separator */}
          <div className="h-px bg-opacity-20 my-3" style={{ background: 'var(--border)' }} />

          {/* Main Navigation Items */}
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                ${collapsed ? 'justify-center' : ''} relative
                ${isActive
                  ? 'text-white'
                  : 'hover:bg-opacity-50'
                }`
              }
              style={({ isActive }) => ({
                background: isActive
                  ? 'linear-gradient(135deg, var(--accent), rgba(0,212,255,0.7))'
                  : 'transparent',
                color: isActive ? 'white' : 'var(--text-muted)',
              })}
              title={collapsed ? label : undefined}
            >
              <Icon size={18} className="flex-shrink-0" />
              {!collapsed && <span>{label}</span>}
              {!collapsed && to === '/jobs' && jobsCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {jobsCount > 99 ? '99+' : jobsCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="px-3 py-4 space-y-2 flex-shrink-0" style={{ borderTop: '1px solid var(--border)' }}>
          <div className={`flex ${collapsed ? 'justify-center' : 'justify-between items-center px-1'}`}>
            {!collapsed && <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Theme</span>}
            <ThemeToggle compact />
          </div>
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full transition-colors
              ${collapsed ? 'justify-center' : ''}
            `}
            style={{ color: '#EF4444' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            title={collapsed ? 'Logout' : undefined}
          >
            <LogOut size={18} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(c => !c)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-110"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            color: 'var(--text-muted)',
          }}
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </motion.aside>

      {/* Main content */}
      <motion.main
        animate={{ marginLeft: collapsed ? 72 : 260 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="flex-1 min-h-screen md:block hidden"
      >
        {children}
      </motion.main>

      {/* Mobile main content */}
      <div className="flex-1 min-h-screen md:hidden">
        {children}
      </div>
    </div>
  )
}
