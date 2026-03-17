const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const ProjectProblem = require('../models/ProjectProblem');
const ProjectAnalysis = require('../models/ProjectAnalysis');
const { groqChat, parseGroqJSON } = require('../config/groq');
const { asyncHandler } = require('../middleware/errorHandler');
const axios = require('axios');

/**
 * POST /api/projects/generate-problem
 * Generate a problem statement for a company
 */
const generateProblem = asyncHandler(async (req, res) => {
  const { companyId, companyName, skills } = req.body;

  if (!companyName || !Array.isArray(skills) || skills.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Company name and skills array are required.',
    });
  }

  // Validate companyId if provided
  if (companyId && !mongoose.Types.ObjectId.isValid(companyId)) {
    return res.status(400).json({
      success: false,
      error: `Invalid companyId: "${companyId}". Must be a valid MongoDB ObjectId.`,
    });
  }

  const skillsList = skills
    .map((s) => {
      const name = typeof s === 'string' ? s : s.name;
      const level = typeof s === 'object' && s.level ? s.level : 'Intermediate';
      return `${name} (${level})`;
    })
    .join(', ');

  const prompt = `You are a senior engineering hiring manager. You create realistic, practical project challenges for job candidates.
Respond with ONLY valid JSON. No markdown, no code fences, no text outside the JSON.

Create a project challenge for a candidate applying to ${companyName}.

The project MUST require ALL these skills:
${skills.map((s) => `- ${typeof s === 'string' ? s : s.name} (${typeof s === 'object' && s.level ? s.level : 'Intermediate'})`).join('\n')}

Requirements:
- Real-world practical project, NOT a toy example
- Each skill MUST be meaningfully used, not just mentioned
- Completable in 2-5 days
- Clear acceptance criteria
- Specific deliverables

Return ONLY this JSON structure with no other text:
{
  "title": "string - project title",
  "description": "string - 3-4 sentence project description",
  "technicalRequirements": [
    { "skill": "skill name", "requirement": "what to build with this skill" }
  ],
  "acceptanceCriteria": ["criterion 1", "criterion 2", "criterion 3"],
  "deliverables": ["deliverable 1", "deliverable 2"],
  "difficulty": "Intermediate"
}`;

  try {
    const response = await groqChat(
      [
        {
          role: 'system',
          content: 'You are a hiring manager. Always respond with valid JSON only.',
        },
        { role: 'user', content: prompt },
      ],
      { temperature: 0.7, max_tokens: 2000 }
    );

    const problemData = parseGroqJSON(response);

    const problem = await ProjectProblem.create({
      companyId,
      companyName,
      skills,
      ...problemData,
    });

    return res.status(201).json({
      success: true,
      message: 'Problem statement generated successfully.',
      data: {
        problemId: problem._id,
        ...problem.toObject(),
      },
    });
  } catch (err) {
    console.error('❌ Problem generation failed:', err.message, err.stack);
    return res.status(500).json({
      success: false,
      error: process.env.NODE_ENV === 'development' ? err.message : 'AI response was invalid, please try again',
    });
  }
});

/**
 * POST /api/projects/analyze
 * Analyze a GitHub repository against a problem statement
 */
