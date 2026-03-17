const { groqChat, parseGroqJSON } = require('../config/groq');

/**
 * Generate a learning roadmap for a company + job role
 */
const generateRoadmap = async ({ companyName, sector, jobRole, requiredSkills, knownSkills = [] }) => {
  const skillsList = requiredSkills
    .map((s) => `${s.skill} (${s.level})`)
    .join(', ');

  const knownList = knownSkills.length
    ? `The learner already knows: ${knownSkills.join(', ')}. Mark these as completed=true.`
    : 'The learner has no prior declared skills.';

  const prompt = `You are an expert career guidance AI for tech roles.

Generate a comprehensive, ordered learning roadmap as a JSON array.
Target role: ${jobRole} at a company like ${companyName} (${sector} sector).
Required skills to master: ${skillsList}.
${knownList}

Each node in the array must be a JSON object with EXACTLY these fields:
{
  "id": "node_1",                          (string, sequential: node_1, node_2...)
  "title": "HTML & CSS Fundamentals",      (clear, concise topic title)
  "description": "...",                    (2-3 sentences explaining what and why)
  "difficulty": "beginner",               (MUST be one of: beginner, intermediate, advanced)
  "estimatedHours": 20,                   (realistic number)
  "resources": [                          (2-4 real, free resources)
    { "title": "MDN HTML Basics", "url": "https://developer.mozilla.org/en-US/docs/Learn/HTML", "type": "docs" },
    { "title": "freeCodeCamp HTML Course", "url": "https://www.freecodecamp.org/learn/responsive-web-design/", "type": "course" }
  ],
  "prerequisites": [],                    (array of node ids this depends on, e.g. ["node_1"])
  "subTopics": ["Semantic HTML", "Flexbox", "CSS Grid"],  (3-6 specific subtopics)
  "completed": false,                     (set true if this skill is in the known skills list)
  "order": 1                              (integer ordering position)
}

Rules:
- Generate exactly 15-20 nodes
- Order them from fundamentals → advanced (breadth-first)
- Resources MUST be real URLs (MDN, YouTube, freeCodeCamp, official docs, roadmap.sh, etc.)
- Do NOT include paid resources
- subTopics should be specific and actionable
- prerequisites must reference real node ids in this array
- Return ONLY a valid JSON array — no markdown, no explanation, no code fences`;

  const response = await groqChat(
    [
      {
        role: 'system',
        content: 'You are a career guidance AI. Always respond with valid JSON only. No markdown. No explanations.',
      },
      { role: 'user', content: prompt },
    ],
    { temperature: 0.4, max_tokens: 6000 }
  );

  const nodes = parseGroqJSON(response);

  if (!Array.isArray(nodes)) {
    throw new Error('Roadmap generation returned non-array response');
  }

  // Sanitize and normalize each node
  return nodes.map((node, idx) => ({
    nodeId: node.id || `node_${idx + 1}`,
    title: node.title || `Topic ${idx + 1}`,
    description: node.description || '',
    difficulty: ['beginner', 'intermediate', 'advanced'].includes(node.difficulty)
      ? node.difficulty
      : 'intermediate',
    estimatedHours: Number(node.estimatedHours) || 10,
    resources: Array.isArray(node.resources)
      ? node.resources.filter((r) => r.url && r.title).slice(0, 5)
      : [],
    prerequisites: Array.isArray(node.prerequisites) ? node.prerequisites : [],
    subTopics: Array.isArray(node.subTopics) ? node.subTopics : [],
    completed: Boolean(node.completed),
    order: Number(node.order) || idx + 1,
  }));
};

/**
 * Generate a real-world project brief based on a roadmap
 */
