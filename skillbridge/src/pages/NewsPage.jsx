import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw, Clock, TrendingUp, TrendingDown, Minus, Filter } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import Button from '../components/ui/Button'
import api from '../api/axios'
import toast from 'react-hot-toast'

const SECTOR_COLORS = {
  Tech: { bg: 'rgba(108,99,255,0.1)', text: '#6C63FF', border: 'rgba(108,99,255,0.3)' },
  Finance: { bg: 'rgba(76,205,196,0.1)', text: '#4ECDC4', border: 'rgba(76,205,196,0.3)' },
  Healthcare: { bg: 'rgba(255,193,7,0.1)', text: '#FFC107', border: 'rgba(255,193,7,0.3)' },
  Education: { bg: 'rgba(255,107,107,0.1)', text: '#FF6B6B', border: 'rgba(255,107,107,0.3)' },
}

const IMPACT_COLORS = {
  High: '#FF6B6B',
  Medium: '#FFC107',
  Low: '#4ECDC4',
}

function ArticleSkeleton() {
  return (
    <div className="p-4 rounded-xl animate-pulse" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-16 h-4 bg-gray-300 rounded"></div>
        <div className="w-12 h-4 bg-gray-300 rounded"></div>
        <div className="w-8 h-4 bg-gray-300 rounded"></div>
      </div>
      <div className="w-3/4 h-5 bg-gray-300 rounded mb-2"></div>
      <div className="w-full h-4 bg-gray-300 rounded mb-1"></div>
      <div className="w-2/3 h-4 bg-gray-300 rounded"></div>
    </div>
  )
}

