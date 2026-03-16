import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, MapPin, ExternalLink, FileText, GitBranch, X } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import Button from '../components/ui/Button'
import toast from 'react-hot-toast'
import api from '../api/axios'
import { COMPANIES } from '../utils/data'
import ProjectsPanel from '../components/projects/ProjectsPanel'

const LEVEL_COLORS = {
  Beginner: { bg: 'rgba(76,205,196,0.15)', text: '#4ECDC4', border: 'rgba(76,205,196,0.3)' },
  Intermediate: { bg: 'rgba(108,99,255,0.15)', text: '#6C63FF', border: 'rgba(108,99,255,0.3)' },
  Advanced: { bg: 'rgba(255,107,107,0.15)', text: '#FF6B6B', border: 'rgba(255,107,107,0.3)' },
}

const SKILL_LEVELS = {
  'React': 'Intermediate', 'TypeScript': 'Intermediate', 'Python': 'Beginner',
  'Go': 'Advanced', 'Kubernetes': 'Advanced', 'Docker': 'Intermediate',
  'SQL': 'Beginner', 'Machine Learning': 'Advanced', 'Node.js': 'Intermediate',
  'Java': 'Intermediate', 'Rust': 'Advanced', 'C++': 'Advanced',
  'GraphQL': 'Intermediate', 'Solidity': 'Advanced', 'Swift': 'Intermediate',
  'Kotlin': 'Intermediate', 'Flutter': 'Intermediate', 'CSS': 'Beginner',
  'Ruby': 'Intermediate', 'Hack/PHP': 'Intermediate', 'Relay': 'Intermediate',
  'Jest': 'Intermediate', 'Webpack': 'Intermediate', 'Chaos Engineering': 'Advanced',
  'Hystrix': 'Advanced', 'Zuul': 'Intermediate', 'MySQL': 'Beginner',
  'Redis': 'Intermediate', 'Ruby on Rails': 'Intermediate', 'Kafka': 'Intermediate',
  'Airflow': 'Intermediate', 'Druid': 'Advanced', 'Elasticsearch': 'Intermediate',
  'Next.js': 'Intermediate', 'Edge Functions': 'Advanced', 'CDN': 'Intermediate',
  'WebAssembly': 'Advanced', 'AWS': 'Intermediate', 'Terraform': 'Intermediate',
  'CDK': 'Intermediate', 'Distributed Systems': 'Advanced', 'Spark': 'Advanced',
  'Delta Lake': 'Advanced', 'MLflow': 'Advanced', 'Scala': 'Advanced',
  'dbt': 'Intermediate', 'Data Modeling': 'Intermediate', 'Streamlit': 'Intermediate',
  'Foundry': 'Advanced', 'R': 'Intermediate', 'Statistics': 'Intermediate',
  'Data Visualization': 'Intermediate', 'ETL': 'Intermediate', 'Alteryx': 'Beginner',
  'Jinja': 'Intermediate', 'Git': 'Beginner', 'PyTorch': 'Advanced',
  'CUDA': 'Advanced', 'Transformers': 'Advanced', 'RLHF': 'Advanced',
  'Distributed Training': 'Advanced', 'JAX': 'Advanced', 'Constitutional AI': 'Advanced',
  'TensorFlow': 'Advanced', 'Reinforcement Learning': 'Advanced', 'Graph Networks': 'Advanced',
  'Diffusers': 'Advanced', 'Datasets': 'Intermediate', 'Gradio': 'Intermediate',
  'ML Pipelines': 'Advanced', 'LLM Fine-tuning': 'Advanced', 'Data Annotation': 'Intermediate',
  'NLP': 'Advanced', 'RAG': 'Advanced', 'Embeddings': 'Advanced',
  'Mixture of Experts': 'Advanced', 'Quantization': 'Advanced', 'Inference': 'Intermediate',
  'Decentralized Systems': 'Advanced', 'Video AI': 'Advanced', 'WebGL': 'Intermediate',
  'CLIP': 'Advanced', 'LoRA': 'Advanced', 'ComfyUI': 'Intermediate',
  'Vault': 'Advanced', 'Consul': 'Advanced', 'Nomad': 'Advanced',
  'HCL': 'Intermediate', 'APM': 'Advanced', 'Metrics': 'Intermediate',
  'Log Management': 'Intermediate', 'Prometheus': 'Advanced', 'Loki': 'Advanced',
  'Tempo': 'Advanced', 'Vue.js': 'Intermediate', 'CI/CD': 'Intermediate',
  'PostgreSQL': 'Intermediate', 'Incident Management': 'Intermediate', 'NRQL': 'Intermediate',
  'OpenTelemetry': 'Intermediate', 'Shell Scripting': 'Beginner', 'YAML': 'Beginner',
  'C#': 'Intermediate', 'Geospatial': 'Advanced', 'Real-time Systems': 'Advanced',
  'Maps SDK': 'Intermediate', 'Audio Engineering': 'Advanced', 'Crossplatform': 'Advanced',
  'WebRTC': 'Advanced', 'Motion Design': 'Intermediate', 'Components': 'Intermediate',
  'CMS': 'Intermediate', 'Heatmaps': 'Intermediate', 'Surveys': 'Beginner',
  'A/B Testing': 'Intermediate', 'UX Research': 'Intermediate', 'Usability Testing': 'Intermediate',
  'Service Design': 'Intermediate', 'Diagramming': 'Beginner', 'User Journey': 'Intermediate',
  'Workshop': 'Intermediate', 'Agile': 'Intermediate', 'Figma': 'Beginner',
  'Prototyping': 'Beginner', 'Design Systems': 'Intermediate', 'Auto Layout': 'Intermediate',
  'Variables': 'Beginner', 'Plugins': 'Intermediate', 'Photoshop': 'Beginner',
  'Illustrator': 'Beginner', 'XD': 'Beginner', 'After Effects': 'Intermediate',
  'InDesign': 'Beginner', 'Premiere': 'Intermediate', 'InVision': 'Beginner',
  'Wireframing': 'Beginner', 'Handoff': 'Beginner', 'DSM': 'Intermediate',
  'Sketch': 'Beginner', 'Symbols': 'Beginner', 'Libraries': 'Intermediate',
  'Miro': 'Beginner', 'Maze': 'Beginner', 'Lottiefiles': 'Intermediate',
  'JSON Animation': 'Intermediate', 'Bodymovin': 'Intermediate', 'SVG': 'Intermediate',
  'Canva': 'Beginner', 'Graphic Design': 'Beginner', 'Typography': 'Intermediate',
  'Brand Design': 'Intermediate', 'Templates': 'Beginner', 'Illustration': 'Intermediate',
  'Video': 'Intermediate', 'Zeplin': 'Beginner', 'Style Guides': 'Beginner',
  'Component Specs': 'Beginner', 'Assets': 'Beginner', 'Tokens': 'Beginner',
  'Developer Notes': 'Beginner', 'Smart Contracts': 'Advanced', 'Security': 'Advanced',
  'OAuth2': 'Intermediate', 'SAML': 'Intermediate', 'OIDC': 'Intermediate',
  'Zero Trust': 'Advanced', 'Kernel Development': 'Advanced', 'Threat Intelligence': 'Advanced',
  'Network Security': 'Advanced', 'NGFW': 'Advanced', 'SIEM': 'Advanced',
  'EDR': 'Advanced', 'Threat Hunting': 'Advanced', 'SAST': 'Advanced',
  'Vulnerability DB': 'Intermediate', 'DevSecOps': 'Intermediate', 'CSPM': 'Advanced',
  'Cloud Security': 'Advanced', 'eBPF': 'Advanced', 'Graph DB': 'Advanced',
  'NessusVulnerability Management': 'Intermediate', 'Network Scanning': 'Intermediate',
  'CVSS': 'Beginner', 'Metasploit': 'Advanced', 'Penetration Testing': 'Advanced',
  'Unsupervised ML': 'Advanced', 'Network Forensics': 'Advanced', 'Bayesian AI': 'Advanced',
  'Web3.js': 'Intermediate', 'MetaMask': 'Beginner', 'Ethereum': 'Intermediate',
  'Uniswap v4': 'Advanced', 'DeFi': 'Advanced', 'Liquidity Pools': 'Intermediate',
  'Ethereum APIs': 'Intermediate', 'NFT APIs': 'Intermediate', 'Account Abstraction': 'Intermediate',
  'NFT Standards': 'Intermediate', 'IPFS': 'Intermediate', 'ZK Proofs': 'Advanced',
  'EVM': 'Advanced', 'Consensus Mechanisms': 'Advanced', 'NEAR SDK': 'Intermediate',
  'Anchor': 'Intermediate', 'Solana Program Library': 'Intermediate', 'Flash Loans': 'Advanced',
  'Governance': 'Intermediate', 'Risk Analysis': 'Intermediate', 'Blueprints': 'Beginner',
  'Unreal Engine': 'Intermediate', 'Shaders': 'Advanced', 'Animation': 'Intermediate',
  'Multiplayer': 'Advanced', 'Netcode': 'Advanced', 'Anti-Cheat': 'Advanced',
  'Rendering': 'Advanced', 'Cocos2d': 'Beginner', 'Monetization': 'Intermediate',
  'Analytics': 'Beginner', 'Lua': 'Beginner', 'Roblox Studio': 'Beginner',
  'Physics': 'Intermediate', 'Platform Engineering': 'Advanced', 'Source Engine': 'Beginner',
  'Vulkan': 'Advanced', 'OpenGL': 'Advanced', 'AnvilNext': 'Beginner',
  'AI Behavior': 'Advanced', 'SSD Streaming': 'Advanced', 'HLSL': 'Advanced',
  'GDScript': 'Beginner', 'Godot Engine': 'Beginner', '2D/3D Rendering': 'Intermediate',
  'Assembly': 'Advanced', 'TI RTOS': 'Advanced', 'DSP': 'Advanced',
  'Microcontrollers': 'Intermediate', 'RISC-V': 'Advanced', 'SoC Design': 'Advanced',
  'CMSIS': 'Intermediate', 'Embedded Linux': 'Intermediate', 'ESP-IDF': 'Intermediate',
  'FreeRTOS': 'Intermediate', 'WiFi/BLE': 'Intermediate', 'MQTT': 'Intermediate',
  'Zephyr RTOS': 'Intermediate', 'BLE': 'Intermediate', 'Thread': 'Intermediate',
  'nRF SDK': 'Intermediate', 'Low Power': 'Intermediate', 'STM32CubeIDE': 'Intermediate',
  'HAL': 'Intermediate', 'RTOS': 'Intermediate', 'Motor Control': 'Intermediate',
  'GPIO': 'Beginner', 'Yocto': 'Advanced', 'Arduino IDE': 'Beginner',
  'Sensors': 'Beginner', 'Actuators': 'Beginner', 'IoT': 'Intermediate',
  'Prototyping': 'Beginner', 'TensorRT': 'Advanced', 'ROS': 'Intermediate',
  'Computer Vision': 'Advanced', 'Camera Algorithms': 'Advanced', 'Modem Firmware': 'Advanced',
  'AUTOSAR': 'Advanced', 'CAN/LIN': 'Advanced', 'Functional Safety': 'Advanced',
}

