import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Map, FolderGit2, User, LogOut,
  ChevronLeft, ChevronRight, Zap
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Logo from '../ui/Logo'
import ThemeToggle from '../ui/ThemeToggle'
import toast from 'react-hot-toast'

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/sector/web-development', icon: Map, label: 'My Roadmaps' },
  { to: '/project/sample', icon: FolderGit2, label: 'Projects' },
  { to: '/profile', icon: User, label: 'Profile' },
]

export default function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/')
  }

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'SB'

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="fixed top-0 left-0 h-screen z-40 flex flex-col overflow-hidden"
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
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                ${collapsed ? 'justify-center' : ''}
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
        className="flex-1 min-h-screen"
      >
        {children}
      </motion.main>
    </div>
  )
}