function SkillTrend({ skill, trend, demandScore }) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'Rising': return <TrendingUp size={14} style={{ color: '#4ECDC4' }} />
      case 'Declining': return <TrendingDown size={14} style={{ color: '#FF6B6B' }} />
      default: return <Minus size={14} style={{ color: '#FFC107' }} />
    }
  }

  const getTrendColor = () => {
    switch (trend) {
      case 'Rising': return '#4ECDC4'
      case 'Declining': return '#FF6B6B'
      default: return '#FFC107'
    }
  }

  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2">
        {getTrendIcon()}
        <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>{skill}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: getTrendColor() }}
            initial={{ width: 0 }}
            animate={{ width: `${demandScore}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{demandScore}%</span>
      </div>
    </div>
  )
}

export default function NewsPage() {
  const navigate = useNavigate()
  const [news, setNews] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedSector, setSelectedSector] = useState('All')
  const [refreshing, setRefreshing] = useState(false)

  const fetchNews = async (force = false) => {
    try {
      setRefreshing(force)
      const res = await api.get(`/news/daily${force ? '?force=true' : ''}`)
      setNews(res.data)
      if (force) {
        toast.success('News updated!')
      }
    } catch (err) {
      toast.error('Failed to load news. Please try again.')
      console.error('News fetch error:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchNews()
  }, [])

  const filteredArticles = news?.articles?.filter(article =>
    selectedSector === 'All' || article.sector === selectedSector
  ) || []

  const sectorTabs = ['All', 'Tech', 'Finance', 'Healthcare', 'Education']

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6 lg:p-8 max-w-7xl">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {[...Array(6)].map((_, i) => <ArticleSkeleton key={i} />)}
            </div>
            <div className="space-y-6">
              <div className="p-4 rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <div className="w-32 h-4 bg-gray-300 rounded mb-4"></div>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-full h-3 bg-gray-300 rounded mb-2"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading font-extrabold text-3xl mb-2" style={{ color: 'var(--text)' }}>
              Industry News
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              AI-curated daily briefing for tech professionals
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs px-3 py-1 rounded-full" style={{ background: 'rgba(76,205,196,0.1)', color: '#4ECDC4' }}>
              Last updated: {news?.date || 'Today'}
            </span>
            <Button
              onClick={() => fetchNews(true)}
              loading={refreshing}
              variant="secondary"
              size="sm"
            >
              <RefreshCw size={14} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Headline Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl mb-8 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(108,99,255,0.15) 0%, rgba(0,212,255,0.1) 100%)',
            border: '1px solid rgba(108,99,255,0.25)',
          }}
        >
          <div className="absolute right-0 top-0 w-32 h-32 opacity-10"
            style={{
              background: 'radial-gradient(circle, var(--accent), transparent)',
              transform: 'translate(20%, -20%)',
            }} />
          <div className="relative z-10">
            <div className="text-xs mb-2 font-semibold" style={{ color: 'var(--accent)' }}>
              Today's Top Story
            </div>
            <h2 className="font-heading font-bold text-2xl" style={{ color: 'var(--text)' }}>
              {news?.headline}
            </h2>
          </div>
        </motion.div>

        {/* Sector Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {sectorTabs.map(sector => (
            <button
              key={sector}
              onClick={() => setSelectedSector(sector)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedSector === sector ? 'scale-105' : ''
              }`}
              style={{
                background: selectedSector === sector
                  ? 'linear-gradient(135deg, var(--accent), rgba(0,212,255,0.7))'
                  : 'var(--surface)',
                border: `1px solid ${selectedSector === sector ? 'var(--accent)' : 'var(--border)'}`,
                color: selectedSector === sector ? 'white' : 'var(--text-muted)',
              }}
            >
              {sector}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Articles Grid */}
          <div className="lg:col-span-2">
            <div className="grid gap-6">
              <AnimatePresence mode="popLayout">
                {filteredArticles.map((article, i) => {
                  const sectorColors = SECTOR_COLORS[article.sector] || SECTOR_COLORS.Tech
                  return (
                    <motion.div
                      key={article.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: i * 0.05 }}
                      className="p-4 rounded-xl cursor-pointer transition-all hover:-translate-y-1"
                      style={{
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                      }}
                      onClick={() => navigate(`/news/${article.id}`)}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                    >
                      {/* Article Header */}
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <span
                          className="px-2 py-1 rounded-full text-xs font-semibold"
                          style={{ background: sectorColors.bg, color: sectorColors.text }}
                        >
                          {article.sector}
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'var(--background)', color: 'var(--text-muted)' }}>
                          {article.category}
                        </span>
                        <div className="flex items-center gap-1">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ background: IMPACT_COLORS[article.impact] }}
                          />
                          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                            {article.impact} Impact
                          </span>
                        </div>
                        <span className="text-xs ml-auto" style={{ color: 'var(--text-muted)' }}>
                          {article.readTime}
                        </span>
                      </div>

                      {/* Article Content */}
                      <h3 className="font-semibold text-lg mb-2" style={{ color: 'var(--text)' }}>
                        {article.title}
                      </h3>
                      <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-muted)' }}>
                        {article.summary}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        {article.tags?.map((tag, j) => (
                          <span
                            key={j}
                            className="px-2 py-1 rounded text-xs"
                            style={{ background: 'var(--background)', color: 'var(--text-muted)' }}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending Skills */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="p-4 rounded-xl"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <h3 className="font-heading font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text)' }}>
                🔥 Trending Skills
              </h3>
              <div className="space-y-1">
                {news?.trendingSkills?.map((skill, i) => (
                  <SkillTrend key={i} {...skill} />
                ))}
              </div>
            </motion.div>

            {/* Sector Pulse */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="p-4 rounded-xl"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <h3 className="font-heading font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text)' }}>
                📊 Sector Pulse
              </h3>
              <div className="space-y-3">
                {Object.entries(news?.sectorSummary || {}).map(([sector, summary], i) => {
                  const sectorColors = SECTOR_COLORS[sector] || SECTOR_COLORS.Tech
                  return (
                    <div key={sector} className="p-3 rounded-lg" style={{ background: 'var(--background)' }}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-semibold" style={{ color: sectorColors.text }}>
                          {sector}
                        </span>
                      </div>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {summary}
                      </p>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}