function getLevel(skill) {
  return SKILL_LEVELS[skill] || 'Intermediate'
}

// Company locations mapping
const COMPANY_LOCATIONS = {
  'google': 'Mountain View, CA, USA',
  'meta': 'Menlo Park, CA, USA',
  'netflix': 'Los Gatos, CA, USA',
  'stripe': 'San Francisco, CA, USA',
  'shopify': 'Ottawa, Canada',
  'airbnb': 'San Francisco, CA, USA',
  'github': 'San Francisco, CA, USA',
  'vercel': 'San Francisco, CA, USA',
  'atlassian': 'Sydney, Australia',
  'twilio': 'San Francisco, CA, USA',
  'databricks': 'San Francisco, CA, USA',
  'snowflake': 'San Mateo, CA, USA',
  'palantir': 'Denver, CO, USA',
  'tableau': 'Seattle, WA, USA',
  'alteryx': 'Irvine, CA, USA',
  'dbt-labs': 'Philadelphia, PA, USA',
  'fivetran': 'Denver, CO, USA',
  'looker': 'Santa Cruz, CA, USA',
  'amplitude': 'San Francisco, CA, USA',
  'segment': 'San Francisco, CA, USA',
  'openai': 'San Francisco, CA, USA',
  'anthropic': 'San Francisco, CA, USA',
  'deepmind': 'London, UK',
  'hugging-face': 'New York, NY, USA',
  'scale-ai': 'San Francisco, CA, USA',
  'cohere': 'Toronto, Canada',
  'mistral': 'Paris, France',
  'together-ai': 'San Francisco, CA, USA',
  'runway': 'New York, NY, USA',
  'stability-ai': 'London, UK',
  'aws': 'Seattle, WA, USA',
  'hashicorp': 'San Francisco, CA, USA',
  'datadog': 'New York, NY, USA',
  'cloudflare': 'San Francisco, CA, USA',
  'grafana': 'San Francisco, CA, USA',
  'gitlab': 'San Francisco, CA, USA',
  'pagerduty': 'San Francisco, CA, USA',
  'new-relic': 'San Francisco, CA, USA',
  'circleci': 'San Francisco, CA, USA',
  'pulumi': 'Seattle, WA, USA',
  'uber': 'San Francisco, CA, USA',
  'lyft': 'San Francisco, CA, USA',
  'spotify': 'Stockholm, Sweden',
  'discord': 'San Francisco, CA, USA',
  'duolingo': 'Pittsburgh, PA, USA',
  'robinhood': 'Menlo Park, CA, USA',
  'doordash': 'San Francisco, CA, USA',
  'figma': 'San Francisco, CA, USA',
  'notion': 'San Francisco, CA, USA',
  'linear': 'San Francisco, CA, USA',
  'crowdstrike': 'Sunnyvale, CA, USA',
  'palo-alto': 'Santa Clara, CA, USA',
  'sentinelone': 'New York, NY, USA',
  'okta': 'San Francisco, CA, USA',
  'wiz': 'New York, NY, USA',
  'snyk': 'Boston, MA, USA',
  'lacework': 'Cupertino, CA, USA',
  'tenable': 'Columbia, MD, USA',
  'rapid7': 'Boston, MA, USA',
  'darktrace': 'Cambridge, UK',
  'figma-design': 'San Francisco, CA, USA',
  'adobe': 'San Jose, CA, USA',
  'invision': 'New York, NY, USA',
  'sketch': 'Amsterdam, Netherlands',
  'miro': 'San Francisco, CA, USA',
  'framer': 'Amsterdam, Netherlands',
  'maze': 'San Francisco, CA, USA',
  'lottiefiles': 'San Francisco, CA, USA',
  'canva': 'Sydney, Australia',
  'zeplin': 'Istanbul, Turkey',
  'coinbase': 'San Francisco, CA, USA',
  'consensys': 'New York, NY, USA',
  'chainlink': 'San Francisco, CA, USA',
  'uniswap': 'New York, NY, USA',
  'alchemy': 'San Francisco, CA, USA',
  'opensea': 'New York, NY, USA',
  'polygon': 'Singapore',
  'near': 'San Francisco, CA, USA',
  'solana': 'San Francisco, CA, USA',
  'aave': 'Geneva, Switzerland',
  'unity': 'San Francisco, CA, USA',
  'epic-games': 'Cary, NC, USA',
  'riot-games': 'Los Angeles, CA, USA',
  'supercell': 'Helsinki, Finland',
  'roblox': 'San Mateo, CA, USA',
  'valve': 'Bellevue, WA, USA',
  'id-software': 'Mesquite, TX, USA',
  'ubisoft': 'Montreal, Canada',
  'insomniac': 'Burbank, CA, USA',
  'godot': 'Remote-First',
  'texas-instruments': 'Dallas, TX, USA',
  'arm': 'Cambridge, UK',
  'espressif': 'Shanghai, China',
  'nordic-semi': 'Trondheim, Norway',
  'stmicro': 'Geneva, Switzerland',
  'raspberry-pi': 'Cambridge, UK',
  'arduino': 'Ivrea, Italy',
  'nvidia-jetson': 'Santa Clara, CA, USA',
  'qualcomm': 'San Diego, CA, USA',
  'bosch': 'Stuttgart, Germany',
}

