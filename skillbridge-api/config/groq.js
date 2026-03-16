const axios = require('axios');
const { GROQ_MODEL } = require('./ai.config');

const GROQ_BASE_URL = 'https://api.groq.com/openai/v1';
const DEFAULT_MODEL = GROQ_MODEL;
const MAX_RETRIES = 3;

/**
 * Call Groq Chat Completions with exponential backoff retry
 */
const groqChat = async (messages, options = {}) => {
  const {
    model = DEFAULT_MODEL,
    temperature = 0.7,
    max_tokens = 4096,
    retries = MAX_RETRIES,
  } = options;

  let lastError;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await axios.post(
        `${GROQ_BASE_URL}/chat/completions`,
        {
          model,
          messages,
          temperature,
          max_tokens,
          stream: false,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            'Content-Type': 'application/json',
          },
          timeout: 60000,
        }
      );

      const content = response.data?.choices?.[0]?.message?.content;
      if (!content) throw new Error('Empty response from Groq');
      return content;

    } catch (err) {
      lastError = err;
      const status = err.response?.status;

      // Don't retry on auth or bad request errors
      if (status === 401 || status === 400) {
        throw new Error(`Groq API error ${status}: ${err.response?.data?.error?.message || err.message}`);
      }

      // Rate limit or server error — retry with backoff
      if (attempt < retries) {
        const delay = Math.pow(2, attempt) * 1000 + Math.random() * 500;
        console.warn(`⚠️  Groq attempt ${attempt} failed (${status || err.code}). Retrying in ${Math.round(delay)}ms...`);
        await sleep(delay);
      }
    }
  }

  throw new Error(`Groq API failed after ${retries} attempts: ${lastError?.message}`);
};

/**
 * Parse JSON from AI response — handles markdown code blocks
 */
const parseGroqJSON = (text) => {
  // Strip markdown code fences if present
  const stripped = text
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/, '')
    .trim();

  try {
    return JSON.parse(stripped);
  } catch {
    // Try extracting JSON array or object with regex
    const arrayMatch = stripped.match(/\[[\s\S]*\]/);
    if (arrayMatch) {
      try { return JSON.parse(arrayMatch[0]); } catch {}
    }
    const objMatch = stripped.match(/\{[\s\S]*\}/);
    if (objMatch) {
      try { return JSON.parse(objMatch[0]); } catch {}
    }
    throw new Error(`Failed to parse Groq JSON response: ${stripped.slice(0, 200)}`);
  }
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

module.exports = { groqChat, parseGroqJSON };
