import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Bookmark, BookmarkCheck, ExternalLink } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import DashboardLayout from '../components/layout/DashboardLayout'
import Button from '../components/ui/Button'
import api from '../api/axios'
import toast from 'react-hot-toast'

function formatDaysAgo(dateString) {
  if (!dateString) return ''
  const now = new Date()
  const posted = new Date(dateString)
  const diffMs = now - posted
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return '1 day ago'
  return `${diffDays} days ago`
}

function SkillRow({ skill, level, hasSkill }) {
  const levelColor = {
    Beginner: 'rgba(76,205,196,0.15)',
    Intermediate: 'rgba(108,99,255,0.15)',
    Advanced: 'rgba(255,107,107,0.15)',
  }[level] || 'rgba(108,99,255,0.1)'

  const textColor = {
    Beginner: 'var(--accent)',
    Intermediate: 'var(--secondary)',
    Advanced: 'var(--danger)',
  }[level] || 'var(--text)'

  return (
    <div
      className="flex items-center justify-between gap-3 p-3 rounded-xl"
      style={{
        background: hasSkill ? 'rgba(76,205,196,0.08)' : 'rgba(255,107,107,0.06)',
        border: `1px solid ${hasSkill ? 'rgba(76,205,196,0.2)' : 'rgba(255,107,107,0.2)'}`,
      }}
    >
      <div className="flex items-center gap-2">
        <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: 'var(--background)', color: 'var(--text-muted)' }}>
          {skill}
        </span>
        {hasSkill && (
          <span className="text-xs font-medium" style={{ color: 'var(--accent)' }}>
            ✓ You have this
          </span>
        )}
      </div>
      <span
        className="text-xs font-semibold px-2 py-1 rounded-full"
        style={{ background: levelColor, color: textColor }}
      >
        {level}
      </span>
    </div>
  )
}

function SkeletonRow() {
  return (
    <div className="animate-pulse p-4 rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
      <div className="h-4 bg-gray-300 rounded mb-3" />
      <div className="h-3 bg-gray-300 rounded mb-2" />
      <div className="h-3 bg-gray-300 rounded" />
    </div>
  )
}