export default function CompanyDetailsPage() {
  const { companyId, sectorId } = useParams()
  const navigate = useNavigate()
  const [company, setCompany] = useState(null)
  const [loading, setLoading] = useState(true)

  // Projects modal state
  const [isProjectOpen, setIsProjectOpen] = useState(false)

  useEffect(() => {
    const fetchCompany = async () => {
      setLoading(true)
      try {
        const res = await api.get(`/sectors/companies/${companyId}`)
        const companyData = res.data?.data?.company
        if (companyData) {
          setCompany({
            ...companyData,
            skills: companyData.requiredSkills?.map((s) => s.skill) || [],
          })
          return
        }
        throw new Error('No company data returned')
      } catch (err) {
        // Fallback to local list if API is unavailable
        const normalized = String(companyId).toLowerCase()
        const allCompanies = Object.values(COMPANIES).flat()
        const fallback = allCompanies.find((c) => {
          const id = (c.companyId || c.id || '').toLowerCase()
          return id === normalized || id.startsWith(normalized)
        })

        if (fallback) {
          setCompany({
            ...fallback,
            skills: fallback.skills || [],
            companyId: fallback.companyId || fallback.id,
          })
          toast.success('Loaded company from local cache')
        } else {
          toast.error(err?.response?.data?.message || 'Company not found.')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchCompany()
  }, [companyId])

  const handleOpenProjects = () => {
    setIsProjectOpen(true)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6 lg:p-8 flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: 'var(--accent)' }}></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!company) {
    return (
      <DashboardLayout>
        <div className="p-6 lg:p-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm mb-6 transition-colors"
            style={{ color: 'var(--text-muted)' }}
          >
            <ArrowLeft size={16} />
            Go Back
          </button>
          <div className="text-center">
            <h2 style={{ color: 'var(--text)' }}>Company not found</h2>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const location = COMPANY_LOCATIONS[companyId] || COMPANY_LOCATIONS[companyId?.split?.('-')?.[0]] || 'Global'

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm mb-6 transition-colors"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <div className="flex items-start gap-6 mb-8">
            {/* Company Logo */}
            <div
              className="w-24 h-24 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(108,99,255,0.08)', border: '1px solid var(--border)' }}
            >
              <img
                src={`https://logo.clearbit.com/${company.domain}`}
                alt={company.name}
                className="w-16 h-16 object-contain"
                onError={e => {
                  e.target.style.display = 'none'
                  e.target.parentElement.innerHTML = `<span style="font-size:2rem">${company.name[0]}</span>`
                }}
              />
            </div>

            {/* Company Info */}
            <div className="flex-1">
              <h1 className="font-heading font-extrabold text-4xl mb-2" style={{ color: 'var(--text)' }}>
                {company.name}
              </h1>
              <p className="text-lg mb-3" style={{ color: 'var(--text-muted)' }}>
                {company.tagline}
              </p>

              {/* Location Badge */}
              <div className="flex items-center gap-2">
                <div
                  className="px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm font-medium"
                  style={{ background: 'rgba(108,99,255,0.1)', color: 'var(--accent)' }}
                >
                  <MapPin size={16} />
                  {location}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* About Company Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
        >
          {/* About Card */}
          <div
            className="lg:col-span-2 rounded-2xl p-6"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            <h2 className="font-heading font-bold text-xl mb-4" style={{ color: 'var(--text)' }}>
              About the Company
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
              {company.tagline} — {company.name} is a leading technology company known for excellence in innovation. 
              Join our team to work on cutting-edge projects and grow your skills with industry experts. 
              We're committed to creating amazing products and fostering a collaborative engineering culture.
            </p>
            <a
              href={`https://${company.domain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-sm font-medium transition-colors"
              style={{ color: 'var(--accent)' }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              Visit Website <ExternalLink size={14} />
            </a>
          </div>

          {/* Job Role Card */}
          <div
            className="rounded-2xl p-6 flex flex-col justify-between"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            <div>
              <h3 className="font-heading font-bold text-sm mb-2" style={{ color: 'var(--text-muted)' }}>
                Job Role
              </h3>
              <p className="font-heading font-bold text-lg" style={{ color: 'var(--text)' }}>
                Software Engineer
              </p>
            </div>
            <div>
              <h3 className="font-heading font-bold text-sm mb-2" style={{ color: 'var(--text-muted)' }}>
                Employment Type
              </h3>
              <p className="font-heading font-bold text-lg" style={{ color: 'var(--text)' }}>
                Full-time
              </p>
            </div>
          </div>
        </motion.div>

        {/* Skills Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl p-6 mb-8"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <h2 className="font-heading font-bold text-xl mb-6" style={{ color: 'var(--text)' }}>
            Required Skills ({company.skills.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {company.skills.map(skill => {
              const level = getLevel(skill)
              const colors = LEVEL_COLORS[level]
              return (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center justify-between p-3 rounded-xl"
                  style={{ background: 'var(--background)', border: '1px solid var(--border)' }}
                >
                  <span style={{ color: 'var(--text)', fontWeight: '500' }}>
                    {skill}
                  </span>
                  <span
                    className="text-xs px-3 py-1 rounded-full font-semibold"
                    style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}
                  >
                    {level}
                  </span>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Bottom CTA with Roadmap Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex gap-4 items-center"
        >
          <button
            onClick={() => navigate(`/roadmap/${company.companyId || company.id}/software-engineer`)}
            className="px-6 py-3 rounded-xl font-semibold text-white transition-all transform hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, var(--accent), var(--secondary))',
              boxShadow: '0 4px 15px rgba(108,99,255,0.3)',
            }}
          >
            View Learning Roadmap →
          </button>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Get step-by-step guidance to master all required skills
          </p>
        </motion.div>

        {/* Floating Projects button */}
        <button
          onClick={handleOpenProjects}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-full font-semibold text-white shadow-xl"
          style={{
            background: 'linear-gradient(135deg, var(--accent), var(--secondary))',
          }}
        >
          <GitBranch size={18} />
          Projects
        </button>

        <AnimatePresence>
          {isProjectOpen && (
            <ProjectsPanel
              companyName={company.name}
              skills={company.skills}
              companyId={company._id}
              onClose={() => setIsProjectOpen(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  )
}
