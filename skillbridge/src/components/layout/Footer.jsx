import { Github, Twitter, Linkedin, Youtube } from 'lucide-react'
import { motion } from 'framer-motion'
import Logo from '../ui/Logo'
import HeartIcon from '../icons/HeartIcon'

export default function Footer() {
  const links = {
    Product: ['Features', 'Roadmaps', 'Companies', 'Pricing'],
    Resources: ['Documentation', 'Blog', 'Community', 'Support'],
    Company: ['About', 'Careers', 'Press', 'Contact'],
    Legal: ['Privacy', 'Terms', 'Cookies', 'Security'],
  }

  const socials = [
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Youtube, href: '#', label: 'YouTube' },
  ]

  return (
    <footer style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <Logo size="md" />
            <p className="mt-4 text-sm leading-relaxed max-w-xs" style={{ color: 'var(--text-muted)' }}>
              Bridge the gap between learning and earning. AI-powered career guidance for the modern developer.
            </p>
            <div className="flex items-center gap-2 mt-6">
              {socials.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  whileHover={{ scale: 1.15, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer"
                  style={{
                    background: 'rgba(108,99,255,0.1)',
                    color: 'var(--text-muted)',
                    border: '1px solid var(--border)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--accent)'
                    e.currentTarget.style.color = 'var(--accent)'
                    e.currentTarget.style.background = 'rgba(108,99,255,0.15)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--border)'
                    e.currentTarget.style.color = 'var(--text-muted)'
                    e.currentTarget.style.background = 'rgba(108,99,255,0.1)'
                  }}
                >
                  <Icon size={16} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold mb-4" style={{ color: 'var(--text)' }}>
                {category}
              </h4>
              <ul className="space-y-3">
                {items.map(item => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm transition-colors hover:opacity-100"
                      style={{ color: 'var(--text-muted)' }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid var(--border)' }}>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            © 2025 Skill Studio. All rights reserved.
          </p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Built with <HeartIcon size={14} className="inline mx-1" style={{ color: 'var(--secondary)' }} /> for developers worldwide
          </p>
        </div>
      </div>
    </footer>
  )
}
