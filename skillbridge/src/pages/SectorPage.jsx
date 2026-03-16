import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, ArrowLeft, SlidersHorizontal } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import CompanyCard from '../components/ui/CompanyCard'
import { SkeletonCard } from '../components/ui/Skeleton'
import { SECTORS, COMPANIES } from '../utils/data'
import api from '../api/axios'

export default function SectorPage() {
  const { sectorName } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [companies, setCompanies] = useState([])
  const [sector, setSector] = useState(null)

  useEffect(() => {
    const sec = SECTORS.find(s => s.id === sectorName)
    setSector(sec)
    setLoading(true)

    const fetchCompanies = async () => {
      try {
        const res = await api.get(`/sectors/${sectorName}/companies`)
        const apiCompanies = res.data?.data?.companies || []
        const companies = apiCompanies.map((c) => ({
          ...c,
          // Keep older components expecting `id` field
          id: c.companyId || c._id,
          // Convert backend requiredSkills into the UI-friendly skills list
          skills: c.requiredSkills?.map((s) => s.skill) || [],
        }))
        if (companies.length === 0) {
          throw new Error('No companies returned from API')
        }
        setCompanies(companies)
      } catch (err) {
        // Fallback to built-in list if API is unavailable
        const fallback = COMPANIES[sectorName] || []
        setCompanies(
          fallback.map((c) => ({
            ...c,
            companyId: c.companyId || c.id,
            id: c.id,
          }))
        )
      } finally {
        setLoading(false)
      }
    }

    fetchCompanies()
  }, [sectorName])

  const filtered = companies.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.tagline.toLowerCase().includes(search.toLowerCase()) ||
    c.skills.some(s => s.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-sm mb-6 transition-colors"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>

          <div className="flex items-center gap-4 mb-2">
            {sector && (
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                style={{ background: `${sector.color}18`, border: `1px solid ${sector.color}30` }}>
                {sector.icon}
              </div>
            )}
            <div>
              <h1 className="font-heading font-extrabold text-3xl" style={{ color: 'var(--text)' }}>
                {sector?.name || sectorName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </h1>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                {companies.length} companies · Click a card to see required skills
              </p>
            </div>
          </div>
        </motion.div>

        {/* Search & filter bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-3 mb-8"
        >
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search companies or skills..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
              }}
              onFocus={e => {
                e.target.style.borderColor = 'var(--accent)'
                e.target.style.boxShadow = '0 0 0 3px rgba(108,99,255,0.15)'
              }}
              onBlur={e => {
                e.target.style.borderColor = 'var(--border)'
                e.target.style.boxShadow = 'none'
              }}
            />
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
          >
            <SlidersHorizontal size={15} />
            Filter
          </button>
        </motion.div>

        {/* Company grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="font-heading font-bold text-xl mb-2" style={{ color: 'var(--text)' }}>
              No companies found
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Try a different search term or skill name
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((company, i) => (
              <motion.div
                key={company.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
              >
                <CompanyCard company={company} sectorId={sectorName} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
