import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, ExternalLink } from 'lucide-react'

const LEVEL_COLORS = {
  Beginner: { bg: 'rgba(76,205,196,0.15)', text: '#4ECDC4', border: 'rgba(76,205,196,0.3)' },
  Intermediate: { bg: 'rgba(108,99,255,0.15)', text: '#6C63FF', border: 'rgba(108,99,255,0.3)' },
  Advanced: { bg: 'rgba(255,107,107,0.15)', text: '#FF6B6B', border: 'rgba(255,107,107,0.3)' },
}

const SKILL_LEVELS = {
  // Explicit levels
  'React': 'Intermediate', 'TypeScript': 'Intermediate', 'Python': 'Beginner',
  'Go': 'Advanced', 'Kubernetes': 'Advanced', 'Docker': 'Intermediate',
  'SQL': 'Beginner', 'Machine Learning': 'Advanced', 'Node.js': 'Intermediate',
  'Java': 'Intermediate', 'Rust': 'Advanced', 'C++': 'Advanced',
  'GraphQL': 'Intermediate', 'Solidity': 'Advanced', 'Swift': 'Intermediate',
  'Kotlin': 'Intermediate', 'Flutter': 'Intermediate', 'CSS': 'Beginner',
}
function getLevel(skill) {
  return SKILL_LEVELS[skill] || ['Beginner', 'Intermediate', 'Advanced'][
    skill.charCodeAt(0) % 3
  ]
}

export default function CompanyCard({ company, sectorId }) {
  const navigate = useNavigate()

  const handleViewSkills = (e) => {
    e.preventDefault()
    const companySlug = company.companyId || company.id
    navigate(`/company/${companySlug}`)
  }

  return (
    <div
      className="h-64 cursor-pointer"
      onClick={handleViewSkills}
    >
      <motion.div
        whileHover={{ y: -4 }}
        className="w-full h-full rounded-2xl p-6 flex flex-col"
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
        }}
      >
        {/* Logo */}
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-14 h-14 rounded-2xl overflow-hidden flex items-center justify-center"
            style={{ background: 'rgba(108,99,255,0.08)', border: '1px solid var(--border)' }}
          >
            <img
              src={`https://logo.clearbit.com/${company.domain}`}
              alt={company.name}
              className="w-10 h-10 object-contain"
              onError={e => {
                e.target.style.display = 'none'
                e.target.parentElement.innerHTML = `<span style="font-size:1.5rem">${company.name[0]}</span>`
              }}
            />
          </div>
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ background: 'rgba(108,99,255,0.12)' }}
          >
            <ExternalLink size={14} color="var(--accent)" />
          </div>
        </div>

        <h3 className="font-heading font-bold text-lg mb-1.5" style={{ color: 'var(--text)' }}>
          {company.name}
        </h3>
        <p className="text-sm flex-1" style={{ color: 'var(--text-muted)' }}>
          {company.tagline}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs px-2 py-1 rounded-full"
            style={{ background: 'rgba(108,99,255,0.1)', color: 'var(--accent)' }}>
            {company.skills.length} skills required
          </span>
          <span className="text-xs flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
            View skills <ArrowRight size={12} />
          </span>
        </div>

        {/* Hover glow border */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity pointer-events-none"
          style={{
            boxShadow: 'inset 0 0 0 1px rgba(108,99,255,0.4)',
          }}
        />
      </motion.div>
    </div>
  )
}