const generateProject = async ({ companyName, jobRole, sector, skills, completedNodes }) => {
  const skillsList = skills.join(', ');
  const topicsCovered = completedNodes.slice(0, 8).map((n) => n.title).join(', ');

  const prompt = `You are a senior engineering manager assigning a portfolio project.

Generate a realistic, impressive portfolio project for a ${jobRole} position at a ${sector} company similar to ${companyName}.

The candidate has learned: ${skillsList}
Topics they've studied: ${topicsCovered}

Return a single JSON object with EXACTLY these fields:
{
  "title": "...",                         (specific, impressive project name)
  "description": "...",                   (3-4 sentences, what it does, why it's impressive, real-world relevance)
  "techStack": ["React", "Node.js"],      (specific technologies, 6-10 items)
  "acceptanceCriteria": [                 (8-12 specific, testable requirements)
    "User authentication with JWT and refresh token rotation",
    "..."
  ],
  "bonusFeatures": [                      (4-6 stretch goals)
    "Real-time updates via WebSockets",
    "..."
  ],
  "estimatedDays": 14,                    (realistic number 7-21)
  "difficulty": "intermediate"           (beginner/intermediate/advanced)
}

Make the project:
- Specific and realistic (not generic "todo app")
- Portfolio-worthy and impressive to hiring managers
- Achievable by a motivated learner in the estimated time
- Testing the exact skills learned in the roadmap

Return ONLY valid JSON — no markdown, no explanation.`;

  const response = await groqChat(
    [
      {
        role: 'system',
        content: 'You are a senior engineering manager. Always respond with valid JSON only.',
      },
      { role: 'user', content: prompt },
    ],
    { temperature: 0.6, max_tokens: 2048 }
  );

  const project = parseGroqJSON(response);

  if (!project || typeof project !== 'object' || !project.title) {
    throw new Error('Project generation returned invalid structure');
  }

  return {
    title: project.title,
    description: project.description || '',
    techStack: Array.isArray(project.techStack) ? project.techStack : [],
    acceptanceCriteria: Array.isArray(project.acceptanceCriteria) ? project.acceptanceCriteria : [],
    bonusFeatures: Array.isArray(project.bonusFeatures) ? project.bonusFeatures : [],
    estimatedDays: Number(project.estimatedDays) || 14,
    difficulty: ['beginner', 'intermediate', 'advanced'].includes(project.difficulty)
      ? project.difficulty
      : 'intermediate',
  };
};

/**
 * Analyze a project using Groq (fallback when HuggingFace fails)
 */
const analyzeProjectWithGroq = async ({
  projectTitle,
  projectDescription,
  jobRole,
  techStack,
  acceptanceCriteria,
  repoStructure,
  readmeContent,
}) => {
  const criteriaList = acceptanceCriteria.slice(0, 8).join('\n- ');

  const prompt = `You are a senior software engineer conducting a thorough code review.

Project: "${projectTitle}"
Job Role: ${jobRole}
Tech Stack: ${techStack.join(', ')}

Required acceptance criteria:
- ${criteriaList}

Repository README:
${readmeContent ? readmeContent.slice(0, 1500) : 'No README found'}

Repository file structure:
${repoStructure ? repoStructure.slice(0, 1000) : 'Unable to fetch'}

Provide a comprehensive code review as a JSON object with EXACTLY these fields:
{
  "overallScore": 75,
  "summary": "2-3 sentence overall assessment",
  "codeQuality": {
    "score": 78,
    "summary": "assessment of code quality",
    "items": ["✅ Good naming conventions", "⚠️ Some functions too long", "❌ Missing error handling in X"]
  },
  "architecture": {
    "score": 80,
    "summary": "assessment of architecture",
    "items": ["✅ Clean separation of concerns", "⚠️ Missing service layer", "..."]
  },
  "bestPractices": {
    "score": 72,
    "summary": "assessment of best practices",
    "items": ["✅ Environment variables used", "❌ No input validation", "..."]
  },
  "testCoverage": {
    "score": 45,
    "summary": "assessment of testing",
    "items": ["⚠️ Only unit tests", "❌ No integration tests", "✅ Critical paths covered"]
  },
  "performance": {
    "score": 70,
    "summary": "performance assessment",
    "items": ["✅ Database indexes present", "⚠️ No caching layer", "..."]
  },
  "security": {
    "score": 85,
    "summary": "security assessment",
    "items": ["✅ Passwords hashed", "✅ JWT implemented", "⚠️ Missing rate limiting"]
  },
  "strengths": [
    "Specific strength 1",
    "Specific strength 2",
    "Specific strength 3",
    "Specific strength 4"
  ],
  "improvements": [
    "Specific improvement 1",
    "Specific improvement 2",
    "Specific improvement 3",
    "Specific improvement 4"
  ],
  "nextSteps": [
    "Actionable next step 1",
    "Actionable next step 2",
    "Actionable next step 3",
    "Actionable next step 4"
  ]
}

Be honest and specific. Mention actual patterns, missing features from the acceptance criteria.
Return ONLY valid JSON.`;

  const response = await groqChat(
    [
      {
        role: 'system',
        content: 'You are a senior software engineer doing a code review. Always respond with valid JSON.',
      },
      { role: 'user', content: prompt },
    ],
    { temperature: 0.3, max_tokens: 3000 }
  );

  return parseGroqJSON(response);
};

