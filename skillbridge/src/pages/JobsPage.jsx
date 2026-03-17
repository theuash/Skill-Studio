import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Clock, DollarSign, Bookmark, BookmarkCheck, Search, Filter, Briefcase, Users, TrendingUp } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import api from '../api/axios'
import toast from 'react-hot-toast'

const formatDaysAgo = (date) => {
  if (!date) return ''
  const posted = new Date(date)
  const diffMs = Date.now() - posted.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return '1 day ago'
  return `${diffDays} days ago`
}

const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship']
const EXPERIENCE_LEVELS = ['Entry Level', 'Mid Level', 'Senior Level', 'Executive']
const SALARY_RANGES = ['0-50k', '50k-100k', '100k-150k', '150k+']

function JobCardSkeleton() {
  return (
    <div className="p-6 rounded-xl animate-pulse" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-300 rounded-lg"></div>
          <div>
            <div className="w-32 h-4 bg-gray-300 rounded mb-2"></div>
            <div className="w-24 h-3 bg-gray-300 rounded"></div>
          </div>
        </div>
        <div className="w-6 h-6 bg-gray-300 rounded"></div>
      </div>
      <div className="w-3/4 h-5 bg-gray-300 rounded mb-2"></div>
      <div className="w-full h-4 bg-gray-300 rounded mb-1"></div>
      <div className="w-2/3 h-4 bg-gray-300 rounded mb-4"></div>
      <div className="flex flex-wrap gap-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="w-16 h-6 bg-gray-300 rounded"></div>
        ))}
      </div>
    </div>
  )
}

