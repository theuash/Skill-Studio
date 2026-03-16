const axios = require('axios');
const { hfInference } = require('../config/huggingface');
const { analyzeProjectWithGroq } = require('./aiService');

/**
 * Parse GitHub URL to extract owner and repo
 */
const parseGitHubUrl = (url) => {
  try {
    const cleaned = url.replace(/\/$/, '').replace(/\.git$/, '');
    const match = cleaned.match(/github\.com[/:]([^/]+)\/([^/]+)/);
    if (!match) throw new Error('Invalid GitHub URL format');
    return { owner: match[1], repo: match[2] };
  } catch {
    throw new Error('Could not parse GitHub repository URL');
  }
};

/**
 * Build GitHub API headers (with optional auth token for higher rate limits)
 */
const githubHeaders = () => {
  const headers = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'SkillBridge-Analyzer/1.0',
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
};

/**
 * Fetch repo README content
 */
const fetchReadme = async (owner, repo) => {
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/readme`,
      { headers: githubHeaders(), timeout: 15000 }
    );
    const content = response.data?.content;
    if (!content) return null;
    // GitHub returns base64-encoded content
    return Buffer.from(content, 'base64').toString('utf8');
  } catch (err) {
    if (err.response?.status === 404) return null;
    throw err;
  }
};

/**
 * Fetch repo file tree (top-level + one level deep)
 */
const fetchFileTree = async (owner, repo) => {
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/git/trees/HEAD?recursive=1`,
      { headers: githubHeaders(), timeout: 15000 }
    );

    const tree = response.data?.tree || [];
    // Get file paths, limit to 100
    const files = tree
      .filter((item) => item.type === 'blob')
      .map((item) => item.path)
      .slice(0, 100);

    return files;
  } catch {
    // Fallback: get root contents
    try {
      const root = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/contents`,
        { headers: githubHeaders(), timeout: 10000 }
      );
      return root.data.map((item) => item.name);
    } catch {
      return [];
    }
  }
};

/**
 * Fetch repo metadata
 */
const fetchRepoMetadata = async (owner, repo) => {
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}`,
      { headers: githubHeaders(), timeout: 10000 }
    );
    return response.data;
  } catch {
    return null;
  }
};

/**
 * Detect repo characteristics from file structure
 */
const analyzeFileStructure = (files) => {
  const hasTests = files.some((f) =>
    /\.(test|spec)\.(js|ts|jsx|tsx|py|rb|go|java)$/.test(f) ||
    /\/(test|tests|__tests__|spec)\//i.test(f)
  );

  const hasReadme = files.some((f) => /^readme\./i.test(f));

  const extensions = [...new Set(files.map((f) => f.split('.').pop()).filter(Boolean))];
  const languageMap = {
    js: 'JavaScript', jsx: 'JavaScript', ts: 'TypeScript', tsx: 'TypeScript',
    py: 'Python', rb: 'Ruby', go: 'Go', java: 'Java', rs: 'Rust',
    cpp: 'C++', cs: 'C#', php: 'PHP', swift: 'Swift', kt: 'Kotlin',
  };
  const languages = [...new Set(extensions.map((e) => languageMap[e]).filter(Boolean))];

  const hasDocker = files.some((f) => /dockerfile/i.test(f) || f === 'docker-compose.yml');
  const hasCI = files.some((f) => /\.(github|gitlab-ci|circleci)/i.test(f));
  const hasEnvExample = files.some((f) => /\.env(\.example|\.sample)?$/i.test(f));

  const topFiles = files.slice(0, 20);

  return { hasTests, hasReadme, languages, hasDocker, hasCI, hasEnvExample, topFiles, fileCount: files.length };
};

/**
 * Main repo analysis function
 */