/**
 * Generate daily industry news briefing
 */
const generateNews = async () => {
  const prompt = `You are an expert AI news curator for tech professionals. Generate today's industry news briefing as a JSON object.

Focus on: Tech, Finance, Healthcare, Education, Manufacturing sectors.
Today's date: ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}

Return a JSON object with EXACTLY these fields:
{
  "headline": "One compelling headline for today's top story",
  "articles": [
    {
      "id": "article_1",
      "title": "Specific, engaging article title",
      "summary": "3-4 sentence summary of the news",
      "sector": "Tech|Finance|Healthcare|Education|Manufacturing",
      "category": "AI|Cloud|FinTech|Biotech|EdTech|Manufacturing|Policy|Security",
      "impact": "High|Medium|Low",
      "readTime": "3 min read",
      "tags": ["AI", "Machine Learning", "Automation"]
    }
  ],
  "trendingSkills": [
    {
      "skill": "Python",
      "trend": "Rising|Declining|Stable",
      "demandScore": 85
    }
  ],
  "sectorSummary": {
    "Tech": "Brief 1-2 sentence summary of tech sector news",
    "Finance": "Brief 1-2 sentence summary of finance sector news",
    "Healthcare": "Brief 1-2 sentence summary of healthcare sector news",
    "Education": "Brief 1-2 sentence summary of education sector news",
    "Manufacturing": "Brief 1-2 sentence summary of manufacturing sector news"
  }
}

Requirements:
- Generate 12-15 articles across all sectors
- Mix of High/Medium/Low impact stories
- Realistic, current industry topics (not fictional)
- 8-12 trending skills with realistic demand scores (0-100)
- Headlines and summaries should be engaging and professional
- Tags should be relevant keywords for each article
- Return ONLY valid JSON — no markdown, no explanation`

  const response = await groqChat(
    [
      {
        role: 'system',
        content: 'You are a professional news curator. Always respond with valid JSON only. No markdown. No explanations.',
      },
      { role: 'user', content: prompt },
    ],
    { temperature: 0.7, max_tokens: 4000 }
  );

  const newsData = parseGroqJSON(response);

  if (!newsData || typeof newsData !== 'object' || !newsData.articles) {
    throw new Error('News generation returned invalid structure');
  }

  // Sanitize and normalize the data
  return {
    headline: newsData.headline || 'Industry News Update',
    articles: Array.isArray(newsData.articles)
      ? newsData.articles.map((article, idx) => ({
          id: article.id || `article_${idx + 1}`,
          title: article.title || `Article ${idx + 1}`,
          summary: article.summary || '',
          sector: ['Tech', 'Finance', 'Healthcare', 'Education', 'Manufacturing'].includes(article.sector)
            ? article.sector
            : 'Tech',
          category: article.category || 'Technology',
          impact: ['High', 'Medium', 'Low'].includes(article.impact) ? article.impact : 'Medium',
          readTime: article.readTime || '3 min read',
          tags: Array.isArray(article.tags) ? article.tags : []
        }))
      : [],
    trendingSkills: Array.isArray(newsData.trendingSkills)
      ? newsData.trendingSkills.map(skill => ({
          skill: skill.skill || 'Unknown Skill',
          trend: ['Rising', 'Declining', 'Stable'].includes(skill.trend) ? skill.trend : 'Stable',
          demandScore: Math.min(100, Math.max(0, Number(skill.demandScore) || 50))
        }))
      : [],
    sectorSummary: typeof newsData.sectorSummary === 'object' ? newsData.sectorSummary : {}
  };
};

module.exports = { generateRoadmap, generateProject, analyzeProjectWithGroq, generateNews };