export default function JobDetailPage() {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState(null)

  const company = useMemo(() => {
    if (!job) return null
    if (typeof job.company === 'string') {
      return { name: job.company }
    }
    return job.company
  }, [job])

  const companyWebsite = job?.companyUrl || company?.website || ''

  const fetchJob = async () => {
    try {
      setLoading(true)
      const res = await api.get(`/jobs/${jobId}`)
      if (!res.data?.success) {
        throw new Error(res.data?.error || 'Unable to load job')
      }
      setJob(res.data.data)
    } catch (err) {
      console.error('Job detail error:', err)
      setError(err.message || 'Failed to load job')
    } finally {
      setLoading(false)
    }
  }

  const checkSaved = async () => {
    try {
      const res = await api.get('/jobs/saved/list')
      const savedIds = res.data?.savedJobs || []
      setSaved(savedIds.includes(jobId))
    } catch (err) {
      console.error('Saved jobs fetch error:', err)
    }
  }

  const toggleSave = async () => {
    try {
      const endpoint = `/jobs/saved/${jobId}`
      await api.post(endpoint)
      setSaved((prev) => !prev)
      toast.success(saved ? 'Removed from saved jobs' : 'Job saved')
    } catch (err) {
      toast.error('Unable to update saved jobs')
      console.error('Save toggle error:', err)
    }
  }

  const handleApply = () => {
    if (companyWebsite) {
      window.open(companyWebsite, '_blank', 'noopener,noreferrer')
    } else {
      toast('No career page available for this company')
    }
  }

  useEffect(() => {
    fetchJob()
    checkSaved()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId])

  const matchedSkills = useMemo(() => {
    if (!job) return { matched: 0, total: 0, items: [] }

    const learned = (user?.skillsLearned || []).map((s) => s.toLowerCase())
    const skills = job.requiredSkills || []

    const items = skills.map((skill) => {
      const has = learned.includes(skill.name.toLowerCase())
      return { ...skill, has }
    })

    const matched = items.filter((item) => item.has).length
    return { matched, total: items.length, items }
  }, [job, user?.skillsLearned])

  const similarJobsUrl = (sector) => `/jobs?sector=${encodeURIComponent(sector)}&limit=3&exclude=${jobId}`

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6 lg:p-8 max-w-7xl">
          <div className="space-y-6">
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error || !job) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[70vh]">
          <div className="p-8 rounded-2xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <h2 className="font-semibold text-xl" style={{ color: 'var(--text)' }}>
              Job not found
            </h2>
            <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
              This position may no longer be available.
            </p>
            <Button onClick={() => navigate('/jobs')} className="mt-4">
              Browse All Jobs
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const postedLabel = formatDaysAgo(job.postedAt)
  const matchPercent = matchedSkills.total ? (matchedSkills.matched / matchedSkills.total) * 100 : 0

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 max-w-7xl">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-medium mb-6"
          style={{ color: 'var(--text)' }}
        >
          <ArrowLeft size={16} />
          <span className="hover:text-accent transition-colors">Back to Jobs</span>
        </button>

        {/* Hero */}
        <div className="grid lg:grid-cols-12 gap-6 mb-8">
          <div className="lg:col-span-8 p-6 rounded-2xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div className="flex flex-col lg:flex-row lg:items-start gap-6">
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold"
                  style={{
                    background: 'linear-gradient(135deg, var(--accent), rgba(0,212,255,0.2))',
                    color: 'white',
                  }}
                >
                  {company?.name?.charAt(0) || job.title?.charAt(0)}
                </div>
                <div>
                  <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
                    {job.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                    <span>{company?.name}</span>
                    <span className="px-2 py-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      {job.location}
                    </span>
                    <span className="px-2 py-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      {job.type}
                    </span>
                    <span className="px-2 py-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      {job.salaryRange}
                    </span>
                    <span className="px-2 py-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      {job.applicantCount} applicants
                    </span>
                    <span className="px-2 py-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      Posted {postedLabel}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 lg:items-end">
                <Button
                  onClick={handleApply}
                  className="w-full lg:w-auto"
                  style={{ fontSize: '16px' }}
                >
                  Apply Now <ExternalLink size={16} />
                </Button>
                <Button
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleSave()
                  }}
                  className="w-full lg:w-auto"
                >
                  {saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />} {saved ? 'Saved' : 'Save Job'}
                </Button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-2xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <h3 className="font-semibold mb-4" style={{ color: 'var(--text)' }}>
                About the Company
              </h3>
              <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>
                {company?.description || 'No company description available.'}
              </p>
              {company?.website && (
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>🌐 Website</span>
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-accent hover:underline"
                  >
                    Visit
                  </a>
                </div>
              )}
              {company?.location && (
                <div className="flex items-center justify-between text-sm mb-2" style={{ color: 'var(--text-muted)' }}>
                  <span>📍 Location</span>
                  <span>{company.location}</span>
                </div>
              )}
              {company?.size && (
                <div className="flex items-center justify-between text-sm mb-2" style={{ color: 'var(--text-muted)' }}>
                  <span>👥 Company size</span>
                  <span>{company.size}</span>
                </div>
              )}
              {company?.founded && (
                <div className="flex items-center justify-between text-sm" style={{ color: 'var(--text-muted)' }}>
                  <span>📅 Founded</span>
                  <span>{new Date(company.founded).getFullYear()}</span>
                </div>
              )}
              {company?._id && (
                <button
                  onClick={() => navigate(`/jobs?company=${company._id}`)}
                  className="mt-4 text-sm font-medium text-accent hover:underline"
                >
                  View all jobs at {company.name}
                </button>
              )}
            </div>

            <div className="p-6 rounded-2xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <h3 className="font-semibold mb-4" style={{ color: 'var(--text)' }}>
                Job Highlights
              </h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full" style={{ background: 'rgba(76,205,196,0.1)', color: 'var(--accent)' }}>
                  ✅ {job.type}
                </span>
                <span className="px-3 py-1 rounded-full" style={{ background: 'rgba(108,99,255,0.1)', color: 'var(--secondary)' }}>
                  📍 {job.location}
                </span>
                <span className="px-3 py-1 rounded-full" style={{ background: 'rgba(255,193,7,0.1)', color: 'var(--warning)' }}>
                  💰 {job.salaryRange}
                </span>
                <span className="px-3 py-1 rounded-full" style={{ background: 'rgba(255,107,107,0.1)', color: 'var(--danger)' }}>
                  🔥 {job.applicantCount} applied
                </span>
              </div>
            </div>

            <div className="p-6 rounded-2xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <h3 className="font-semibold mb-4" style={{ color: 'var(--text)' }}>
                Similar Roles
              </h3>
              <SimilarJobsList sector={job.sector} currentJobId={job._id} />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <div className="p-6 rounded-2xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <h2 className="font-semibold text-lg mb-4" style={{ color: 'var(--text)' }}>
                About This Role
              </h2>
              <p className="leading-relaxed" style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                {job.description}
              </p>
            </div>

            <div className="p-6 rounded-2xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <h2 className="font-semibold text-lg mb-4" style={{ color: 'var(--text)' }}>
                Required Skills ({matchedSkills.total})
              </h2>
              <div className="grid md:grid-cols-2 gap-3 mb-4">
                {matchedSkills.items.map((skill) => (
                  <SkillRow key={skill.name} {...skill} />
                ))}
              </div>
              <div className="mb-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                You match {matchedSkills.matched} of {matchedSkills.total} required skills
              </div>
              <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${matchPercent}%`,
                    background: 'linear-gradient(135deg, var(--accent), var(--secondary))',
                    transition: 'width 0.5s ease',
                  }}
                />
              </div>
            </div>

            <div className="p-6 rounded-2xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <h2 className="font-semibold text-lg mb-4" style={{ color: 'var(--text)' }}>
                What You'll Be Doing
              </h2>
              <ul className="list-disc list-inside space-y-2" style={{ color: 'var(--text-secondary)' }}>
                {generateResponsibilities(job.description).map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Mobile sticky bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[var(--background)] border-t border-white/10 backdrop-blur py-3 px-4 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
              {job.title}
            </div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {company?.name}
            </div>
          </div>
          <Button onClick={handleApply} className="px-4 py-2">
            Apply Now →
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}

function SimilarJobsList({ sector, currentJobId }) {
  const [jobs, setJobs] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchSimilar = async () => {
      try {
        const res = await api.get(`/jobs?sector=${sector}&limit=3&exclude=${currentJobId}`)
        setJobs(res.data?.data?.jobs || [])
      } catch (err) {
        console.error('Error fetching similar jobs:', err)
      }
    }

    if (sector) fetchSimilar()
  }, [sector, currentJobId])

  if (!jobs.length) {
    return <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No similar roles found.</p>
  }

  return (
    <div className="space-y-3">
      {jobs.map((job) => (
        <button
          key={job._id}
          onClick={() => navigate(`/jobs/detail/${job._id}`)}
          className="w-full text-left p-3 rounded-xl transition hover:bg-[rgba(255,255,255,0.04)]"
          style={{ border: '1px solid var(--border)' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                {job.title}
              </div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {job.company?.name || job.company || ''}
              </div>
            </div>
            <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(108,99,255,0.1)' }}>
              {(job.company?.name || job.company || 'J').charAt(0)}
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}

function generateResponsibilities(description) {
  if (!description) return []
  const bullets = description
    .split('.')
    .map((p) => p.trim())
    .filter(Boolean)
    .slice(0, 5)

  return bullets.map((item) => `${item}.`)
}