function JobCard({ job, onSave, savedJobs = [], onCardClick }) {
  const jobId = job._id || job.id
  const isSaved = savedJobs.includes(jobId)
  const companyName = (job.company && typeof job.company === 'object') ? job.company.name : job.company

  // Field mapping with fallbacks
  const title = job.title || job.jobTitle || 'Job Title Not Available'
  const location = job.location || job.jobLocation || 'Location TBD'
  const jobType = job.type || job.employmentType || job.jobType || 'Type Not Specified'
  const salary = job.salaryRange || job.salary || 'Salary Not Listed'
  const description = job.description || job.jobDescription || 'No description available'
  const postedAt = job.postedAt || job.createdAt
  const applicantCount = job.applicantCount || job.applicants || 0
  const tags = job.tags || []

  const formatPostedDate = (dateStr) => {
    if (!dateStr) return 'Recently posted'
    const diff = Date.now() - new Date(dateStr).getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    if (days === 0) return 'Posted today'
    if (days === 1) return 'Posted yesterday'
    return `Posted ${days} days ago`
  }

  const postedLabel = formatPostedDate(postedAt)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-xl cursor-pointer transition-all group hover:-translate-y-1"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
      }}
      onClick={onCardClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg"
            style={{ background: 'linear-gradient(135deg, var(--accent), rgba(0,212,255,0.7))' }}
          >
            {companyName?.charAt(0) || ''}
          </div>
          <div>
            <h3 className="font-semibold text-lg" style={{ color: 'var(--text)' }}>
              {title}
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {companyName}
            </p>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onSave(jobId)
          }}
          className="p-2 rounded-lg transition-colors"
          style={{ color: isSaved ? 'var(--accent)' : 'var(--text-muted)' }}
        >
          {isSaved ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
        </button>
      </div>

      {/* Description */}
      <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>
        {description}
      </p>

      {/* Job Details */}
      <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
        <div className="flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
          <MapPin size={14} />
          {location}
        </div>
        <div className="flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
          <Clock size={14} />
          {jobType}
        </div>
        {salary && salary !== 'Salary Not Listed' && (
          <div className="flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
            <DollarSign size={14} />
            {salary}
          </div>
        )}
        <div className="flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
          <Users size={14} />
          {applicantCount} applicants
        </div>
        <div className="flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
          <Clock size={14} />
          {postedLabel}
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1">
        {tags.map((tag, j) => (
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
}

export default function JobsPage() {
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([])
  const [filteredJobs, setFilteredJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [savedJobs, setSavedJobs] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilters, setSelectedFilters] = useState({
    type: [],
    experience: [],
    salary: [],
    location: ''
  })
  const [showFilters, setShowFilters] = useState(false)

  const fetchJobs = async () => {
    try {
      const res = await api.get('/jobs')
      console.log('Jobs API response:', res.data)
      console.log('Jobs array:', res.data?.data?.jobs)
      const jobs = res.data?.data?.jobs || res.data?.jobs || res.data || []
      setJobs(jobs)
      setFilteredJobs(jobs)
    } catch (err) {
      toast.error('Failed to load jobs. Please try again.')
      console.error('Jobs fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchSavedJobs = async () => {
    try {
      const res = await api.get('/jobs/saved')
      setSavedJobs(res.data.savedJobs || [])
    } catch (err) {
      console.error('Saved jobs fetch error:', err)
    }
  }

  const handleSaveJob = async (jobId) => {
    try {
      if (savedJobs.includes(jobId)) {
        await api.delete(`/jobs/saved/${jobId}`)
        setSavedJobs(prev => prev.filter(id => id !== jobId))
        toast.success('Job removed from saved jobs')
      } else {
        await api.post(`/jobs/saved/${jobId}`)
        setSavedJobs(prev => [...prev, jobId])
        toast.success('Job saved successfully')
      }
    } catch (err) {
      toast.error('Failed to save job. Please try again.')
      console.error('Save job error:', err)
    }
  }

  const applyFilters = () => {
    let filtered = jobs

    // Search query
    if (searchQuery) {
      filtered = filtered.filter((job) => {
        const companyName = job.company && typeof job.company === 'object' ? job.company.name : job.company || ''
        return (
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })
    }

    // Job type filter
    if (selectedFilters.type.length > 0) {
      filtered = filtered.filter(job => selectedFilters.type.includes(job.type))
    }

    // Experience level filter
    if (selectedFilters.experience.length > 0) {
      filtered = filtered.filter(job => selectedFilters.experience.includes(job.experienceLevel))
    }

    // Salary range filter
    if (selectedFilters.salary.length > 0) {
      filtered = filtered.filter(job => {
        const salaryRange = getSalaryRange(job.salary)
        return selectedFilters.salary.includes(salaryRange)
      })
    }

    // Location filter
    if (selectedFilters.location) {
      filtered = filtered.filter(job =>
        job.location.toLowerCase().includes(selectedFilters.location.toLowerCase())
      )
    }

    setFilteredJobs(filtered)
  }

  const getSalaryRange = (salary) => {
    if (!salary) return null
    const numSalary = parseInt(salary.replace(/[^0-9]/g, ''))
    if (numSalary < 50000) return '0-50k'
    if (numSalary < 100000) return '50k-100k'
    if (numSalary < 150000) return '100k-150k'
    return '150k+'
  }

  const toggleFilter = (category, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }))
  }

  useEffect(() => {
    fetchJobs()
    fetchSavedJobs()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [jobs, searchQuery, selectedFilters])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6 lg:p-8 max-w-7xl">
          <div className="grid lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => <JobCardSkeleton key={i} />)}
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
              Job Board
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Discover opportunities that match your skills
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs px-3 py-1 rounded-full" style={{ background: 'rgba(76,205,196,0.1)', color: '#4ECDC4' }}>
              {filteredJobs.length} jobs found
            </span>
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="secondary"
              size="sm"
            >
              <Filter size={14} />
              Filters
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <Input
                placeholder="Search jobs, companies, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search size={16} />}
              />
            </div>
          </div>

          {/* Advanced Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 rounded-xl mb-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Job Type */}
                    <div>
                      <h4 className="font-medium mb-3" style={{ color: 'var(--text)' }}>Job Type</h4>
                      <div className="space-y-2">
                        {JOB_TYPES.map(type => (
                          <label key={type} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedFilters.type.includes(type)}
                              onChange={() => toggleFilter('type', type)}
                              className="rounded"
                            />
                            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{type}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Experience Level */}
                    <div>
                      <h4 className="font-medium mb-3" style={{ color: 'var(--text)' }}>Experience Level</h4>
                      <div className="space-y-2">
                        {EXPERIENCE_LEVELS.map(level => (
                          <label key={level} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedFilters.experience.includes(level)}
                              onChange={() => toggleFilter('experience', level)}
                              className="rounded"
                            />
                            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{level}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Salary Range */}
                    <div>
                      <h4 className="font-medium mb-3" style={{ color: 'var(--text)' }}>Salary Range</h4>
                      <div className="space-y-2">
                        {SALARY_RANGES.map(range => (
                          <label key={range} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedFilters.salary.includes(range)}
                              onChange={() => toggleFilter('salary', range)}
                              className="rounded"
                            />
                            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{range}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Location */}
                    <div>
                      <h4 className="font-medium mb-3" style={{ color: 'var(--text)' }}>Location</h4>
                      <Input
                        placeholder="City, State, or Remote"
                        value={selectedFilters.location}
                        onChange={(e) => setSelectedFilters(prev => ({ ...prev, location: e.target.value }))}
                        size="sm"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Jobs Grid */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredJobs.map((job, i) => (
              <motion.div
                key={job._id || job.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.05 }}
              >
                <JobCard
                  job={job}
                  onSave={handleSaveJob}
                  savedJobs={savedJobs}
                  onCardClick={() => {
                    console.log('Navigating to job ID:', job._id || job.id)
                    navigate(`/jobs/detail/${job._id || job.id}`)
                  }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredJobs.length === 0 && !loading && (
          <div className="text-center py-12">
            <Briefcase size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 16px' }} />
            <h3 className="font-semibold text-lg mb-2" style={{ color: 'var(--text)' }}>
              No jobs found
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Try adjusting your search criteria or filters
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}