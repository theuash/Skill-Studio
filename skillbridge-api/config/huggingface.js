const axios = require('axios');

const HF_BASE_URL = 'https://api-inference.huggingface.co/models';
// Primary model for code analysis
const PRIMARY_MODEL = 'mistralai/Mixtral-8x7B-Instruct-v0.1';
const FALLBACK_MODEL = 'HuggingFaceH4/zephyr-7b-beta';

/**
 * Call Hugging Face Inference API with fallback
 */
const hfInference = async (prompt, options = {}) => {
  const { maxNewTokens = 2048, temperature = 0.3 } = options;

  const models = [PRIMARY_MODEL, FALLBACK_MODEL];

  for (const model of models) {
    try {
      const response = await axios.post(
        `${HF_BASE_URL}/${model}`,
        {
          inputs: prompt,
          parameters: {
            max_new_tokens: maxNewTokens,
            temperature,
            return_full_text: false,
            do_sample: true,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          timeout: 120000,
        }
      );

      // HF returns array of generated texts
      const generated = response.data?.[0]?.generated_text;
      if (generated) return generated;

      throw new Error('Empty response from Hugging Face');

    } catch (err) {
      const status = err.response?.status;

      // Model loading (503) — wait and retry same model
      if (status === 503) {
        const waitTime = err.response?.data?.estimated_time
          ? err.response.data.estimated_time * 1000
          : 20000;
        console.warn(`⚠️  HF model ${model} loading... waiting ${Math.round(waitTime / 1000)}s`);
        await sleep(Math.min(waitTime, 30000));

        try {
          const retry = await axios.post(
            `${HF_BASE_URL}/${model}`,
            {
              inputs: prompt,
              parameters: { max_new_tokens: maxNewTokens, temperature, return_full_text: false },
            },
            {
              headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}` },
              timeout: 120000,
            }
          );
          const retryText = retry.data?.[0]?.generated_text;
          if (retryText) return retryText;
        } catch (retryErr) {
          console.warn(`HF retry failed: ${retryErr.message}`);
        }
      }

      if (model === models[models.length - 1]) {
        throw new Error(`Hugging Face API failed: ${err.response?.data?.error || err.message}`);
      }
      console.warn(`HF model ${model} failed, trying fallback...`);
    }
  }
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

module.exports = { hfInference };
