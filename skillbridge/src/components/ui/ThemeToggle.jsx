import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

export default function ThemeToggle({ compact = false }) {
  const { isDark, toggle } = useTheme()

  return (
    <motion.button
      onClick={toggle}
      whileTap={{ scale: 0.9 }}
      className={`relative rounded-full flex items-center justify-center transition-all ${
        compact ? 'w-9 h-9' : 'w-10 h-10'
      }`}
      style={{
        background: isDark ? 'rgba(108,99,255,0.15)' : 'rgba(108,99,255,0.1)',
        border: '1px solid rgba(108,99,255,0.3)',
      }}
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait">
        {isDark ? (
          <motion.div
            key="sun"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Sun size={16} color="var(--secondary)" />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Moon size={16} color="var(--accent)" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
