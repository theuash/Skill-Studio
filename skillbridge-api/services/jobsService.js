// Mock job data with realistic tech positions
const generateMockJobs = () => {
  const companies = [
    { name: 'Google', color: '#4285F4' },
    { name: 'Meta', color: '#1877F2' },
    { name: 'Microsoft', color: '#00A4EF' },
    { name: 'Amazon', color: '#FF9900' },
    { name: 'Apple', color: '#A2AAAD' },
    { name: 'Netflix', color: '#E50914' },
    { name: 'Tesla', color: '#E82127' },
    { name: 'Nvidia', color: '#76B900' },
    { name: 'OpenAI', color: '#00D9FF' },
    { name: 'Stripe', color: '#635BFF' },
  ]

  const positions = [
    { title: 'Senior Full Stack Developer', type: 'Full-time', level: 'Senior Level' },
    { title: 'React Developer', type: 'Full-time', level: 'Mid Level' },
    { title: 'Backend Engineer', type: 'Full-time', level: 'Mid Level' },
    { title: 'DevOps Engineer', type: 'Full-time', level: 'Senior Level' },
    { title: 'Machine Learning Engineer', type: 'Full-time', level: 'Senior Level' },
    { title: 'Frontend Developer', type: 'Full-time', level: 'Entry Level' },
    { title: 'Data Scientist', type: 'Full-time', level: 'Mid Level' },
    { title: 'Cloud Architect', type: 'Full-time', level: 'Senior Level' },
    { title: 'QA Engineer', type: 'Full-time', level: 'Entry Level' },
    { title: 'Product Manager', type: 'Full-time', level: 'Mid Level' },
  ]

  const locations = [
    'San Francisco, CA',
    'New York, NY',
    'Seattle, WA',
    'Austin, TX',
    'Remote',
    'Los Angeles, CA',
    'Boston, MA',
    'Mountain View, CA',
    'London, UK',
    'Berlin, Germany',
  ]

  const salaries = ['80k-120k', '100k-150k', '120k-200k', '150k-250k', '80k-100k']

  const skillsPool = [
    'JavaScript',
    'TypeScript',
    'React',
    'Vue.js',
    'Node.js',
    'Python',
    'Java',
    'Go',
    'Rust',
    'PostgreSQL',
    'MongoDB',
    'Docker',
    'Kubernetes',
    'AWS',
    'GCP',
    'Azure',
    'Git',
    'GraphQL',
    'REST APIs',
    'Microservices',
    'CI/CD',
    'Machine Learning',
    'TensorFlow',
    'PyTorch',
  ]

  const jobs = []
  let id = 1

  for (let i = 0; i < 30; i++) {
    const company = companies[Math.floor(Math.random() * companies.length)]
    const position = positions[Math.floor(Math.random() * positions.length)]
    const location = locations[Math.floor(Math.random() * locations.length)]
    const salary = salaries[Math.floor(Math.random() * salaries.length)]

    // Random skills selection (4-8 skills)
    const numSkills = Math.floor(Math.random() * 5) + 4
    const requiredSkills = []
    const skillsCopy = [...skillsPool]
    for (let j = 0; j < numSkills; j++) {
      const idx = Math.floor(Math.random() * skillsCopy.length)
      requiredSkills.push({
        skill: skillsCopy[idx],
        level: ['Beginner', 'Intermediate', 'Advanced'][Math.floor(Math.random() * 3)],
      })
      skillsCopy.splice(idx, 1)
    }

    const postedDaysAgo = Math.floor(Math.random() * 30)
    const postedAt = new Date()
    postedAt.setDate(postedAt.getDate() - postedDaysAgo)

    jobs.push({
      _id: String(id++),
      id: String(id - 1),
      title: position.title,
      description: `We are looking for a talented ${position.title} to join our growing team. You will work on cutting-edge technologies and have the opportunity to impact millions of users worldwide. This is a great opportunity to grow your skills and advance your career.`,
      company: {
        name: company.name,
        website: `https://${company.name.toLowerCase()}.com/careers`,
        logo: `https://logo.clearbit.com/${company.name.toLowerCase()}.com`,
        size: '10k-50k employees',
        description: `${company.name} is a technology company specializing in innovative solutions.`,
      },
      companyUrl: `https://${company.name.toLowerCase()}.com/careers`,
      location,
      type: position.type,
      salary: salary,
      salaryRange: salary,
      experienceLevel: position.level,
      postedAt: postedAt.toISOString(),
      createdAt: postedAt.toISOString(),
      requiredSkills: requiredSkills,
      tags: requiredSkills.slice(0, 3).map((s) => s.skill),
      applicantCount: Math.floor(Math.random() * 100) + 10,
      isActive: true,
    })
  }

  return jobs
}

// Store mock jobs in memory
let mockJobsCache = null

const getJobsFromMock = (filters = {}) => {
  if (!mockJobsCache) {
    mockJobsCache = generateMockJobs()
  }

  let filtered = [...mockJobsCache]

  // Apply filters
  if (filters.search) {
    const search = filters.search.toLowerCase()
    filtered = filtered.filter(
      (j) =>
        j.title.toLowerCase().includes(search) ||
        j.company.name.toLowerCase().includes(search) ||
        j.location.toLowerCase().includes(search)
    )
  }

  if (filters.type) {
    const types = filters.type.split(',')
    filtered = filtered.filter((j) => types.includes(j.type))
  }

  if (filters.experienceLevel) {
    const levels = filters.experienceLevel.split(',')
    filtered = filtered.filter((j) => levels.includes(j.experienceLevel))
  }

  if (filters.location) {
    filtered = filtered.filter((j) => j.location.toLowerCase().includes(filters.location.toLowerCase()))
  }

  if (filters.exclude) {
    filtered = filtered.filter((j) => j._id !== filters.exclude)
  }

  return filtered
}

const getJobById = (jobId) => {
  if (!mockJobsCache) {
    mockJobsCache = generateMockJobs()
  }
  return mockJobsCache.find((j) => j._id === jobId || j.id === jobId)
}

module.exports = {
  getJobsFromMock,
  getJobById,
  generateMockJobs,
}
