import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, Clock, DollarSign, Users, ExternalLink, Bookmark } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import api from '../api/axios'

const JobDetailPage = () => {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true)
        setError(null)
        console.log('Fetching job:', jobId)
        const res = await api.get(`/jobs/${jobId}`)
        console.log('Job response:', res.data)
        const jobData = res.data?.data || res.data
        if (!jobData) throw new Error('No job data returned')
        setJob(jobData)
      } catch (err) {
        console.error('Job fetch error:', err)
        setError(err?.response?.data?.error || err.message || 'Failed to load job')
      } finally {
        setLoading(false)
      }
    }
    if (jobId) fetchJob()
  }, [jobId])

  // LOADING STATE
  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ padding: '2rem' }}>
          <div style={{
            height: 200, borderRadius: 16,
            background: 'var(--surface)',
            animation: 'pulse 1.5s infinite'
          }} />
          <div style={{
            height: 400, borderRadius: 16, marginTop: 16,
            background: 'var(--surface)',
            animation: 'pulse 1.5s infinite'
          }} />
        </div>
      </DashboardLayout>
    )
  }

  // ERROR STATE
  if (error || !job) {
    return (
      <DashboardLayout>
        <div style={{
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          minHeight: '60vh', gap: 16
        }}>
          <div style={{ fontSize: 48 }}>😕</div>
          <h2 style={{ color: 'var(--text)' }}>
            Job not found
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>
            {error || 'This position may no longer be available.'}
          </p>
          <button
            onClick={() => navigate('/jobs')}
            style={{
              background: 'linear-gradient(135deg, var(--accent), var(--secondary))',
              color: 'white', border: 'none',
              padding: '10px 24px', borderRadius: 999,
              cursor: 'pointer', fontSize: 14
            }}
          >
            Browse All Jobs
          </button>
        </div>
      </DashboardLayout>
    )
  }

  // SAFELY extract all fields with fallbacks
  const title = job.title || job.jobTitle || 'Job Title'
  const description = job.description || 'No description available.'
  const location = job.location || 'Location not specified'
  const type = job.type || job.employmentType || 'Full-time'
  const salary = job.salaryRange ||
    (job.salaryMin ? `$${job.salaryMin} - $${job.salaryMax}` : 'Not specified')
  const applicants = job.applicantCount || job.numApplicants || 0
  const skills = job.requiredSkills || job.skills || []
  const company = job.company || {}
  const companyName = company.name || job.companyName || 'Company'
  const companyInitial = companyName.charAt(0).toUpperCase()
  const website = company.website || job.applyUrl || null

  const postedDate = job.postedAt || job.createdAt
  const daysAgo = postedDate
    ? Math.floor((Date.now() - new Date(postedDate)) / 86400000)
    : null

  // TYPE BADGE COLOR
  const typeColor = {
    'Full-time': '#1DB97C',
    'Internship': '#6C4BFF',
    'Contract': '#F59E0B'
  }[type] || '#6C4BFF'

  // LEVEL BADGE COLOR
  const levelColor = (level) => ({
    'Beginner': '#1DB97C',
    'Intermediate': '#6C4BFF',
    'Advanced': '#EF4444'
  }[level] || '#6C4BFF')

  return (
    <DashboardLayout>
      <div style={{ padding: '1.5rem', maxWidth: 1100, margin: '0 auto' }}>

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'none', border: 'none',
            color: 'var(--text-muted)', cursor: 'pointer',
            fontSize: 14, marginBottom: 24,
            transition: 'color 0.2s'
          }}
          onMouseEnter={e => e.target.style.color = 'var(--text)'}
          onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
        >
          <ArrowLeft size={16} /> Back to Jobs
        </button>

        {/* HERO CARD */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 20, padding: '2rem',
          marginBottom: 24,
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'flex-start', flexWrap: 'wrap', gap: 24
        }}>
          {/* LEFT: Job info */}
          <div style={{ display: 'flex', gap: 20, flex: 1 }}>
            {/* Company logo */}
            <div style={{
              width: 64, height: 64, borderRadius: 16, flexShrink: 0,
              background: 'linear-gradient(135deg, var(--accent), var(--secondary))',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28, fontWeight: 700, color: 'white'
            }}>
              {companyInitial}
            </div>
            <div>
              <h1 style={{
                color: 'var(--text)',
                fontSize: 'clamp(20px, 3vw, 28px)',
                fontWeight: 800, margin: '0 0 4px'
              }}>
                {title}
              </h1>
              <p style={{
                color: 'var(--text-muted)',
                fontSize: 16, margin: '0 0 16px'
              }}>
                {companyName}
              </p>
              {/* Meta pills */}
              <div style={{
                display: 'flex', flexWrap: 'wrap', gap: 10
              }}>
                <span style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  color: 'var(--text-muted)', fontSize: 13
                }}>
                  <MapPin size={14} /> {location}
                </span>
                <span style={{
                  background: typeColor + '20',
                  color: typeColor, fontSize: 12,
                  padding: '3px 10px', borderRadius: 999,
                  fontWeight: 500
                }}>
                  {type}
                </span>
                <span style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  color: 'var(--text-muted)', fontSize: 13
                }}>
                  <DollarSign size={14} /> {salary}
                </span>
                <span style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  color: 'var(--text-muted)', fontSize: 13
                }}>
                  <Users size={14} /> {applicants} applicants
                </span>
                {daysAgo !== null && (
                  <span style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    color: 'var(--text-muted)', fontSize: 12
                  }}>
                    <Clock size={12} />
                    {daysAgo === 0 ? 'Today' :
                      daysAgo === 1 ? 'Yesterday' :
                        `${daysAgo} days ago`}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Action buttons */}
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 10
          }}>
            <button
              onClick={() => website
                ? window.open(website, '_blank', 'noopener')
                : alert('No career page available')}
              style={{
                background: 'linear-gradient(135deg, var(--accent), var(--secondary))',
                color: 'white', border: 'none',
                padding: '12px 28px', borderRadius: 999,
                cursor: 'pointer', fontSize: 15,
                fontWeight: 600, whiteSpace: 'nowrap',
                display: 'flex', alignItems: 'center', gap: 8,
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.05)'
                e.currentTarget.style.boxShadow =
                  '0 8px 24px rgba(108,75,255,0.4)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              Apply Now <ExternalLink size={16} />
            </button>
            <button style={{
              background: 'transparent',
              border: '1px solid var(--border)',
              color: 'var(--text-muted)',
              padding: '10px 28px', borderRadius: 999,
              cursor: 'pointer', fontSize: 14,
              display: 'flex', alignItems: 'center',
              gap: 8, justifyContent: 'center'
            }}>
              <Bookmark size={15} /> Save Job
            </button>
          </div>
        </div>

        {/* TWO COLUMN LAYOUT */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0,2fr) minmax(0,1fr)',
          gap: 20
        }}>

          {/* LEFT COLUMN */}
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 20
          }}>

            {/* About the Role */}
            <div style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 16, padding: '1.5rem'
            }}>
              <h2 style={{
                color: 'var(--text)',
                fontSize: 18, fontWeight: 700,
                borderLeft: '3px solid var(--accent)',
                paddingLeft: 12, margin: '0 0 16px'
              }}>
                About This Role
              </h2>
              <p style={{
                color: 'var(--text-muted)',
                lineHeight: 1.8, margin: 0, fontSize: 15
              }}>
                {description}
              </p>
            </div>

            {/* Required Skills */}
            <div style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 16, padding: '1.5rem'
            }}>
              <h2 style={{
                color: 'var(--text)',
                fontSize: 18, fontWeight: 700,
                borderLeft: '3px solid var(--accent)',
                paddingLeft: 12, margin: '0 0 16px'
              }}>
                Required Skills ({skills.length})
              </h2>
              {skills.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>
                  No specific skills listed.
                </p>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 10
                }}>
                  {skills.map((skill, i) => {
                    const skillName = skill.name || skill.skill || skill
                    const skillLevel = skill.level || 'Intermediate'
                    return (
                      <div key={i} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: 'var(--bg)',
                        border: '1px solid var(--border)',
                        borderRadius: 10, padding: '10px 14px'
                      }}>
                        <span style={{
                          color: 'var(--text)',
                          fontWeight: 500, fontSize: 14
                        }}>
                          {skillName}
                        </span>
                        <span style={{
                          background: levelColor(skillLevel) + '25',
                          color: levelColor(skillLevel),
                          fontSize: 11, padding: '2px 8px',
                          borderRadius: 999, fontWeight: 600
                        }}>
                          {skillLevel}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 16
          }}>

            {/* About the Company */}
            <div style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 16, padding: '1.5rem'
            }}>
              <h3 style={{
                color: 'var(--text)',
                fontSize: 16, fontWeight: 700, margin: '0 0 12px'
              }}>
                About the Company
              </h3>
              <p style={{
                color: 'var(--text-muted)',
                fontSize: 13, lineHeight: 1.7, margin: '0 0 12px'
              }}>
                {company.description || 'A leading company in the industry.'}
              </p>
              {[
                { icon: '🌐', label: 'Website', value: company.website,
                  link: company.website },
                { icon: '📍', label: 'Location', value: company.location },
                { icon: '🏢', label: 'Sector', value: company.sector }
              ].filter(item => item.value).map((item, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 8, marginBottom: 8,
                  alignItems: 'center'
                }}>
                  <span>{item.icon}</span>
                  <span style={{
                    color: 'var(--text-muted)', fontSize: 12
                  }}>
                    {item.label}:
                  </span>
                  {item.link ? (
                    <a href={item.link} target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: 'var(--accent)',
                        fontSize: 12, textDecoration: 'none'
                      }}>
                      Visit site ↗
                    </a>
                  ) : (
                    <span style={{
                      color: 'var(--text-muted)', fontSize: 12
                    }}>
                      {item.value}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Job Highlights */}
            <div style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 16, padding: '1.5rem'
            }}>
              <h3 style={{
                color: 'var(--text)',
                fontSize: 16, fontWeight: 700, margin: '0 0 12px'
              }}>
                Job Highlights
              </h3>
              {[
                { emoji: '💼', text: type },
                { emoji: '📍', text: location },
                { emoji: '💰', text: salary },
                { emoji: '👥', text: `${applicants} applicants` }
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center',
                  gap: 10, padding: '8px 0',
                  borderBottom: i < 3
                    ? '1px solid var(--border)' : 'none'
                }}>
                  <span style={{ fontSize: 16 }}>{item.emoji}</span>
                  <span style={{
                    color: 'var(--text-muted)', fontSize: 13
                  }}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default JobDetailPage