const analyzeRepository = async (repoUrl, projectData) => {
  const { owner, repo } = parseGitHubUrl(repoUrl);

  // Fetch repo data in parallel
  const [readme, files, metadata] = await Promise.allSettled([
    fetchReadme(owner, repo),
    fetchFileTree(owner, repo),
    fetchRepoMetadata(owner, repo),
  ]);

  // Check if repo is accessible
  if (metadata.status === 'rejected') {
    const err = metadata.reason;
    if (err.response?.status === 404) {
      throw Object.assign(new Error('Repository not found. Make sure the repo is public and the URL is correct.'), { statusCode: 400 });
    }
    if (err.response?.status === 403) {
      throw Object.assign(new Error('Repository is private. Please make your repository public to enable AI analysis.'), { statusCode: 400 });
    }
    throw new Error(`Could not access repository: ${err.message}`);
  }

  const readmeContent = readme.status === 'fulfilled' ? readme.value : null;
  const fileList = files.status === 'fulfilled' ? files.value : [];
  const repoMeta = metadata.status === 'fulfilled' ? metadata.value : null;

  const fileAnalysis = analyzeFileStructure(fileList);
  const repoStructure = fileList.slice(0, 80).join('\n');

  // Build analysis context
  const analysisContext = {
    projectTitle: projectData.title,
    projectDescription: projectData.description,
    jobRole: projectData.jobRole,
    techStack: projectData.techStack,
    acceptanceCriteria: projectData.acceptanceCriteria,
    repoStructure,
    readmeContent,
  };

  let analysisResult;

  // Try HuggingFace first, fall back to Groq
  try {
    const hfPrompt = `<s>[INST] You are a senior software engineer doing a thorough code review.

Project: "${projectData.title}"
Tech Stack: ${projectData.techStack.join(', ')}
Required criteria: ${projectData.acceptanceCriteria.slice(0, 6).join('; ')}

README excerpt:
${readmeContent ? readmeContent.slice(0, 1000) : 'No README found'}

File structure:
${repoStructure.slice(0, 600)}

Provide code review as JSON with fields: overallScore (0-100), summary, codeQuality{score,summary,items[]}, architecture{score,summary,items[]}, bestPractices{score,summary,items[]}, testCoverage{score,summary,items[]}, performance{score,summary,items[]}, security{score,summary,items[]}, strengths[], improvements[], nextSteps[]

Return ONLY valid JSON. [/INST]`;

    const hfResponse = await hfInference(hfPrompt, { maxNewTokens: 2000, temperature: 0.2 });

    // Extract JSON from HuggingFace response
    const jsonMatch = hfResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      analysisResult = JSON.parse(jsonMatch[0]);
    } else {
      throw new Error('HuggingFace did not return JSON');
    }
  } catch (hfErr) {
    console.warn(`⚠️  HuggingFace analysis failed: ${hfErr.message}. Falling back to Groq...`);
    analysisResult = await analyzeProjectWithGroq(analysisContext);
  }

  // Validate and sanitize result
  const safe = (val, def = 0) => (typeof val === 'number' && val >= 0 && val <= 100 ? Math.round(val) : def);
  const safeSection = (obj) => ({
    score: safe(obj?.score, 65),
    summary: String(obj?.summary || ''),
    items: Array.isArray(obj?.items) ? obj.items.filter((i) => typeof i === 'string') : [],
  });

  return {
    overallScore: safe(analysisResult.overallScore, 65),
    summary: String(analysisResult.summary || ''),
    codeQuality: safeSection(analysisResult.codeQuality),
    architecture: safeSection(analysisResult.architecture),
    bestPractices: safeSection(analysisResult.bestPractices),
    testCoverage: safeSection(analysisResult.testCoverage),
    performance: safeSection(analysisResult.performance),
    security: safeSection(analysisResult.security),
    strengths: Array.isArray(analysisResult.strengths)
      ? analysisResult.strengths.filter((s) => typeof s === 'string').slice(0, 6)
      : [],
    improvements: Array.isArray(analysisResult.improvements)
      ? analysisResult.improvements.filter((s) => typeof s === 'string').slice(0, 6)
      : [],
    nextSteps: Array.isArray(analysisResult.nextSteps)
      ? analysisResult.nextSteps.filter((s) => typeof s === 'string').slice(0, 6)
      : [],
    repoMetadata: {
      fileCount: fileAnalysis.fileCount,
      hasReadme: fileAnalysis.hasReadme || !!readmeContent,
      hasTests: fileAnalysis.hasTests,
      languages: fileAnalysis.languages,
      topFiles: fileAnalysis.topFiles,
    },
  };
};

module.exports = { analyzeRepository, parseGitHubUrl };