const analyzeProject = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { problemId, githubUrl, skills, problemStatement } = req.body;

  // Validate GitHub URL
  const githubUrlPattern = /^https:\/\/github\.com\/[\w-]+\/[\w.-]+\/?$/;
  if (!githubUrlPattern.test(githubUrl)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid GitHub URL (https://github.com/user/repo)',
    });
  }

  try {
    // Fetch repo content from GitHub
    const [owner, repo] = githubUrl.replace('https://github.com/', '').replace(/\/$/, '').split('/');
    const githubToken = process.env.GITHUB_TOKEN;

    // Fetch README
    let readmeContent = '';
    try {
      const readmeRes = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/readme`,
        {
          headers: {
            Authorization: `token ${githubToken}`,
            Accept: 'application/vnd.github.v3.raw',
          },
        }
      );
      readmeContent = readmeRes.data;
    } catch (err) {
      if (err.response?.status === 404) {
        // No README is okay
      } else if (err.response?.status === 403) {
        return res.status(403).json({
          success: false,
          message: 'Please make your repository public to enable analysis.',
        });
      }
    }

    // Fetch tree structure
    let fileStructure = '';
    try {
      const treeRes = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/git/trees/HEAD?recursive=1`,
        {
          headers: {
            Authorization: `token ${githubToken}`,
          },
        }
      );

      if (treeRes.data?.tree?.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Repository appears to be empty.',
        });
      }

      fileStructure = treeRes.data.tree
        .filter((f) => !f.path.includes('node_modules') && !f.path.includes('.git'))
        .slice(0, 50)
        .map((f) => `${f.path} ${f.type === 'tree' ? '[DIR]' : ''}`)
        .join('\n');
    } catch (err) {
      if (err.response?.status === 409) {
        return res.status(400).json({
          success: false,
          message: 'Repository appears to be empty.',
        });
      }
    }

    // Fetch package.json / requirements.txt if present
    let keyFiles = '';
    const fileNames = ['package.json', 'requirements.txt', 'go.mod', 'Cargo.toml'];
    for (const fileName of fileNames) {
      try {
        const fileRes = await axios.get(
          `https://api.github.com/repos/${owner}/${repo}/contents/${fileName}`,
          {
            headers: {
              Authorization: `token ${githubToken}`,
              Accept: 'application/vnd.github.v3.raw',
            },
          }
        );
        keyFiles += `\n\n=== ${fileName} ===\n${fileRes.data.slice(0, 500)}\n`;
      } catch (err) {
        // File doesn't exist, skip
      }
    }

    // Build analysis prompt
    const skillsList = skills
      .map((s) => {
        const name = typeof s === 'string' ? s : s.name;
        const level = typeof s === 'object' && s.level ? s.level : 'Intermediate';
        return `${name} (${level})`;
      })
      .join(', ');
    const criteriaList = (problemStatement?.acceptanceCriteria || []).join('\n- ');

    const analysisPrompt = `You are a senior software engineer conducting a strict code review.
Be honest, specific, and constructive.
Respond with ONLY valid JSON. No markdown, no code fences.

Analyze this GitHub repository submitted for the following project:

PROJECT: ${problemStatement?.title}
DESCRIPTION: ${problemStatement?.description}
REQUIRED SKILLS: ${skillsList}
ACCEPTANCE CRITERIA:
- ${criteriaList}

REPOSITORY:
README: ${readmeContent.slice(0, 800)}
FILES: ${fileStructure.slice(0, 800)}
CONFIG: ${keyFiles.slice(0, 800)}

Be strict: if a skill is not meaningfully demonstrated, mark it FAIL.

Return ONLY this JSON structure:
{
  "overallResult": "PASS" | "PARTIAL" | "FAIL",
  "overallScore": number 0-100,
  "summary": string (3-4 sentences, honest assessment),
  "skillResults": [
    {
      "skill": string,
      "status": "PASS" | "FAIL" | "NEEDS_IMPROVEMENT",
      "score": number (0-100),
      "feedback": string,
      "improvements": string[]
    }
  ],
  "criteriaResults": [
    {
      "criterion": string,
      "met": boolean,
      "comment": string
    }
  ],
  "strengths": string[],
  "weaknesses": string[],
  "overallFeedback": string
}`;

    const analysisResponse = await groqChat(
      [
        {
          role: 'system',
          content: 'You are a senior engineer. Always respond with valid JSON only.',
        },
        { role: 'user', content: analysisPrompt },
      ],
      { temperature: 0.5, max_tokens: 3000 }
    );

    const analysisData = parseGroqJSON(analysisResponse);

    // Save analysis
    const analysis = await ProjectAnalysis.create({
      problemId,
      userId,
      githubUrl,
      ...analysisData,
    });

    return res.status(201).json({
      success: true,
      message: 'Project analysis completed.',
      data: analysis.toObject(),
    });
  } catch (err) {
    console.error('❌ Analysis failed:', err.message, err.stack);
    return res.status(500).json({
      success: false,
      error: process.env.NODE_ENV === 'development' ? err.message : 'Analysis failed. Please try again.',
    });
  }
});

/**
 * GET /api/projects/my-projects
 * Get all projects submitted by the logged-in user
 */
const getMyProjects = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const projects = await ProjectAnalysis.find({ userId })
    .populate('problemId', 'title companyName')
    .sort({ analyzedAt: -1 })
    .lean();

  return res.status(200).json({
    success: true,
    message: 'Projects fetched successfully.',
    data: { projects, total: projects.length },
  });
});

/**
 * POST /api/projects/generate-custom
 * Generate a custom project challenge based on selected skills (no company context)
 */
const generateCustomProblem = asyncHandler(async (req, res) => {
  const { skills, difficulty } = req.body;

  if (!Array.isArray(skills) || skills.length < 2) {
    return res.status(400).json({
      success: false,
      error: 'At least 2 skills are required.',
    });
  }

  if (skills.length > 8) {
    return res.status(400).json({
      success: false,
      error: 'Maximum 8 skills allowed.',
    });
  }

  if (!['Beginner', 'Intermediate', 'Advanced'].includes(difficulty)) {
    return res.status(400).json({
      success: false,
      error: 'Difficulty must be Beginner, Intermediate, or Advanced.',
    });
  }

  const skillsList = skills
    .map((s) => {
      const name = typeof s === 'string' ? s : s.name;
      const level = typeof s === 'object' && s.level ? s.level : difficulty;
      return `${name} (${level})`;
    })
    .join(', ');

  const systemPrompt = `You are a senior engineering mentor creating practical project challenges for developers.
Respond with ONLY valid JSON. No markdown, no code fences, no text outside the JSON.`;

  const userPrompt = `Create a project challenge for a developer who wants to practice these skills:
${skills.map((s) => `- ${typeof s === 'string' ? s : s.name}`).join('\n')}

Difficulty: ${difficulty}

Requirements:
- Real-world practical project (not a toy example)
- ALL selected skills must be meaningfully used
- Should be completable in 3-7 days
- Clear and specific requirements

Return this exact JSON and nothing else:
{
  "title": "string",
  "description": "string - 3-4 sentences",
  "techStack": ["skill1", "skill2"],
  "technicalRequirements": [
    { "skill": "string", "requirement": "string" }
  ],
  "acceptanceCriteria": ["string"],
  "deliverables": ["string"],
  "bonusFeatures": ["string"],
  "difficulty": "${difficulty}",
  "estimatedTime": "string e.g. 3-5 days"
}`;

  try {
    const response = await groqChat(
      [
        {
          role: 'system',
          content: systemPrompt,
        },
        { role: 'user', content: userPrompt },
      ],
      { temperature: 0.7, max_tokens: 2000 }
    );

    const problemData = parseGroqJSON(response);

    const problem = await ProjectProblem.create({
      companyId: null,
      companyName: 'Custom Challenge',
      skills,
      ...problemData,
    });

    return res.status(201).json({
      success: true,
      message: 'Custom project challenge generated successfully.',
      data: {
        problemId: problem._id,
        ...problem.toObject(),
      },
    });
  } catch (err) {
    console.error('❌ Custom problem generation failed:', err.message, err.stack);
    return res.status(500).json({
      success: false,
      error: process.env.NODE_ENV === 'development' ? err.message : 'AI response was invalid, please try again',
    });
  }
});

module.exports = {
  generateProblem,
  analyzeProject,
  getMyProjects,
  generateCustomProblem,
};
